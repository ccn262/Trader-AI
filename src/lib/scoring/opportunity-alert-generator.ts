import type {
  IntelligenceSourceRow,
  OpportunityAlertRow,
  OpportunityEvidenceRow,
  RawAnnouncementRow,
} from "../supabase/types";
import type {
  AnnouncementImpactDirection,
  AnnouncementPriority,
  AnnouncementRiskLevel,
} from "./announcement-impact";

export type PortfolioContext = {
  portfolioValue?: number | null;
  cashAvailable?: number | null;
};

export type ScoredIntelligenceItem = {
  id: string;
  scanRunId: string | null;
  assetSymbol: string | null;
  headline: string;
  summary: string | null;
  classification: string | null;
  impactScore: number | null;
  impactDirection: AnnouncementImpactDirection | string | null;
  riskLevel: AnnouncementRiskLevel | string | null;
  priority: AnnouncementPriority | string | null;
  sourceConfidence: number | null;
  sourceName: string | null;
  sourceUrl: string | null;
  companyName: string | null;
  publishedAt: string | null;
  rawAnnouncementId: string | null;
};

export type GeneratedOpportunityAlertPayload = {
  alert: Omit<OpportunityAlertRow, "id" | "created_at" | "reviewed_at"> & {
    reviewed_at: string | null;
  };
  evidence: Array<Omit<OpportunityEvidenceRow, "id" | "created_at">>;
};

const GENERATED_BY = "deterministic_rules";

function normalizeText(value: string | null | undefined) {
  return (value ?? "").toLowerCase();
}

function containsAny(value: string, terms: string[]) {
  return terms.some((term) => value.includes(term));
}

function hasMaterialLanguage(item: ScoredIntelligenceItem) {
  const text = normalizeText(
    `${item.headline} ${item.summary ?? ""} ${item.companyName ?? ""}`,
  );
  return containsAny(text, [
    "material",
    "significant",
    "substantial",
    "large",
    "major",
    "meaningful",
  ]);
}

function hasSaleLanguage(item: ScoredIntelligenceItem) {
  const text = normalizeText(`${item.headline} ${item.summary ?? ""}`);
  return containsAny(text, ["sale", "sold", "sell", "disposal", "disposed"]);
}

function hasWarningLanguage(item: ScoredIntelligenceItem) {
  const text = normalizeText(`${item.headline} ${item.summary ?? ""}`);
  return containsAny(text, ["warning", "uncertainty", "going concern", "downgraded"]);
}

function isSpeculativeResourceClassification(classification: string | null) {
  return (
    classification === "drill_results" ||
    classification === "resource_update" ||
    classification === "feasibility_study"
  );
}

function isPositiveResultsClassification(classification: string | null) {
  return classification === "final_results" || classification === "interim_results";
}

function formatMoney(value: number) {
  return `£${Math.round(value)}`;
}

function formatConfidenceLabel(score: number | null | undefined) {
  if (score == null) return "Unknown";
  if (score >= 90) return "High";
  if (score >= 80) return "Medium-high";
  if (score >= 65) return "Medium";
  if (score >= 45) return "Low-medium";
  return "Low";
}

function addDays(value: string | null | undefined, days: number) {
  const base = value ? new Date(value) : new Date();
  if (Number.isNaN(base.getTime())) {
    return null;
  }

  base.setUTCDate(base.getUTCDate() + days);
  return base.toISOString().slice(0, 10);
}

function classifyMarket(symbol: string | null, sourceName: string | null) {
  const normalizedSymbol = (symbol ?? "").toUpperCase();
  const normalizedSource = normalizeText(sourceName);

  if (normalizedSource.includes("london stock exchange") || normalizedSource.includes("rns")) {
    return normalizedSymbol.endsWith(".L") ? "LSE" : "AIM";
  }

  if (normalizedSymbol.endsWith(".L")) {
    return "LSE";
  }
  if (normalizedSource.includes("nasdaq")) return "NASDAQ";
  if (normalizedSource.includes("nyse")) return "NYSE";
  return "LSE";
}

