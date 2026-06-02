import { getSupabaseClient, hasSupabaseConfig } from "@/lib/supabase/server";
import type {
  IntelligenceItemRow,
  IntelligenceSourceRow,
  RawAnnouncementRow,
} from "@/lib/supabase/types";

export type RnsAnnouncementType =
  | "final_results"
  | "interim_results"
  | "trading_update"
  | "director_dealings"
  | "holdings_tr1"
  | "contract_win"
  | "placing_fundraising"
  | "resource_exploration_update"
  | "drill_results"
  | "feasibility_study"
  | "permitting_regulatory_approval"
  | "m_and_a_takeover"
  | "board_change"
  | "going_concern_warning"
  | "other";

export type RnsIngestionStatus = "new" | "parsed" | "ignored" | "failed";

export type RnsRawAnnouncementInput = {
  externalId?: string | null;
  assetSymbol?: string | null;
  companyName?: string | null;
  headline: string;
  rawCategory?: string | null;
  sourceUrl?: string | null;
  publishedAt?: string | null;
  rawPayload?: Record<string, unknown> | null;
};

export type RnsIngestionResult = {
  insertedRawAnnouncements: number;
  insertedIntelligenceItems: number;
  duplicatesSkipped: number;
  failures: Array<{
    headline: string;
    reason: string;
  }>;
};

const RNS_SOURCE_ID = "3dbfbf7f-ae35-48a4-a9fd-3d1de09a6fd9";

type RnsLookupRow = {
  id: string;
  created_at?: string | null;
};

function includesAny(value: string, fragments: string[]) {
  return fragments.some((fragment) => value.includes(fragment));
}

function normalizeLookupValue(value?: string | null) {
  const normalized = value?.trim() ?? "";
  return normalized.length ? normalized : null;
}

function selectOldestMatch<T extends RnsLookupRow>(rows: T[] | null | undefined) {
  if (!rows?.length) {
    return null;
  }

  return [...rows].sort((left, right) => {
    const leftTime = left.created_at ? new Date(left.created_at).getTime() : 0;
    const rightTime = right.created_at ? new Date(right.created_at).getTime() : 0;
    return leftTime - rightTime;
  })[0];
}

export function normaliseAnnouncementType(
  headline: string,
  rawCategory?: string | null,
): RnsAnnouncementType {
  const normalized = `${headline} ${rawCategory ?? ""}`.toLowerCase();

  if (includesAny(normalized, ["final results", "annual results"])) {
    return "final_results";
  }
  if (includesAny(normalized, ["interim results", "half-year results"])) {
    return "interim_results";
  }
  if (includesAny(normalized, ["trading update", "full-year expectations"])) {
    return "trading_update";
  }
  if (includesAny(normalized, ["director/pdmr", "director dealing", "shareholding"])) {
    return "director_dealings";
  }
  if (includesAny(normalized, ["tr-1", "holding(s) in company", "holdings"])) {
    return "holdings_tr1";
  }
  if (includesAny(normalized, ["contract win", "contract award", "award notice"])) {
    return "contract_win";
  }
  if (includesAny(normalized, ["placing", "subscription", "fundraising"])) {
    return "placing_fundraising";
  }
  if (includesAny(normalized, ["exploration update", "resource update"])) {
    return "resource_exploration_update";
  }
  if (includesAny(normalized, ["drill", "assay", "mineralisation"])) {
    return "drill_results";
  }
  if (includesAny(normalized, ["feasibility study", "scoping study"])) {
    return "feasibility_study";
  }
  if (includesAny(normalized, ["permit", "approval", "licence", "license"])) {
    return "permitting_regulatory_approval";
  }
  if (includesAny(normalized, ["takeover", "acquisition", "offer", "m&a"])) {
    return "m_and_a_takeover";
  }
  if (includesAny(normalized, ["board change", "director appointment", "ceo"])) {
    return "board_change";
  }
  if (includesAny(normalized, ["going concern", "material uncertainty"])) {
    return "going_concern_warning";
  }

  return "other";
}

export function getRnsSourceConfidence() {
  return 95;
}

