export type AnnouncementClassification =
  | "final_results"
  | "interim_results"
  | "trading_update"
  | "director_dealings"
  | "contract_win"
  | "placing_fundraising"
  | "drill_results"
  | "resource_update"
  | "feasibility_study"
  | "permitting_approval"
  | "m_and_a_takeover"
  | "board_change"
  | "going_concern_warning"
  | "holdings_tr1"
  | "other";

export type AnnouncementImpactDirection =
  | "positive"
  | "negative"
  | "neutral"
  | "mixed"
  | "unknown"
  | "speculative";

export type AnnouncementRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "speculative"
  | "critical";

export type AnnouncementPriority =
  | "high_priority_review"
  | "watch_today"
  | "monitor_only"
  | "speculative_review"
  | "avoid_or_reassess";

export type AnnouncementScoringInput = {
  announcementType?: string | null;
  headline: string;
  rawCategory?: string | null;
  summary?: string | null;
  assetSymbol?: string | null;
  companyName?: string | null;
};

export type AnnouncementImpactResult = {
  classification: AnnouncementClassification;
  impactDirection: AnnouncementImpactDirection;
  impactScore: number;
  riskLevel: AnnouncementRiskLevel;
  priority: AnnouncementPriority;
  scoringReason: string;
};

function normalizeText(input: string | null | undefined) {
  return (input ?? "").toLowerCase();
}

function includesAny(text: string, fragments: string[]) {
  return fragments.some((fragment) => text.includes(fragment));
}

function classifyFromText(text: string): AnnouncementClassification {
  if (includesAny(text, ["going concern", "material uncertainty"])) {
    return "going_concern_warning";
  }
  if (includesAny(text, ["final results", "annual results"])) {
    return "final_results";
  }
  if (includesAny(text, ["interim results", "half-year results"])) {
    return "interim_results";
  }
  if (includesAny(text, ["trading update", "expectations", "guidance"])) {
    return "trading_update";
  }
  if (includesAny(text, ["director/pdmr", "director dealing", "shareholding"])) {
    return "director_dealings";
  }
  if (includesAny(text, ["contract win", "contract award", "order win"])) {
    return "contract_win";
  }
  if (includesAny(text, ["placing", "fundraising", "subscription"])) {
    return "placing_fundraising";
  }
  if (includesAny(text, ["drill", "assay", "mineralisation"])) {
    return "drill_results";
  }
  if (includesAny(text, ["resource update", "exploration update"])) {
    return "resource_update";
  }
  if (includesAny(text, ["feasibility study", "scoping study"])) {
    return "feasibility_study";
  }
  if (includesAny(text, ["permit", "approval", "licence", "license"])) {
    return "permitting_approval";
  }
  if (includesAny(text, ["takeover", "acquisition", "offer", "m&a"])) {
    return "m_and_a_takeover";
  }
  if (includesAny(text, ["board change", "director appointment", "resignation"])) {
    return "board_change";
  }
  if (includesAny(text, ["tr-1", "holding(s) in company", "holdings"])) {
    return "holdings_tr1";
  }
  return "other";
}

function classifyFromTypeValue(
  typeValue: string,
): AnnouncementClassification | null {
  switch (typeValue) {
    case "final_results":
      return "final_results";
    case "interim_results":
      return "interim_results";
    case "trading_update":
      return "trading_update";
    case "director_dealings":
      return "director_dealings";
    case "contract_win":
      return "contract_win";
    case "placing_fundraising":
      return "placing_fundraising";
    case "drill_results":
      return "drill_results";
    case "resource_update":
    case "resource_exploration_update":
      return "resource_update";
    case "feasibility_study":
      return "feasibility_study";
    case "permitting_approval":
    case "permitting_regulatory_approval":
      return "permitting_approval";
    case "m_and_a_takeover":
      return "m_and_a_takeover";
    case "board_change":
      return "board_change";
    case "going_concern_warning":
      return "going_concern_warning";
    case "holdings_tr1":
      return "holdings_tr1";
    case "other":
      return "other";
    default:
      return null;
  }
}