function scoreAlert(item: ScoredIntelligenceItem) {
  const impactMagnitude = Math.min(30, Math.abs(Number(item.impactScore ?? 0)) * 0.5);
  const confidence = item.sourceConfidence ?? 50;
  const confidenceBonus =
    confidence >= 90 ? 10 : confidence >= 80 ? 8 : confidence >= 65 ? 6 : confidence >= 45 ? 3 : 0;
  const riskBonus =
    item.riskLevel === "critical"
      ? 18
      : item.riskLevel === "high"
        ? 12
        : item.riskLevel === "speculative"
          ? 8
          : item.riskLevel === "medium"
            ? 4
            : 2;
  const priorityBonus =
    item.priority === "high_priority_review"
      ? 12
      : item.priority === "watch_today"
        ? 8
        : item.priority === "monitor_only"
          ? 3
          : item.priority === "speculative_review"
            ? 6
            : item.priority === "avoid_or_reassess"
              ? 15
              : 0;
  const classificationBonus =
    item.classification === "going_concern_warning"
      ? 15
      : item.classification === "placing_fundraising"
        ? 8
        : item.classification === "drill_results"
          ? 10
          : item.classification === "resource_update"
            ? 8
            : item.classification === "feasibility_study"
              ? 8
              : item.classification === "m_and_a_takeover"
                ? 8
                : item.classification === "director_dealings"
                  ? 4
                  : item.classification === "contract_win"
                    ? 8
                    : 0;

  const rawScore =
    35 + impactMagnitude + confidenceBonus + riskBonus + priorityBonus + classificationBonus;

  return Math.max(0, Math.min(100, Math.round(rawScore)));
}

function getReviewBy(item: ScoredIntelligenceItem, priority: OpportunityAlertRow["priority"]) {
  const days =
    priority === "avoid_or_reassess"
      ? 1
      : priority === "high_priority_review"
        ? 1
        : priority === "watch_today"
          ? 3
          : priority === "speculative_review"
            ? 2
            : 5;

  return addDays(item.publishedAt, days);
}

export function shouldGenerateAlert(item: ScoredIntelligenceItem) {
  if (!item.classification || item.impactScore == null || item.riskLevel == null || item.priority == null) {
    return false;
  }

  switch (item.classification) {
    case "final_results":
    case "interim_results":
    case "trading_update":
    case "contract_win":
    case "placing_fundraising":
    case "drill_results":
    case "resource_update":
    case "feasibility_study":
    case "permitting_approval":
    case "m_and_a_takeover":
    case "going_concern_warning":
      return true;
    case "director_dealings":
      return true;
    case "board_change":
      return hasWarningLanguage(item) || hasMaterialLanguage(item);
    case "holdings_tr1":
      return hasMaterialLanguage(item);
    default:
      return false;
  }
}

export function mapClassificationToOpportunityType(
  item: ScoredIntelligenceItem,
): OpportunityAlertRow["opportunity_type"] {
  switch (item.classification) {
    case "final_results":
    case "interim_results":
    case "trading_update":
      return Number(item.impactScore ?? 0) >= 18 ? "earnings_momentum" : "swing_trade";
    case "contract_win":
      return "special_situation";
    case "placing_fundraising":
      return "special_situation";
    case "drill_results":
    case "resource_update":
    case "feasibility_study":
      return "mining_resource_catalyst";
    case "permitting_approval":
      return "special_situation";
    case "m_and_a_takeover":
      return "special_situation";
    case "going_concern_warning":
      return "special_situation";
    case "director_dealings":
      return hasSaleLanguage(item) ? "special_situation" : "swing_trade";
    case "board_change":
      return "special_situation";
    case "holdings_tr1":
      return "special_situation";
    default:
      return "special_situation";
  }
}