export function estimateRnsImpactScore(
  announcementType: RnsAnnouncementType,
  headline: string,
) {
  const normalizedHeadline = headline.toLowerCase();

  if (announcementType === "going_concern_warning") return 92;
  if (announcementType === "placing_fundraising") return 71;
  if (announcementType === "drill_results") return 67;
  if (announcementType === "final_results") return 82;
  if (announcementType === "interim_results") return 76;
  if (announcementType === "trading_update") return 74;
  if (announcementType === "director_dealings") return 38;
  if (announcementType === "m_and_a_takeover") return 88;
  if (announcementType === "contract_win") return 64;
  if (announcementType === "permitting_regulatory_approval") return 69;
  if (announcementType === "feasibility_study") return 63;
  if (announcementType === "resource_exploration_update") return 62;
  if (announcementType === "holdings_tr1") return 45;
  if (announcementType === "board_change") return 42;
  if (normalizedHeadline.includes("warning")) return 85;

  return 50;
}

export function mapAnnouncementTypeToIntelligenceItemType(
  announcementType: RnsAnnouncementType,
): IntelligenceItemRow["item_type"] {
  switch (announcementType) {
    case "final_results":
    case "interim_results":
      return "result";
    case "trading_update":
      return "trading_update";
    case "drill_results":
    case "resource_exploration_update":
    case "placing_fundraising":
    case "permitting_regulatory_approval":
    case "feasibility_study":
    case "m_and_a_takeover":
      return "filing";
    default:
      return "other";
  }
}

export function getRnsVerificationStatus(
  announcementType: RnsAnnouncementType,
): IntelligenceItemRow["verification_status"] {
  if (
    announcementType === "drill_results" ||
    announcementType === "resource_exploration_update" ||
    announcementType === "feasibility_study"
  ) {
    return "partially_verified";
  }

  return "verified";
}

export function isSpeculativeRnsAnnouncement(announcementType: RnsAnnouncementType) {
  return (
    announcementType === "drill_results" ||
    announcementType === "resource_exploration_update" ||
    announcementType === "placing_fundraising" ||
    announcementType === "feasibility_study"
  );
}

export function buildRnsIntelligenceSummary(
  announcement: RnsRawAnnouncementInput,
  announcementType: RnsAnnouncementType,
) {
  const companyName = announcement.companyName?.trim() || "This company";

  switch (announcementType) {
    case "final_results":
      return `${companyName} published official final results. Use this as high-confidence evidence for review, not as a trade instruction.`;
    case "interim_results":
      return `${companyName} published interim results. Use this as official evidence for review and thesis maintenance.`;
    case "trading_update":
      return `${companyName} published a trading update. Review changes in expectations and risk, not just the headline.`;
    case "director_dealings":
      return `${companyName} disclosed director dealings. Treat it as context rather than a standalone signal.`;
    case "drill_results":
      return `${companyName} published a drilling or exploration update. Keep speculative and financing risk explicit.`;
    case "placing_fundraising":
      return `${companyName} announced fundraising. Review dilution, runway, and financing risk carefully.`;
    case "going_concern_warning":
      return `${companyName} published a going-concern style warning. Treat this as material risk evidence only.`;
    default:
      return `${companyName} published an official announcement. Preserve it as review-only evidence.`;
  }
}

async function ensureRnsSource() {
  // Supabase write typing in this repo is incomplete for custom insert flows.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getSupabaseClient() as any;

  if (!supabase) {
    return null;
  }

  const { data: existing } = await supabase
    .from("intelligence_sources")
    .select("*")
    .eq("id", RNS_SOURCE_ID)
    .maybeSingle();

  if (existing) {
    return existing as IntelligenceSourceRow;
  }

  const { data: existingByType } = await supabase
    .from("intelligence_sources")
    .select("*")
    .eq("source_type", "rns")
    .eq("name", "London Stock Exchange RNS")
    .maybeSingle();

  if (existingByType) {
    return existingByType as IntelligenceSourceRow;
  }

  const { data: inserted } = await supabase
    .from("intelligence_sources")
    .insert([
      {
        name: "London Stock Exchange RNS",
        source_type: "rns",
        base_url: "https://www.londonstockexchange.com/news",
        confidence_score: getRnsSourceConfidence(),
        is_active: true,
        notes: "Primary official UK company announcement source used for RNS-style ingestion.",
      },
    ])
    .select("*")
    .maybeSingle();

  return (inserted as IntelligenceSourceRow | null) ?? null;
}

