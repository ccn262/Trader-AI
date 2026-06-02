export type SourceTier = 1 | 2 | 3 | 4 | 5;

export type LicenceStatus =
  | "open"
  | "paid_required"
  | "licensed"
  | "unknown"
  | "not_allowed";

export type SignalType =
  | "primary_evidence"
  | "confirming_news"
  | "market_movement"
  | "social_attention"
  | "rumour"
  | "risk_warning"
  | "pump_risk_warning"
  | "press_release"
  | "aggregator_summary"
  | "analyst_signal"
  | "other";

export type SignalSourceLike = {
  name?: string | null;
  source_type?: string | null;
  sourceType?: string | null;
  tier?: number | null;
  access_method?: string | null;
  accessMethod?: string | null;
  licence_status?: LicenceStatus | string | null;
  licenceStatus?: LicenceStatus | string | null;
  weighting_multiplier?: number | null;
  weightingMultiplier?: number | null;
  can_create_alerts?: boolean | null;
  canCreateAlerts?: boolean | null;
  requires_primary_confirmation?: boolean | null;
  requiresPrimaryConfirmation?: boolean | null;
};

export type SignalItemLike = {
  headline?: string | null;
  summary?: string | null;
  classification?: string | null;
  signal_type?: SignalType | string | null;
  signalType?: SignalType | string | null;
  source_tier?: number | null;
  sourceTier?: number | null;
  weighting_multiplier?: number | null;
  weightingMultiplier?: number | null;
  primary_confirmation_required?: boolean | null;
  primaryConfirmationRequired?: boolean | null;
  confirmed_by_primary_source?: boolean | null;
  confirmedByPrimarySource?: boolean | null;
  rumour_flag?: boolean | null;
  rumourFlag?: boolean | null;
  pump_risk_flag?: boolean | null;
  pumpRiskFlag?: boolean | null;
  source_name?: string | null;
  sourceName?: string | null;
  source_url?: string | null;
  sourceUrl?: string | null;
};

export type SignalContext = {
  sourceName: string;
  sourceType: string;
  accessMethod: string;
  sourceTier: SourceTier;
  licenceStatus: LicenceStatus;
  weightingMultiplier: number;
  signalType: SignalType;
  rumourFlag: boolean;
  pumpRiskFlag: boolean;
  canCreateAlerts: boolean;
  requiresPrimaryConfirmation: boolean;
  primaryConfirmationRequired: boolean;
  confirmedByPrimarySource: boolean;
  discoveryOnly: boolean;
  signalWeightingExplanation: string;
};

const TIER_KEYWORDS: Array<{ tier: SourceTier; keywords: string[] }> = [
  {
    tier: 1,
    keywords: [
      "rns",
      "sec",
      "company_filing",
      "company filing",
      "company_ir",
      "investor relations",
      "company announcement",
      "official announcement",
      "issuer page",
    ],
  },
  {
    tier: 2,
    keywords: [
      "reuters",
      "bloomberg",
      "financial times",
      "dow jones",
      "professional news",
      "news",
      "analyst",
    ],
  },
  {
    tier: 3,
    keywords: [
      "yahoo",
      "marketwatch",
      "marketbeat",
      "investing.com",
      "aggregator",
      "market data",
    ],
  },
  {
    tier: 4,
    keywords: ["globenewswire", "pr newswire", "business wire", "press release", "press wire"],
  },
  {
    tier: 5,
    keywords: ["reddit", "stocktwits", "x", "twitter", "lse share chat", "advfn", "forum", "social"],
  },
];

const LICENCE_STATUSES: LicenceStatus[] = [
  "open",
  "paid_required",
  "licensed",
  "unknown",
  "not_allowed",
];

const SIGNAL_TYPES: SignalType[] = [
  "primary_evidence",
  "confirming_news",
  "market_movement",
  "social_attention",
  "rumour",
  "risk_warning",
  "pump_risk_warning",
  "press_release",
  "aggregator_summary",
  "analyst_signal",
  "other",
];

function toText(value: string | number | boolean | null | undefined) {
  return String(value ?? "").toLowerCase();
}

function includesAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

function clampTier(value: number | null | undefined): SourceTier | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  const rounded = Math.round(value);
  if (rounded < 1 || rounded > 5) {
    return null;
  }

  return rounded as SourceTier;
}

function normaliseLicenceStatus(value: string | null | undefined): LicenceStatus {
  const normalised = toText(value);
  if (LICENCE_STATUSES.includes(normalised as LicenceStatus)) {
    return normalised as LicenceStatus;
  }

  return "unknown";
}

export function getSourceTier(source: SignalSourceLike | null | undefined): SourceTier {
  const explicitTier = clampTier(source?.tier);
  if (explicitTier) {
    return explicitTier;
  }

  const sourceText = [
    source?.name,
    source?.source_type,
    source?.sourceType,
    source?.access_method,
    source?.accessMethod,
    source?.licence_status,
    source?.licenceStatus,
  ]
    .filter(Boolean)
    .map((value) => toText(value))
    .join(" ");

  for (const entry of TIER_KEYWORDS) {
    if (includesAny(sourceText, entry.keywords)) {
      return entry.tier;
    }
  }

  return 3;
}