export function classifyAnnouncement(
  input: AnnouncementScoringInput,
): AnnouncementClassification {
  const announcementType = normalizeText(input.announcementType);
  const fromTypeValue = classifyFromTypeValue(announcementType);
  if (fromTypeValue) {
    return fromTypeValue;
  }

  const fromType = classifyFromText(announcementType);
  if (fromType !== "other") {
    return fromType;
  }

  const classificationText = `${input.headline} ${input.rawCategory ?? ""} ${input.summary ?? ""}`;
  return classifyFromText(normalizeText(classificationText));
}

function hasPositiveLanguage(text: string) {
  return includesAny(text, [
    "ahead",
    "improved",
    "strong",
    "upgrade",
    "upgraded",
    "reiterated",
    "material contract",
    "approved",
    "purchase",
    "bought",
    "higher",
    "growth",
  ]);
}

function hasNegativeLanguage(text: string) {
  return includesAny(text, [
    "warning",
    "downgrade",
    "downgraded",
    "below expectations",
    "slower",
    "delay",
    "uncertainty",
    "fundraising",
    "placing",
    "sale",
    "sold",
    "resignation",
    "going concern",
    "material uncertainty",
    "reduced",
    "weaker",
  ]);
}

function hasMixedLanguage(text: string) {
  return includesAny(text, [
    "mixed",
    "in line",
    "unchanged",
    "stable",
    "revised expectations",
    "balanced",
  ]);
}

export function mapImpactToPriority(
  result: Pick<
    AnnouncementImpactResult,
    "classification" | "impactDirection" | "impactScore" | "riskLevel"
  >,
): AnnouncementPriority {
  if (result.riskLevel === "critical") {
    return "avoid_or_reassess";
  }
  if (result.riskLevel === "speculative") {
    return "speculative_review";
  }
  if (result.impactDirection === "negative" && result.impactScore <= -20) {
    return "high_priority_review";
  }
  if (result.impactDirection === "positive" && result.impactScore >= 18) {
    return "high_priority_review";
  }
  if (result.impactDirection === "mixed" || result.riskLevel === "high") {
    return "watch_today";
  }
  if (result.classification === "holdings_tr1" || result.impactDirection === "neutral") {
    return "monitor_only";
  }
  if (result.impactScore >= 10 || result.impactScore <= -10) {
    return "watch_today";
  }
  return "monitor_only";
}

export function explainScore(
  result: Omit<AnnouncementImpactResult, "scoringReason">,
): string {
  switch (result.classification) {
    case "going_concern_warning":
      return "Going concern language creates critical financing risk and requires reassessment.";
    case "placing_fundraising":
      return "Fundraising wording raises dilution and financing risk, so the item needs review.";
    case "drill_results":
      return "Official drilling language may be catalytic, but it remains speculative and high risk.";
    case "resource_update":
      return "Resource update language can be catalytic, but evidence remains speculative until confirmed.";
    case "trading_update":
      return result.impactDirection === "positive"
        ? "Trading update language appears constructive and merits review."
        : result.impactDirection === "negative"
          ? "Trading update language raises downside or expectation risk."
          : "Trading update language is mixed and needs context before stronger action.";
    case "final_results":
    case "interim_results":
      return result.impactDirection === "positive"
        ? "Official results language appears constructive and worth reviewing."
        : result.impactDirection === "negative"
          ? "Official results language raises concern and needs reassessment."
          : "Official results look mixed or in line, so the item should be monitored.";
    case "director_dealings":
      return result.impactDirection === "positive"
        ? "Director purchase language is mildly constructive, but not urgent."
        : "Director sale language is mildly negative and worth monitoring.";
    case "contract_win":
      return "Contract language appears constructive, but materiality still needs manual review.";
    case "m_and_a_takeover":
      return "Takeover or acquisition language can be material, but event risk stays high.";
    case "board_change":
      return result.impactDirection === "negative"
        ? "Board-change wording suggests risk or instability."
        : "Board-change wording is mostly informational unless risk language appears.";
    case "holdings_tr1":
      return "Holding change disclosures are informational unless a material shift becomes clear.";
    case "permitting_approval":
      return "Regulatory or permitting language can be constructive, but execution risk remains.";
    case "feasibility_study":
      return "Feasibility-study language can be catalytic, but remains speculative.";
    default:
      return "Official announcement captured as evidence. Review manually before any conclusion.";
  }
}