async function findExistingRawAnnouncement(
  sourceId: string,
  announcement: RnsRawAnnouncementInput,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getSupabaseClient() as any;

  if (!supabase) {
    return null;
  }

  const externalId = normalizeLookupValue(announcement.externalId);
  if (externalId) {
    const { data } = await supabase
      .from("raw_announcements")
      .select("*")
      .eq("source_id", sourceId)
      .eq("external_id", externalId)
      .order("created_at", { ascending: true })
      .limit(5);

    const match = selectOldestMatch(data as RawAnnouncementRow[] | null | undefined);
    if (match) {
      return match;
    }
  }

  const sourceUrl = normalizeLookupValue(announcement.sourceUrl);
  if (sourceUrl) {
    const { data } = await supabase
      .from("raw_announcements")
      .select("*")
      .eq("source_id", sourceId)
      .eq("source_url", sourceUrl)
      .order("created_at", { ascending: true })
      .limit(5);

    const match = selectOldestMatch(data as RawAnnouncementRow[] | null | undefined);
    if (match) {
      return match;
    }
  }

  const assetSymbol = normalizeLookupValue(announcement.assetSymbol);
  const headline = normalizeLookupValue(announcement.headline);
  const publishedAt = normalizeLookupValue(announcement.publishedAt);
  if (assetSymbol && headline && publishedAt) {
    const { data } = await supabase
      .from("raw_announcements")
      .select("*")
      .eq("source_id", sourceId)
      .eq("asset_symbol", assetSymbol)
      .eq("headline", headline)
      .eq("published_at", publishedAt)
      .order("created_at", { ascending: true })
      .limit(5);

    const match = selectOldestMatch(data as RawAnnouncementRow[] | null | undefined);
    if (match) {
      return match;
    }
  }

  return null;
}

async function findExistingIntelligenceItem(
  rawAnnouncementId: string,
  sourceId?: string | null,
  announcement?: RnsRawAnnouncementInput,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getSupabaseClient() as any;

  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from("intelligence_items")
    .select("*")
    .eq("raw_announcement_id", rawAnnouncementId)
    .order("created_at", { ascending: true })
    .limit(5);

  const directMatch = selectOldestMatch(
    data as IntelligenceItemRow[] | null | undefined,
  );
  if (directMatch) {
    return directMatch;
  }

  if (sourceId && announcement?.sourceUrl) {
    const { data: sourceUrlMatches } = await supabase
      .from("intelligence_items")
      .select("*")
      .eq("source_id", sourceId)
      .eq("source_url", announcement.sourceUrl)
      .order("created_at", { ascending: true })
      .limit(5);

    const sourceUrlMatch = selectOldestMatch(
      sourceUrlMatches as IntelligenceItemRow[] | null | undefined,
    );
    if (sourceUrlMatch) {
      return sourceUrlMatch;
    }
  }

  if (sourceId && announcement?.assetSymbol && announcement?.headline && announcement?.publishedAt) {
    const { data: compoundMatches } = await supabase
      .from("intelligence_items")
      .select("*")
      .eq("source_id", sourceId)
      .eq("asset_symbol", announcement.assetSymbol)
      .eq("headline", announcement.headline)
      .eq("published_at", announcement.publishedAt)
      .order("created_at", { ascending: true })
      .limit(5);

    const compoundMatch = selectOldestMatch(
      compoundMatches as IntelligenceItemRow[] | null | undefined,
    );
    if (compoundMatch) {
      return compoundMatch;
    }
  }

  return null;
}