export function getDefaultWeightingForTier(tier: number | null | undefined): number {
  const normalizedTier = clampTier(tier) ?? 3;

  switch (normalizedTier) {
    case 1:
      return 1;
    case 2:
      return 0.8;
    case 3:
      return 0.55;
    case 4:
      return 0.35;
    case 5:
      return 0.15;
  }
}

export function getSourceTierLabel(tier: number | null | undefined): string {
  const normalizedTier = clampTier(tier);
  if (!normalizedTier) {
    return "Tier unknown";
  }

  switch (normalizedTier) {
    case 1:
      return "Tier 1 · Primary evidence";
    case 2:
      return "Tier 2 · Professional news";
    case 3:
      return "Tier 3 · Aggregator / market site";
    case 4:
      return "Tier 4 · Press wire";
    case 5:
      return "Tier 5 · Social / forum";
  }
}

export function flagRumourOrPumpRisk(input: {
  headline?: string | null;
  summary?: string | null;
  sourceName?: string | null;
  signalType?: string | null;
}): {
  rumourFlag: boolean;
  pumpRiskFlag: boolean;
  matchedTerms: string[];
} {
  const text = [input.headline, input.summary, input.sourceName, input.signalType]
    .filter(Boolean)
    .map((value) => toText(value))
    .join(" ");

  const rumourTerms = ["rumour", "rumor", "unconfirmed", "reportedly", "alleged", "leak"];
  const pumpTerms = [
    "guaranteed",
    "multibagger",
    "risk free",
    "sure thing",
    "insider tip",
    "pump",
  ];

  const matchedTerms = [
    ...rumourTerms.filter((term) => text.includes(term)),
    ...pumpTerms.filter((term) => text.includes(term)),
  ];

  return {
    rumourFlag: rumourTerms.some((term) => text.includes(term)),
    pumpRiskFlag: pumpTerms.some((term) => text.includes(term)),
    matchedTerms,
  };
}

export function getSignalTypeForSourceAndItem(
  source: SignalSourceLike | null | undefined,
  item: SignalItemLike | null | undefined,
): SignalType {
  const explicitSignal = (item?.signal_type ?? item?.signalType) as SignalType | string | null | undefined;
  if (explicitSignal && SIGNAL_TYPES.includes(explicitSignal as SignalType)) {
    return explicitSignal as SignalType;
  }

  const flags = flagRumourOrPumpRisk({
    headline: item?.headline ?? null,
    summary: item?.summary ?? null,
    sourceName: source?.name ?? item?.source_name ?? item?.sourceName ?? null,
    signalType: explicitSignal ?? null,
  });

  if (flags.pumpRiskFlag) {
    return "pump_risk_warning";
  }

  if (flags.rumourFlag) {
    return "rumour";
  }

  const tier = getSourceTier(source ?? { tier: item?.source_tier ?? item?.sourceTier ?? null });
  const sourceText = [
    source?.name,
    source?.source_type,
    source?.sourceType,
    source?.access_method,
    source?.accessMethod,
  ]
    .filter(Boolean)
    .map((value) => toText(value))
    .join(" ");

  if (tier === 1) {
    return "primary_evidence";
  }

  if (tier === 2) {
    if (includesAny(sourceText, ["analyst"])) {
      return "analyst_signal";
    }
    return "confirming_news";
  }

  if (tier === 3) {
    if (
      includesAny(sourceText, ["market", "price", "volume"]) ||
      includesAny(toText(item?.headline ?? item?.summary), ["price", "volume"])
    ) {
      return "market_movement";
    }
    return "aggregator_summary";
  }

  if (tier === 4) {
    return "press_release";
  }

  if (tier === 5) {
    return "social_attention";
  }

  return "other";
}

export function requiresPrimaryConfirmation(
  signal: Pick<
    SignalContext,
    "sourceTier" | "signalType" | "primaryConfirmationRequired"
  > | null | undefined,
): boolean {
  if (!signal) {
    return true;
  }

  if (signal.sourceTier === 1 && signal.signalType === "primary_evidence") {
    return Boolean(signal.primaryConfirmationRequired);
  }

  return true;
}

export function canSignalCreateAlert(
  signal: Pick<
    SignalContext,
    | "sourceTier"
    | "signalType"
    | "rumourFlag"
    | "pumpRiskFlag"
    | "confirmedByPrimarySource"
    | "canCreateAlerts"
  > | null | undefined,
): boolean {
  if (!signal) {
    return false;
  }

  if (signal.pumpRiskFlag) {
    return false;
  }

  if (signal.sourceTier === 5) {
    return false;
  }

  if (signal.sourceTier === 3) {
    return Boolean(signal.confirmedByPrimarySource);
  }

  if (signal.sourceTier === 4) {
    return true;
  }

  if (signal.sourceTier === 2) {
    return !signal.rumourFlag;
  }

  if (signal.sourceTier === 1) {
    return signal.canCreateAlerts ?? true;
  }

  return false;
}

