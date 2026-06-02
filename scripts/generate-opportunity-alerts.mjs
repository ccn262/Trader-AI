import { resolve } from "node:path";

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

import {
  generateOpportunityAlertPayload,
  shouldGenerateAlert,
} from "../src/lib/scoring/opportunity-alert-generator.ts";

dotenv.config({ path: resolve(process.cwd(), ".env.local"), quiet: true });

const url =
  process.env.SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;

const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;

async function ensureAlertGenerationColumnsExist(supabase) {
  const { error } = await supabase
    .from("opportunity_alerts")
    .select(
      "id,source_intelligence_item_id,generated_by,generation_reason,invalidation_notes,review_by,confidence_label",
    )
    .limit(1);

  if (error) {
    console.error("Opportunity alert generation columns are not available yet.");
    console.error(
      "Apply supabase/migrations/20260609_phase9_alert_generation.sql before running `npm run generate:opportunity-alerts`.",
    );
    console.error(`Supabase returned: ${error.message}`);
    return false;
  }

  return true;
}

async function main() {
  if (!url || !key) {
    const missing = [];

    if (!url) missing.push("SUPABASE_URL");
    if (!key) missing.push("SUPABASE_SERVICE_ROLE_KEY");

    console.error(
      "Missing required Supabase environment variables for opportunity alert generation.",
    );
    console.error(`Checked project root .env.local at ${resolve(process.cwd(), ".env.local")}.`);
    console.error(`Still missing: ${missing.join(", ")}.`);
    console.error(
      "Add the missing values to .env.local or export them in the shell before running `npm run generate:opportunity-alerts`.",
    );
    return 1;
  }

  const supabase = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  if (!(await ensureAlertGenerationColumnsExist(supabase))) {
    return 1;
  }

  const [
    { data: intelligenceItems, error: intelligenceError },
    { data: alerts, error: alertsError },
    { data: evidenceRows, error: evidenceError },
    { data: rawAnnouncements, error: rawError },
    { data: sources, error: sourceError },
  ] = await Promise.all([
    supabase
      .from("intelligence_items")
      .select(
        "id,scan_run_id,source_id,raw_announcement_id,asset_symbol,headline,summary,classification,impact_score,impact_direction,risk_level,priority,source_confidence,source_url,published_at,created_at",
      )
      .not("classification", "is", null)
      .not("impact_score", "is", null)
      .not("risk_level", "is", null)
      .not("priority", "is", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("opportunity_alerts")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("opportunity_evidence")
      .select("*")
      .order("created_at", { ascending: true }),
    supabase
      .from("raw_announcements")
      .select("id,source_id,asset_symbol,company_name,headline,source_url,published_at")
      .order("published_at", { ascending: false }),
    supabase
      .from("intelligence_sources")
      .select("id,name,source_type,confidence_score"),
  ]);

  if (intelligenceError || alertsError || evidenceError || rawError || sourceError) {
    console.error("Unable to load data for opportunity alert generation.");
    console.error(
      intelligenceError?.message ??
        alertsError?.message ??
        evidenceError?.message ??
        rawError?.message ??
        sourceError?.message ??
        "Unknown error",
    );
    return 1;
  }

  const sourceById = new Map((sources ?? []).map((source) => [source.id, source]));
  const rawById = new Map((rawAnnouncements ?? []).map((row) => [row.id, row]));
  const existingAlertByItemId = new Map(
    (alerts ?? [])
      .filter((row) => row.source_intelligence_item_id)
      .map((row) => [row.source_intelligence_item_id, row]),
  );
  const evidenceByAlertAndItem = new Map(
    (evidenceRows ?? [])
      .filter((row) => row.intelligence_item_id)
      .map((row) => [`${row.opportunity_alert_id}:${row.intelligence_item_id}`, row]),
  );

  let reviewedItems = 0;
  let generatedAlerts = 0;
  let skippedItems = 0;
  let highPriorityReview = 0;
  let speculativeReview = 0;
  let avoidOrReassess = 0;
  let failureCount = 0;

  for (const item of intelligenceItems ?? []) {
    reviewedItems += 1;

    const source = item.source_id ? sourceById.get(item.source_id) ?? null : null;
    const rawAnnouncement = item.raw_announcement_id
      ? rawById.get(item.raw_announcement_id) ?? null
      : null;

    const scoredItem = {
      id: item.id,
      scanRunId: item.scan_run_id,
      assetSymbol: item.asset_symbol,
      headline: item.headline,
      summary: item.summary,
      classification: item.classification,
      impactScore: item.impact_score,
      impactDirection: item.impact_direction,
      riskLevel: item.risk_level,
      priority: item.priority,
      sourceConfidence: item.source_confidence,
      sourceName: source?.name ?? null,
      sourceUrl: item.source_url ?? rawAnnouncement?.source_url ?? null,
      companyName: rawAnnouncement?.company_name ?? null,
      publishedAt: item.published_at,
      rawAnnouncementId: item.raw_announcement_id,
    };

    if (!shouldGenerateAlert(scoredItem)) {
      skippedItems += 1;
      continue;
    }

    const existingAlert = existingAlertByItemId.get(item.id) ?? null;
    const generatedPayload = generateOpportunityAlertPayload(scoredItem, {
      source,
      rawAnnouncement,
    });

    if (!generatedPayload) {
      skippedItems += 1;
      continue;
    }

    if (existingAlert) {
      const evidenceKey = `${existingAlert.id}:${item.id}`;
      if (!evidenceByAlertAndItem.has(evidenceKey)) {
        const evidencePayload = generatedPayload.evidence.map((evidence) => ({
          ...evidence,
          opportunity_alert_id: existingAlert.id,
        }));

        for (const evidenceRow of evidencePayload) {
          const { error: evidenceInsertError } = await supabase
            .from("opportunity_evidence")
            .insert([evidenceRow]);

          if (evidenceInsertError) {
            console.error(`Failed to repair evidence for alert ${existingAlert.id}.`);
            console.error(evidenceInsertError.message);
            failureCount += 1;
          }
        }
      }

      skippedItems += 1;
      continue;
    }

    const { data: insertedAlert, error: alertInsertError } = await supabase
      .from("opportunity_alerts")
      .insert([generatedPayload.alert])
      .select("id")
      .single();

    if (alertInsertError || !insertedAlert) {
      console.error(`Failed to insert opportunity alert for item ${item.id}.`);
      console.error(alertInsertError?.message ?? "Unknown error");
      failureCount += 1;
      continue;
    }

    const evidencePayload = generatedPayload.evidence.map((evidence) => ({
      ...evidence,
      opportunity_alert_id: insertedAlert.id,
    }));

    for (const evidenceRow of evidencePayload) {
      const { error: evidenceInsertError } = await supabase
        .from("opportunity_evidence")
        .insert([evidenceRow]);

      if (evidenceInsertError) {
        console.error(`Failed to insert evidence for alert ${insertedAlert.id}.`);
        console.error(evidenceInsertError.message);
        failureCount += 1;
      }
    }

    generatedAlerts += 1;
    if (generatedPayload.alert.priority === "high_priority_review") {
      highPriorityReview += 1;
    }
    if (generatedPayload.alert.priority === "speculative_review") {
      speculativeReview += 1;
    }
    if (generatedPayload.alert.priority === "avoid_or_reassess") {
      avoidOrReassess += 1;
    }
  }

  console.log(
    JSON.stringify(
      {
        reviewedItems,
        generatedAlerts,
        skippedItems,
        highPriorityReview,
        speculativeReview,
        avoidOrReassess,
        note: "Opportunity alerts are review-only and generated from scored intelligence.",
      },
      null,
      2,
    ),
  );

  return failureCount > 0 ? 1 : 0;
}

const exitCode = await main();
process.exitCode = exitCode;