export function mapRawAnnouncementToIntelligenceItem(
  rawAnnouncementId: string,
  sourceId: string,
  announcement: RnsRawAnnouncementInput,
  scanRunId?: string | null,
) {
  const announcementType = normaliseAnnouncementType(
    announcement.headline,
    announcement.rawCategory,
  );

  return {
    scan_run_id: scanRunId ?? null,
    source_id: sourceId,
    raw_announcement_id: rawAnnouncementId,
    asset_symbol: announcement.assetSymbol ?? null,
    headline: announcement.headline,
    summary: buildRnsIntelligenceSummary(announcement, announcementType),
    classification: null,
    impact_direction: null,
    item_type: mapAnnouncementTypeToIntelligenceItemType(announcementType),
    source_url: announcement.sourceUrl ?? null,
    published_at: announcement.publishedAt ?? null,
    source_confidence: getRnsSourceConfidence(),
    verification_status: getRnsVerificationStatus(announcementType),
    impact_score: estimateRnsImpactScore(announcementType, announcement.headline),
    risk_level: null,
    priority: null,
    scoring_reason: null,
    scored_at: null,
  } satisfies Omit<IntelligenceItemRow, "id" | "created_at">;
}

export async function ingestRnsAnnouncements(
  announcements: RnsRawAnnouncementInput[],
  options?: {
    scanRunId?: string | null;
  },
): Promise<RnsIngestionResult> {
  const result: RnsIngestionResult = {
    insertedRawAnnouncements: 0,
    insertedIntelligenceItems: 0,
    duplicatesSkipped: 0,
    failures: [],
  };

  if (!hasSupabaseConfig()) {
    result.failures.push({
      headline: "Supabase config missing",
      reason: "Set SUPABASE_URL and a server key before running ingestion.",
    });
    return result;
  }

  const supabase = getSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const writeClient = supabase as any;
  if (!writeClient) {
    result.failures.push({
      headline: "Supabase client unavailable",
      reason: "Server client could not be created.",
    });
    return result;
  }

  const source = await ensureRnsSource();
  if (!source) {
    result.failures.push({
      headline: "RNS source unavailable",
      reason: "Could not create or load the intelligence source record.",
    });
    return result;
  }

  for (const announcement of announcements) {
    try {
      const duplicate = await findExistingRawAnnouncement(source.id, announcement);
      if (duplicate) {
        const existingItem = await findExistingIntelligenceItem(
          duplicate.id,
          source.id,
          announcement,
        );
        if (existingItem) {
          result.duplicatesSkipped += 1;
          continue;
        }
      }

      const announcementType = normaliseAnnouncementType(
        announcement.headline,
        announcement.rawCategory,
      );

      const rawInsert = duplicate
        ? duplicate
        : (
            await writeClient
              .from("raw_announcements")
              .insert([
                {
                  source_id: source.id,
                  external_id: announcement.externalId ?? null,
                  asset_symbol: announcement.assetSymbol ?? null,
                  company_name: announcement.companyName ?? null,
                  headline: announcement.headline,
                  announcement_type: announcementType,
                  raw_category: announcement.rawCategory ?? null,
                  source_url: announcement.sourceUrl ?? null,
                  published_at: announcement.publishedAt ?? null,
                  raw_payload: announcement.rawPayload ?? null,
                  ingestion_status: "parsed",
                },
              ])
              .select("*")
              .single()
          ).data;

      if (!rawInsert) {
        throw new Error("Raw announcement insert failed");
      }

      if (!duplicate) {
        result.insertedRawAnnouncements += 1;
      }

      const existingItem = await findExistingIntelligenceItem(
        rawInsert.id,
        source.id,
        announcement,
      );
      if (existingItem) {
        result.duplicatesSkipped += 1;
        continue;
      }

      const intelligenceInsert = mapRawAnnouncementToIntelligenceItem(
        rawInsert.id,
        source.id,
        announcement,
        options?.scanRunId,
      );

      const { error } = await writeClient
        .from("intelligence_items")
        .insert([intelligenceInsert]);

      if (error) {
        throw error;
      }

      result.insertedIntelligenceItems += 1;
    } catch (error) {
      result.failures.push({
        headline: announcement.headline,
        reason: error instanceof Error ? error.message : "Unknown ingestion failure",
      });
    }
  }

  return result;
}
