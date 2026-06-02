import { resolve } from "node:path"

import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

import { scoreAnnouncementImpact } from "../src/lib/scoring/announcement-impact.ts"

dotenv.config({ path: resolve(process.cwd(), ".env.local"), quiet: true })

const url =
  process.env.SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL

const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? null

function toIsoNow() {
  return new Date().toISOString()
}

function valuesMatch(left, right) {
  return (left ?? null) === (right ?? null)
}

function createReasonKey(itemId, scoring) {
  return `rns-impact:${itemId}:${scoring.classification}:${scoring.impactDirection}:${scoring.impactScore}:${scoring.riskLevel}:${scoring.priority}`
}

async function ensureScoringColumnsExist(supabase) {
  const { error } = await supabase
    .from("intelligence_items")
    .select(
      "id,classification,impact_direction,impact_score,risk_level,priority,scoring_reason,scored_at",
    )
    .limit(1)

  if (error) {
    console.error("RNS impact scoring columns are not available yet.")
    console.error(
      "Apply supabase/migrations/20260607_phase8_impact_scoring.sql before running `npm run score:rns:impact`.",
    )
    console.error(`Supabase returned: ${error.message}`)
    return false
  }

  return true
}

async function main() {
  if (!url || !key) {
    const missing = []

    if (!url) {
      missing.push("SUPABASE_URL")
    }

    if (!key) {
      missing.push("SUPABASE_SERVICE_ROLE_KEY")
    }

    console.error("Missing required Supabase environment variables for RNS impact scoring.")
    console.error(`Checked project root .env.local at ${resolve(process.cwd(), ".env.local")}.`)
    console.error(`Still missing: ${missing.join(", ")}.`)
    console.error(
      "Add the missing values to .env.local or export them in the shell before running `npm run score:rns:impact`.",
    )
    return 1
  }

  const supabase = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })

  if (!(await ensureScoringColumnsExist(supabase))) {
    return 1
  }

  const { data: rnsSources, error: sourceError } = await supabase
    .from("intelligence_sources")
    .select("id,name")
    .eq("source_type", "rns")

  if (sourceError) {
    console.error("Unable to load RNS intelligence sources.")
    console.error(sourceError.message)
    return 1
  }

  const sourceIds = (rnsSources ?? []).map((source) => source.id)

  if (!sourceIds.length) {
    console.log(
      JSON.stringify(
        {
          scoredItems: 0,
          skippedItems: 0,
          highPriorityReview: 0,
          speculativeReview: 0,
          avoidOrReassess: 0,
          note: "No RNS sources were found. Nothing was scored.",
        },
        null,
        2,
      ),
    )
    return 0
  }

  const [{ data: rawAnnouncements, error: rawError }, { data: items, error: itemError }] =
    await Promise.all([
      supabase
        .from("raw_announcements")
        .select(
          "id,source_id,asset_symbol,company_name,headline,announcement_type,raw_category,published_at",
        )
        .in("source_id", sourceIds)
        .order("published_at", { ascending: false }),
      supabase
        .from("intelligence_items")
        .select(
          "id,source_id,raw_announcement_id,asset_symbol,headline,summary,classification,impact_direction,impact_score,risk_level,priority,scoring_reason,scored_at,published_at",
        )
        .in("source_id", sourceIds)
        .order("created_at", { ascending: false }),
    ])

  if (rawError || itemError) {
    console.error("Unable to load RNS announcements for scoring.")
    console.error(rawError?.message ?? itemError?.message ?? "Unknown error")
    return 1
  }

  const rawById = new Map((rawAnnouncements ?? []).map((announcement) => [announcement.id, announcement]))
  const scoredAt = toIsoNow()

  let scoredItems = 0
  let skippedItems = 0
  let highPriorityReview = 0
  let speculativeReview = 0
  let avoidOrReassess = 0
  let failureCount = 0

  for (const item of items ?? []) {
    const rawAnnouncement = item.raw_announcement_id
      ? rawById.get(item.raw_announcement_id)
      : null

    const scoring = scoreAnnouncementImpact({
      announcementType: rawAnnouncement?.announcement_type ?? item.classification,
      headline: rawAnnouncement?.headline ?? item.headline,
      rawCategory: rawAnnouncement?.raw_category ?? null,
      summary: item.summary ?? "",
      assetSymbol: rawAnnouncement?.asset_symbol ?? item.asset_symbol,
      companyName: rawAnnouncement?.company_name ?? null,
    })

    const scoringReason = scoring.scoringReason
    const needsUpdate =
      !valuesMatch(item.classification, scoring.classification) ||
      !valuesMatch(item.impact_direction, scoring.impactDirection) ||
      Number(item.impact_score ?? 0) !== scoring.impactScore ||
      !valuesMatch(item.risk_level, scoring.riskLevel) ||
      !valuesMatch(item.priority, scoring.priority) ||
      !valuesMatch(item.scoring_reason, scoringReason) ||
      item.scored_at == null

    if (!needsUpdate) {
      skippedItems += 1
      continue
    }

    const { error: updateError } = await supabase
      .from("intelligence_items")
      .update({
        classification: scoring.classification,
        impact_direction: scoring.impactDirection,
        impact_score: scoring.impactScore,
        risk_level: scoring.riskLevel,
        priority: scoring.priority,
        scoring_reason: scoringReason,
        scored_at: scoredAt,
      })
      .eq("id", item.id)

    if (updateError) {
      console.error(`Failed to score intelligence item ${item.id}.`)
      console.error(updateError.message)
      failureCount += 1
      continue
    }

    scoredItems += 1
    if (scoring.priority === "high_priority_review") {
      highPriorityReview += 1
    }
    if (scoring.priority === "speculative_review") {
      speculativeReview += 1
    }
    if (scoring.priority === "avoid_or_reassess") {
      avoidOrReassess += 1
    }

    if (!item.asset_symbol) {
      continue
    }

    const reasonKey = createReasonKey(item.id, scoring)
    const { data: existingHistory } = await supabase
      .from("score_history")
      .select("id")
      .eq("asset_symbol", item.asset_symbol)
      .eq("score_type", "opportunity")
      .eq("reason", reasonKey)
      .maybeSingle()

    if (existingHistory) {
      continue
    }

    const previousScore = item.impact_score == null ? null : Number(item.impact_score)
    const scoreDelta =
      previousScore == null ? null : scoring.impactScore - previousScore

    const { error: historyError } = await supabase.from("score_history").insert([
      {
        asset_symbol: item.asset_symbol,
        score_type: "opportunity",
        score: scoring.impactScore,
        previous_score: previousScore,
        score_delta: scoreDelta,
        reason: reasonKey,
        calculated_at: scoredAt,
      },
    ])

    if (historyError) {
      console.error(`Failed to record score history for intelligence item ${item.id}.`)
      console.error(historyError.message)
      failureCount += 1
    }
  }

  console.log(
    JSON.stringify(
      {
        scoredItems,
        skippedItems,
        highPriorityReview,
        speculativeReview,
        avoidOrReassess,
        note: "Announcement scoring remains deterministic and review-only.",
      },
      null,
      2,
    ),
  )

  return failureCount > 0 ? 1 : 0
}

const exitCode = await main()
process.exitCode = exitCode
