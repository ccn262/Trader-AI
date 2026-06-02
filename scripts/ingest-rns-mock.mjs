import { resolve } from "node:path"

import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config({ path: resolve(process.cwd(), ".env.local"), quiet: true })

const sourceId = "3dbfbf7f-ae35-48a4-a9fd-3d1de09a6fd9"
const scanRunId = "1b7f5fb7-8e69-4ccd-a8e7-9d0242052601"

const url =
  process.env.SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL

const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  null

if (!url || !key) {
  const missing = []

  if (!url) {
    missing.push("SUPABASE_URL")
  }

  if (!key) {
    missing.push("SUPABASE_SERVICE_ROLE_KEY")
  }

  console.error("Missing required Supabase environment variables for mock RNS ingestion.")
  console.error(`Checked project root .env.local at ${resolve(process.cwd(), ".env.local")}.`)
  console.error(`Still missing: ${missing.join(", ")}.`)
  console.error(
    "Add the missing values to .env.local or export them in the shell before running `npm run ingest:rns:mock`.",
  )
  process.exit(1)
}

const supabase = createClient(url, key, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
})

const announcements = [
  {
    externalId: "RNS-MOCK-20260605-RR-FINAL",
    assetSymbol: "RR.L",
    companyName: "Rolls-Royce Holdings plc",
    headline: "Final Results for the year ended 31 December 2025",
    rawCategory: "Results",
    sourceUrl:
      "https://www.londonstockexchange.com/news-article/RR./final-results/mock-001",
    publishedAt: "2026-06-05T07:05:00Z",
    rawPayload: {
      summary:
        "Official final results announcement with improved cash generation and stable guidance.",
    },
  },
  {
    externalId: "RNS-MOCK-20260605-ITM-TRADING",
    assetSymbol: "ITM.L",
    companyName: "ITM Power plc",
    headline: "Trading Update and revised full-year expectations",
    rawCategory: "Trading Update",
    sourceUrl:
      "https://www.londonstockexchange.com/news-article/ITM/trading-update/mock-002",
    publishedAt: "2026-06-05T07:12:00Z",
    rawPayload: {
      summary:
        "Official trading update noting slower conversion and revised near-term expectations.",
    },
  },
  {
    externalId: "RNS-MOCK-20260605-BARC-DD",
    assetSymbol: "BARC.L",
    companyName: "Barclays plc",
    headline: "Director/PDMR Shareholding",
    rawCategory: "Director Dealings",
    sourceUrl:
      "https://www.londonstockexchange.com/news-article/BARC/director-pdmr-shareholding/mock-003",
    publishedAt: "2026-06-05T07:18:00Z",
    rawPayload: {
      summary: "Official director dealing disclosure with a modest open-market purchase.",
    },
  },
  {
    externalId: "RNS-MOCK-20260605-SOLG-DRILL",
    assetSymbol: "SOLG",
    companyName: "SolGold plc",
    headline: "Cascabel drilling update reports additional mineralisation",
    rawCategory: "Exploration Update",
    sourceUrl:
      "https://www.londonstockexchange.com/news-article/SOLG/drilling-update/mock-004",
    publishedAt: "2026-06-05T07:25:00Z",
    rawPayload: {
      summary:
        "Official exploration update referencing additional mineralisation and follow-up work.",
    },
  },
  {
    externalId: "RNS-MOCK-20260605-AAL-PLACING",
    assetSymbol: "AAL.L",
    companyName: "Anglesey Mining plc",
    headline: "Placing and Subscription to support project funding",
    rawCategory: "Fundraising",
    sourceUrl:
      "https://www.londonstockexchange.com/news-article/AAL/placing-and-subscription/mock-005",
    publishedAt: "2026-06-05T07:31:00Z",
    rawPayload: {
      summary:
        "Official fundraising announcement highlighting dilution and ongoing funding needs.",
    },
  },
  {
    externalId: "RNS-MOCK-20260605-XYZ-GOINGCONCERN",
    assetSymbol: "XYZ.L",
    companyName: "Example Resources plc",
    headline: "Going concern statement and financing update",
    rawCategory: "Financing Update",
    sourceUrl:
      "https://www.londonstockexchange.com/news-article/XYZ/going-concern-statement/mock-006",
    publishedAt: "2026-06-05T07:42:00Z",
    rawPayload: {
      summary:
        "Official financing update disclosing material uncertainty around future funding.",
    },
  },
]