export function mapPriority(item: ScoredIntelligenceItem): OpportunityAlertRow["priority"] {
  const score = Number(item.impactScore ?? 0);

  if (item.classification === "going_concern_warning") {
    return "avoid_or_reassess";
  }

  if (item.classification === "placing_fundraising") {
    return "high_priority_review";
  }

  if (isSpeculativeResourceClassification(item.classification)) {
    return "speculative_review";
  }

  if (item.classification === "director_dealings") {
    if (hasSaleLanguage(item)) {
      return hasMaterialLanguage(item) || score <= -10
        ? "high_priority_review"
        : "monitor_only";
    }

    return score >= 12 ? "watch_today" : "monitor_only";
  }

  if (item.classification === "board_change") {
    return hasWarningLanguage(item) || score <= -10 ? "high_priority_review" : "monitor_only";
  }

  if (item.classification === "holdings_tr1") {
    return hasMaterialLanguage(item) ? "monitor_only" : "monitor_only";
  }

  if (item.classification === "m_and_a_takeover") {
    return item.riskLevel === "high" || item.riskLevel === "critical" || score >= 20
      ? "high_priority_review"
      : "watch_today";
  }

  if (item.classification === "contract_win" || item.classification === "permitting_approval") {
    return item.riskLevel === "high" || item.riskLevel === "critical" || score >= 20
      ? "high_priority_review"
      : "watch_today";
  }

  if (isPositiveResultsClassification(item.classification)) {
    if (
      item.impactDirection === "negative" ||
      item.impactDirection === "mixed" ||
      item.riskLevel === "high" ||
      item.riskLevel === "critical"
    ) {
      return "high_priority_review";
    }

    return score >= 20 ? "high_priority_review" : "watch_today";
  }

  if (item.classification === "trading_update") {
    if (
      item.impactDirection === "negative" ||
      item.impactDirection === "mixed" ||
      item.riskLevel === "high" ||
      item.riskLevel === "critical"
    ) {
      return "high_priority_review";
    }

    return score >= 20 ? "high_priority_review" : "watch_today";
  }

  return item.priority === "monitor_only" ? "monitor_only" : "watch_today";
}

export function suggestPositionRange(
  item: ScoredIntelligenceItem,
  portfolioContext?: PortfolioContext | null,
) {
  const portfolioValue = Math.max(50, Number(portfolioContext?.portfolioValue ?? 50));
  const cashAvailable = Math.max(0, Number(portfolioContext?.cashAvailable ?? portfolioValue));
  const safeCap = Math.max(0, Math.min(portfolioValue, cashAvailable));
  const priority = mapPriority(item);
  const riskLevel = (item.riskLevel ?? "medium").toLowerCase();
  const impactDirection = (item.impactDirection ?? "").toLowerCase();

  if (priority === "avoid_or_reassess" || riskLevel === "critical") {
    return {
      min: 0,
      max: 0,
      label: "£0",
    };
  }

  if (item.classification === "placing_fundraising") {
    if (portfolioValue <= 50) {
      return { min: 0, max: Math.min(5, safeCap || 5), label: "£0-£5" };
    }

    return {
      min: 0,
      max: Math.min(Math.max(5, Math.round(portfolioValue * 0.02)), safeCap || portfolioValue),
      label: `£0-${formatMoney(
        Math.min(Math.max(5, Math.round(portfolioValue * 0.02)), safeCap || portfolioValue),
      )}`,
    };
  }

  if (item.classification === "director_dealings" && hasSaleLanguage(item)) {
    if (hasMaterialLanguage(item)) {
      return { min: 0, max: Math.min(5, safeCap || 5), label: "£0-£5" };
    }

    return { min: 0, max: 0, label: "£0" };
  }

  if (
    (isPositiveResultsClassification(item.classification) || item.classification === "trading_update") &&
    (impactDirection === "negative" ||
      impactDirection === "mixed" ||
      riskLevel === "high" ||
      riskLevel === "critical")
  ) {
    if (portfolioValue <= 50) {
      return { min: 0, max: Math.min(5, safeCap || 5), label: "£0-£5" };
    }

    const max = Math.max(3, Math.round(portfolioValue * 0.02));
    return {
      min: 0,
      max: Math.min(max, safeCap || max),
      label: `£0-${formatMoney(Math.min(max, safeCap || max))}`,
    };
  }

  if (riskLevel === "speculative" || item.classification === "drill_results" || item.classification === "resource_update" || item.classification === "feasibility_study") {
    if (portfolioValue <= 50) {
      return { min: 1, max: Math.min(3, safeCap || 3), label: "£1-£3" };
    }

    const min = Math.max(1, Math.round(portfolioValue * 0.01));
    const max = Math.max(min + 1, Math.round(portfolioValue * 0.03));
    return {
      min,
      max: Math.min(max, Math.max(min, safeCap)),
      label: `${formatMoney(min)}-${formatMoney(Math.min(max, Math.max(min, safeCap)))}`,
    };
  }

  if (priority === "monitor_only") {
    if (portfolioValue <= 50) {
      return { min: 0, max: Math.min(5, safeCap || 5), label: "£0-£5" };
    }

    const min = 0;
    const max = Math.max(5, Math.round(portfolioValue * 0.02));
    return {
      min,
      max: Math.min(max, safeCap || max),
      label: `${formatMoney(min)}-${formatMoney(Math.min(max, safeCap || max))}`,
    };
  }

  if (portfolioValue <= 50) {
    return { min: 5, max: Math.min(10, safeCap || 10), label: "£5-£10" };
  }

  const min = Math.max(5, Math.round(portfolioValue * 0.01));
  const max = Math.max(min + 5, Math.round(portfolioValue * 0.05));
  const cappedMax = Math.min(max, Math.max(min, safeCap));
  return {
    min,
    max: cappedMax,
    label: `${formatMoney(min)}-${formatMoney(cappedMax)}`,
  };
}