export function explainSignalWeighting(
  signal: Pick<
    SignalContext,
    | "sourceTier"
    | "licenceStatus"
    | "weightingMultiplier"
    | "signalType"
    | "rumourFlag"
    | "pumpRiskFlag"
    | "confirmedByPrimarySource"
    | "discoveryOnly"
  > | null | undefined,
): string {
  if (!signal) {
    return "Signal weighting could not be determined. Treat the item as review-only until the source is validated.";
  }

  const parts = [
    `${getSourceTierLabel(signal.sourceTier)} weighting ${signal.weightingMultiplier.toFixed(2)}`,
    `licence status ${signal.licenceStatus.replaceAll("_", " ")}`,
  ];

  if (signal.signalType === "social_attention" || signal.discoveryOnly) {
    parts.push("discovery-only social signals require primary evidence before they can influence review");
  }

  if (signal.pumpRiskFlag) {
    parts.push("pump-risk language lowers confidence and should not increase score weight");
  } else if (signal.rumourFlag) {
    parts.push("rumour language keeps the item in low-confidence review territory");
  }

  if (signal.confirmedByPrimarySource) {
    parts.push("primary confirmation is present, so the signal may support review");
  }

  return parts.join(" · ");
}

export function buildSignalContext(
  source: SignalSourceLike | null | undefined,
  item: SignalItemLike | null | undefined,
): SignalContext {
  const sourceTier = getSourceTier({
    ...source,
    tier: source?.tier ?? item?.source_tier ?? item?.sourceTier ?? null,
  });
  const signalType = getSignalTypeForSourceAndItem(source, item);
  const rumourAndPump = flagRumourOrPumpRisk({
    headline: item?.headline ?? null,
    summary: item?.summary ?? null,
    sourceName: source?.name ?? item?.source_name ?? item?.sourceName ?? null,
    signalType,
  });
  const explicitLicenceStatus = normaliseLicenceStatus(
    source?.licence_status ?? source?.licenceStatus ?? null,
  );
  const sourceText = toText(
    [source?.name, source?.source_type, source?.sourceType, source?.access_method, source?.accessMethod]
      .filter(Boolean)
      .join(" "),
  );
  const derivedLicenceStatus: LicenceStatus =
    explicitLicenceStatus !== "unknown"
      ? explicitLicenceStatus
      : includesAny(sourceText, ["reuters", "bloomberg", "financial times", "dow jones"])
        ? "paid_required"
        : sourceTier === 2
          ? "licensed"
          : sourceTier === 5
            ? "open"
            : "open";

  const weightingMultiplier = Number(
    item?.weighting_multiplier ??
      item?.weightingMultiplier ??
      source?.weighting_multiplier ??
      source?.weightingMultiplier ??
      getDefaultWeightingForTier(sourceTier),
  );
  const primaryConfirmationRequired = Boolean(
    item?.primary_confirmation_required ??
      item?.primaryConfirmationRequired ??
      source?.requires_primary_confirmation ??
      source?.requiresPrimaryConfirmation ??
      sourceTier !== 1,
  );
  const confirmedByPrimarySource = Boolean(
    item?.confirmed_by_primary_source ?? item?.confirmedByPrimarySource,
  );
  const sourceCanCreateAlerts = Boolean(
    source?.can_create_alerts ?? source?.canCreateAlerts ?? sourceTier !== 5,
  );
  const canCreateAlerts = canSignalCreateAlert({
    sourceTier,
    signalType,
    rumourFlag: rumourAndPump.rumourFlag,
    pumpRiskFlag: rumourAndPump.pumpRiskFlag,
    confirmedByPrimarySource,
    canCreateAlerts: sourceCanCreateAlerts,
  });
  const requiresConfirmation = requiresPrimaryConfirmation({
    sourceTier,
    signalType,
    primaryConfirmationRequired,
  });
  const discoveryOnly =
    sourceTier === 5 ||
    signalType === "social_attention" ||
    signalType === "rumour" ||
    signalType === "pump_risk_warning";

  return {
    sourceName: source?.name ?? item?.source_name ?? item?.sourceName ?? "Unknown source",
    sourceType: source?.source_type ?? source?.sourceType ?? "other",
    accessMethod: source?.access_method ?? source?.accessMethod ?? "other",
    sourceTier,
    licenceStatus: derivedLicenceStatus,
    weightingMultiplier,
    signalType,
    rumourFlag: rumourAndPump.rumourFlag,
    pumpRiskFlag: rumourAndPump.pumpRiskFlag,
    canCreateAlerts,
    requiresPrimaryConfirmation: requiresConfirmation,
    primaryConfirmationRequired,
    confirmedByPrimarySource,
    discoveryOnly,
    signalWeightingExplanation: explainSignalWeighting({
      sourceTier,
      licenceStatus: derivedLicenceStatus,
      weightingMultiplier,
      signalType,
      rumourFlag: rumourAndPump.rumourFlag,
      pumpRiskFlag: rumourAndPump.pumpRiskFlag,
      confirmedByPrimarySource,
      discoveryOnly,
    }),
  };
}