function normaliseAnnouncementType(headline, rawCategory) {
  const normalized = `${headline} ${rawCategory ?? ""}`.toLowerCase()

  if (normalized.includes("final results")) return "final_results"
  if (normalized.includes("interim results")) return "interim_results"
  if (normalized.includes("trading update")) return "trading_update"
  if (
    normalized.includes("director/pdmr") ||
    normalized.includes("director dealings") ||
    normalized.includes("shareholding")
  ) {
    return "director_dealings"
  }
  if (
    normalized.includes("placing") ||
    normalized.includes("subscription") ||
    normalized.includes("fundraising")
  ) {
    return "placing_fundraising"
  }
  if (
    normalized.includes("drill") ||
    normalized.includes("assay") ||
    normalized.includes("mineralisation")
  ) {
    return "drill_results"
  }
  if (normalized.includes("going concern")) return "going_concern_warning"

  return "other"
}

function impactScore(announcementType) {
  switch (announcementType) {
    case "final_results":
      return 82
    case "interim_results":
      return 76
    case "trading_update":
      return 74
    case "director_dealings":
      return 38
    case "placing_fundraising":
      return 71
    case "drill_results":
      return 67
    case "going_concern_warning":
      return 92
    default:
      return 50
  }
}

function itemType(announcementType) {
  switch (announcementType) {
    case "final_results":
    case "interim_results":
      return "result"
    case "trading_update":
      return "trading_update"
    case "placing_fundraising":
    case "drill_results":
      return "filing"
    default:
      return "other"
  }
}

function verificationStatus(announcementType) {
  if (announcementType === "drill_results") {
    return "partially_verified"
  }

  return "verified"
}

function summaryFor(companyName, announcementType) {
  switch (announcementType) {
    case "final_results":
      return `${companyName} published official final results. Review the evidence rather than treating it as an instruction.`
    case "trading_update":
      return `${companyName} published a trading update. Review changes in expectations and risk.`
    case "director_dealings":
      return `${companyName} disclosed director dealings. Useful context, not a standalone trigger.`
    case "placing_fundraising":
      return `${companyName} announced fundraising. Review dilution and financing risk carefully.`
    case "drill_results":
      return `${companyName} published a drilling update. Keep speculative and financing risk explicit.`
    case "going_concern_warning":
      return `${companyName} disclosed going-concern style risk. Treat it as material risk evidence only.`
    default:
      return `${companyName} published an official announcement for review.`
  }
}

await supabase.from("intelligence_sources").upsert({
  id: sourceId,
  name: "London Stock Exchange RNS",
  source_type: "rns",
  base_url: "https://www.londonstockexchange.com/news",
  confidence_score: 95,
  is_active: true,
  notes: "Primary official UK company announcement source used for RNS-style ingestion.",
})

let insertedRaw = 0
let insertedItems = 0
let duplicates = 0

for (const announcement of announcements) {
  const { data: existingRaw } = await supabase
    .from("raw_announcements")
    .select("id")
    .eq("source_id", sourceId)
    .eq("external_id", announcement.externalId)
    .maybeSingle()

  const announcementType = normaliseAnnouncementType(
    announcement.headline,
    announcement.rawCategory,
  )

  let rawId = existingRaw?.id ?? null

  if (!rawId) {
    const { data: inserted, error } = await supabase
      .from("raw_announcements")
      .insert({
        source_id: sourceId,
        external_id: announcement.externalId,
        asset_symbol: announcement.assetSymbol,
        company_name: announcement.companyName,
        headline: announcement.headline,
        announcement_type: announcementType,
        raw_category: announcement.rawCategory,
        source_url: announcement.sourceUrl,
        published_at: announcement.publishedAt,
        raw_payload: announcement.rawPayload,
        ingestion_status: "parsed",
      })
      .select("id")
      .single()

    if (error) {
      console.error(`Failed to insert raw announcement: ${announcement.headline}`)
      console.error(error.message)
      continue
    }

    rawId = inserted.id
    insertedRaw += 1
  }

  const { data: existingItem } = await supabase
    .from("intelligence_items")
    .select("id")
    .eq("raw_announcement_id", rawId)
    .maybeSingle()

  if (existingItem) {
    duplicates += 1
    continue
  }

  const { error: itemError } = await supabase.from("intelligence_items").insert({
    scan_run_id: scanRunId,
    source_id: sourceId,
    raw_announcement_id: rawId,
    asset_symbol: announcement.assetSymbol,
    headline: announcement.headline,
    summary: summaryFor(announcement.companyName, announcementType),
    item_type: itemType(announcementType),
    source_url: announcement.sourceUrl,
    published_at: announcement.publishedAt,
    source_confidence: 95,
    verification_status: verificationStatus(announcementType),
    impact_score: impactScore(announcementType),
  })

  if (itemError) {
    console.error(`Failed to insert intelligence item: ${announcement.headline}`)
    console.error(itemError.message)
    continue
  }

  insertedItems += 1
}

console.log(
  JSON.stringify(
    {
      insertedRawAnnouncements: insertedRaw,
      insertedIntelligenceItems: insertedItems,
      duplicatesSkipped: duplicates,
      note: "RNS announcements are evidence only. Review manually outside any execution flow.",
    },
    null,
    2,
  ),
)