export function scoreAnnouncementImpact(
  input: AnnouncementScoringInput,
): AnnouncementImpactResult {
  const classification = classifyAnnouncement(input);
  const combinedText = normalizeText(
    `${input.headline} ${input.rawCategory ?? ""} ${input.summary ?? ""}`,
  );

  let impactDirection: AnnouncementImpactDirection = "unknown";
  let impactScore = 0;
  let riskLevel: AnnouncementRiskLevel = "medium";

  switch (classification) {
    case "going_concern_warning":
      impactDirection = "negative";
      impactScore = -40;
      riskLevel = "critical";
      break;
    case "placing_fundraising":
      impactDirection = hasPositiveLanguage(combinedText) ? "mixed" : "negative";
      impactScore = impactDirection === "mixed" ? -15 : -22;
      riskLevel = "high";
      break;
    case "drill_results":
      impactDirection = "speculative";
      impactScore = 22;
      riskLevel = "speculative";
      break;
    case "resource_update":
    case "feasibility_study":
      impactDirection = "speculative";
      impactScore = 18;
      riskLevel = "speculative";
      break;
    case "director_dealings":
      if (includesAny(combinedText, ["sale", "sold", "disposal"])) {
        impactDirection = "negative";
        impactScore = -8;
      } else {
        impactDirection = "positive";
        impactScore = 8;
      }
      riskLevel = "medium";
      break;
    case "trading_update":
      if (includesAny(combinedText, ["upgrade", "upgraded", "stronger", "improved"])) {
        impactDirection = "positive";
        impactScore = 20;
        riskLevel = "medium";
      } else if (includesAny(combinedText, ["downgrade", "downgraded", "warning"])) {
        impactDirection = "negative";
        impactScore = -24;
        riskLevel = "high";
      } else if (hasNegativeLanguage(combinedText) || hasMixedLanguage(combinedText)) {
        impactDirection = "mixed";
        impactScore = -8;
        riskLevel = "high";
      } else {
        impactDirection = "neutral";
        impactScore = 0;
        riskLevel = "medium";
      }
      break;
    case "final_results":
    case "interim_results":
      if (hasPositiveLanguage(combinedText) && !hasNegativeLanguage(combinedText)) {
        impactDirection = "positive";
        impactScore = 18;
        riskLevel = "medium";
      } else if (hasNegativeLanguage(combinedText) && !hasPositiveLanguage(combinedText)) {
        impactDirection = "negative";
        impactScore = -18;
        riskLevel = "high";
      } else {
        impactDirection = "mixed";
        impactScore = 4;
        riskLevel = "medium";
      }
      break;
    case "contract_win":
      impactDirection = "positive";
      impactScore = includesAny(combinedText, ["material", "multi-year", "significant"])
        ? 20
        : 14;
      riskLevel = "medium";
      break;
    case "m_and_a_takeover":
      impactDirection = hasNegativeLanguage(combinedText) ? "mixed" : "positive";
      impactScore = impactDirection === "mixed" ? 6 : 16;
      riskLevel = "high";
      break;
    case "board_change":
      impactDirection = hasNegativeLanguage(combinedText) ? "negative" : "neutral";
      impactScore = impactDirection === "negative" ? -10 : 0;
      riskLevel = impactDirection === "negative" ? "high" : "medium";
      break;
    case "holdings_tr1":
      impactDirection = "neutral";
      impactScore = 2;
      riskLevel = "medium";
      break;
    case "permitting_approval":
      impactDirection = "positive";
      impactScore = 16;
      riskLevel = "medium";
      break;
    default:
      impactDirection = hasPositiveLanguage(combinedText)
        ? "positive"
        : hasNegativeLanguage(combinedText)
          ? "negative"
          : hasMixedLanguage(combinedText)
            ? "mixed"
            : "unknown";
      impactScore =
        impactDirection === "positive"
          ? 10
          : impactDirection === "negative"
            ? -10
            : impactDirection === "mixed"
              ? -3
              : 0;
      riskLevel = impactDirection === "negative" ? "high" : "medium";
      break;
  }

  const priority = mapImpactToPriority({
    classification,
    impactDirection,
    impactScore,
    riskLevel,
  });

  const scoringReason = explainScore({
    classification,
    impactDirection,
    impactScore,
    riskLevel,
    priority,
  });

  return {
    classification,
    impactDirection,
    impactScore,
    riskLevel,
    priority,
    scoringReason,
  };
}