export function suggestHoldTimeframe(item: ScoredIntelligenceItem) {
  switch (item.classification) {
    case "going_concern_warning":
      return "Avoid until clarified";
    case "placing_fundraising":
      return "Wait for dilution impact and market reaction";
    case "drill_results":
    case "resource_update":
    case "feasibility_study":
      return "Same day to 5 trading days";
    case "final_results":
    case "interim_results":
    case "trading_update":
      return "1 to 10 trading days";
    case "director_dealings":
      return hasSaleLanguage(item) ? "Monitor until clarified" : "1 to 5 trading days";
    case "contract_win":
      return "Event window";
    case "permitting_approval":
      return "Event window";
    case "m_and_a_takeover":
      return "Event window";
    case "board_change":
      return "Monitor until confirmed";
    case "holdings_tr1":
      return "Monitor only";
    default:
      return "Review timeframe manually";
  }
}

export function generateExitPlan(item: ScoredIntelligenceItem) {
  switch (item.classification) {
    case "going_concern_warning":
      return "Only reassess after funding or risk resolution is confirmed.";
    case "placing_fundraising":
      return "Reassess after dilution impact, pricing, and cash runway are clear.";
    case "drill_results":
    case "resource_update":
    case "feasibility_study":
      return "Reassess after follow-up technical detail confirms or weakens the thesis.";
    case "final_results":
    case "interim_results":
    case "trading_update":
      return "Reassess if the follow-through fades or the guidance view changes.";
    case "director_dealings":
      return hasSaleLanguage(item)
        ? "Reassess if the sale is immaterial or context clarifies the signal."
        : "Reassess if other evidence does not confirm the signal.";
    case "contract_win":
      return "Reassess if the contract proves less material than the headline suggests.";
    case "permitting_approval":
      return "Reassess if the approval timeline or conditions change materially.";
    case "m_and_a_takeover":
      return "Reassess if deal terms, funding, or timing weaken the case.";
    case "board_change":
      return "Reassess if the board change appears routine rather than material.";
    case "holdings_tr1":
      return "Reassess only if the holding change becomes clearly material.";
    default:
      return "Reassess if the evidence no longer supports the review case.";
  }
}

export function generateRiskWarning(item: ScoredIntelligenceItem) {
  switch (item.classification) {
    case "going_concern_warning":
      return "Evidence indicates critical risk. Avoid or reassess until clarified.";
    case "placing_fundraising":
      return "Dilution and funding risk are elevated.";
    case "drill_results":
    case "resource_update":
    case "feasibility_study":
      return "High volatility and speculative resource risk remain elevated.";
    case "final_results":
    case "interim_results":
    case "trading_update":
      return "Post-announcement moves can reverse quickly.";
    case "director_dealings":
      return hasSaleLanguage(item)
        ? "Insider sale context may be negative; confirm size and timing."
        : "Director activity is useful context, not a standalone trigger.";
    case "contract_win":
    case "permitting_approval":
    case "m_and_a_takeover":
      return "Event risk and headline volatility remain elevated.";
    case "board_change":
      return "Leadership changes can be informative or routine; verify context.";
    case "holdings_tr1":
      return "Holdings changes are informational unless the shift is material.";
    default:
      return "Risk context should stay explicit before any manual decision.";
  }
}

function buildGenerationReason(
  item: ScoredIntelligenceItem,
  opportunityType: OpportunityAlertRow["opportunity_type"],
  priority: OpportunityAlertRow["priority"],
) {
  const classification = item.classification ?? "unknown";
  return `Deterministic rules promoted this scored ${classification} item into a ${priority.replaceAll("_", " ")} ${opportunityType.replaceAll("_", " ")} review.`;
}

function buildEvidenceItems(
  item: ScoredIntelligenceItem,
  source: IntelligenceSourceRow | null | undefined,
  rawAnnouncement: RawAnnouncementRow | null | undefined,
): Array<Omit<OpportunityEvidenceRow, "id" | "created_at">> {
  const sourceUrl = item.sourceUrl ?? rawAnnouncement?.source_url ?? null;
  const evidenceSummary = item.summary ?? rawAnnouncement?.headline ?? item.headline;

  return [
    {
      opportunity_alert_id: "",
      intelligence_item_id: item.id,
      evidence_label: "Primary scored intelligence",
      evidence_summary: evidenceSummary,
      source_url: sourceUrl,
      confidence_score: item.sourceConfidence ?? source?.confidence_score ?? null,
      evidence_type: "scored_intelligence",
      is_primary: true,
    },
  ];
}

export function generateOpportunityAlertPayload(
  item: ScoredIntelligenceItem,
  options?: {
    source?: IntelligenceSourceRow | null;
    rawAnnouncement?: RawAnnouncementRow | null;
    portfolioContext?: PortfolioContext | null;
  },
): GeneratedOpportunityAlertPayload | null {
  if (!shouldGenerateAlert(item)) {
    return null;
  }

  const source = options?.source ?? null;
  const rawAnnouncement = options?.rawAnnouncement ?? null;
  const opportunityType = mapClassificationToOpportunityType(item);
  const priority = mapPriority(item);
  const suggestedPosition = suggestPositionRange(item, options?.portfolioContext ?? null);
  const reviewBy = getReviewBy(item, priority);
  const confidenceScore = item.sourceConfidence ?? source?.confidence_score ?? null;
  const confidenceLabel = formatConfidenceLabel(confidenceScore);
  const score = scoreAlert(item);
  const market = classifyMarket(item.assetSymbol, source?.name ?? item.sourceName);
  const evidenceItems = buildEvidenceItems(item, source, rawAnnouncement);
  const generationReason = buildGenerationReason(item, opportunityType, priority);

  return {
    alert: {
      scan_run_id: item.scanRunId ?? null,
      source_intelligence_item_id: item.id,
      asset_symbol: item.assetSymbol ?? "UNKNOWN",
      asset_name: item.companyName ?? item.assetSymbol ?? "Unknown asset",
      market,
      opportunity_type: opportunityType,
      priority,
      catalyst_summary: item.summary ?? item.headline,
      score,
      source_confidence: confidenceScore,
      risk_level: (item.riskLevel ?? "medium") as string,
      suggested_position_min: suggestedPosition.min,
      suggested_position_max: suggestedPosition.max,
      suggested_hold_timeframe: suggestHoldTimeframe(item),
      exit_plan: generateExitPlan(item),
      risk_warning: generateRiskWarning(item),
      generated_by: GENERATED_BY,
      generation_reason: generationReason,
      invalidation_notes: generateExitPlan(item),
      review_by: reviewBy,
      confidence_label: confidenceLabel,
      review_status: "new",
      archived: false,
      reviewed_at: null,
    },
    evidence: evidenceItems.map((evidence) => ({
      ...evidence,
      opportunity_alert_id: "",
    })),
  };
}

export const opportunityAlertGenerationDefaults = {
  generatedBy: GENERATED_BY,
};
