export type Watchlist = {
  name: string;
  description: string;
  riskProfile: "low" | "medium" | "high" | "speculative";
  assetCount: number;
  averageScore: number;
  lastReviewed: string;
  highlights: string[];
};

export type PortfolioPosition = {
  ticker: string;
  name: string;
  strategy: "core" | "swing" | "learning";
  accountType: "ISA" | "Invest" | "Other";
  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;
  targetAllocation: number;
  notes: string;
};

export type JournalEntry = {
  ticker: string;
  action: "Buy" | "Add" | "Trim" | "Sell" | "Paper trade" | "Avoid";
  amount: string;
  reason: string;
  riskAmount: string;
  stopLossIdea: string;
  reviewDate: string;
  emotionBefore: string;
  lesson: string;
};

export type AlertItem = {
  title: string;
  asset: string;
  type: string;
  action: string;
  due: string;
};

export type OpportunityScan = {
  id: string;
  label: "Morning Scan" | "Evening Scan" | "Manual Scan";
  title: string;
  summary: string;
  bullets: string[];
  status: "Completed" | "Running" | "Pending" | "Failed";
  marketHealthScore: number;
  triggerSource: "manual" | "cron" | "dev_script";
  startedAt: string;
  completedAt: string;
  completedSuccessfully: boolean;
  totalIntelligenceItems: number;
  totalAlertsGenerated: number;
  highPriorityCount: number;
  speculativeCount: number;
  avoidOrReassessCount: number;
  errorMessage: string | null;
};

export type OpportunityAlert = {
  id: string;
  sourceIntelligenceItemId: string | null;
  symbol: string;
  name: string;
  market: "LSE" | "NYSE" | "NASDAQ" | "AIM";
  opportunityType:
    | "Long-term investment"
    | "Swing trade"
    | "Penny share catalyst"
    | "Mining/resource catalyst"
    | "Earnings momentum"
    | "Special situation"
    | "ETF/sector rotation";
  catalystSummary: string;
  score: number;
  priority:
    | "High-priority review"
    | "Watch today"
    | "Monitor only"
    | "Speculative review"
    | "Avoid or reassess";
  sourceConfidence: string;
  sourceConfidenceScore: number;
  riskLevel: "Low" | "Medium" | "High" | "Speculative" | "Critical";
  suggestedPositionRange: string;
  suggestedHoldTimeframe: string;
  exitPlan: string;
  riskWarning: string;
  generatedBy: string;
  generationReason: string;
  invalidationNotes: string;
  reviewBy: string;
  confidenceLabel: string;
  evidenceItems: OpportunityAlertEvidence[];
  evidencePlaceholders: string[];
  filterTags: Array<
    | "High-priority review"
    | "Watch today"
    | "Monitor only"
    | "Penny shares"
    | "Long-term"
    | "Swing trades"
  >;
  scan: "Morning" | "Evening";
};

export type OpportunityAlertEvidence = {
  label: string;
  summary: string;
  sourceUrl: string | null;
  intelligenceItemId: string | null;
  evidenceType: string | null;
  isPrimary: boolean;
};

export type RecentIntelligenceItem = {
  id: string;
  assetSymbol: string;
  companyName: string;
  headline: string;
  announcementType: string;
  classification: string;
  source: string;
  sourceConfidence: string;
  sourceConfidenceScore: number;
  verificationStatus: "Verified" | "Partially verified" | "Unverified" | "Failed";
  impactScore: number;
  impactDirection:
    | "Positive"
    | "Negative"
    | "Neutral"
    | "Mixed"
    | "Unknown"
    | "Speculative";
  riskLevel: "Low" | "Medium" | "High" | "Speculative" | "Critical";
  priority:
    | "High-priority review"
    | "Watch today"
    | "Monitor only"
    | "Speculative review"
    | "Avoid or reassess";
  scoringReason: string;
  publishedAt: string;
  riskLabel: "Core" | "Watch" | "Speculative" | "Urgent";
  signalType?: string;
  sourceTier?: number;
  weightingMultiplier?: number;
  sourceLicenceStatus?: string;
  sourceAccessMethod?: string;
  rumourFlag?: boolean;
  pumpRiskFlag?: boolean;
  primaryConfirmationRequired?: boolean;
  confirmedByPrimarySource?: boolean;
};

export const summaryCards = [
  {
    label: "Portfolio value",
    value: "£50",
    detail: "Seed portfolio value from mock data or Supabase fallback",
  },
  {
    label: "Cash available",
    value: "£10",
    detail: "Manual cash position kept separate from watchlist ideas",
  },
  {
    label: "ETF allocation",
    value: "60%",
    detail: "Core allocation remains the main holding in beginner mode",
  },
  {
    label: "Alerts due",
    value: "3",
    detail: "Review before action",
  },
] as const;

export const quickActions = [
  "Review score changes",
  "Log a manual trade",
  "Check alerts due",
  "Update journal notes",
] as const;

export const dashboardScores = [
  {
    ticker: "VWRP",
    name: "Vanguard FTSE All-World UCITS ETF",
    score: 82,
    status: "Watch",
    review: "Today",
  },
  {
    ticker: "MSFT",
    name: "Microsoft Corporation",
    score: 78,
    status: "Watch",
    review: "Tomorrow",
  },
  {
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    score: 71,
    status: "Wait",
    review: "Fri",
  },
  {
    ticker: "PLTR",
    name: "Palantir Technologies",
    score: 44,
    status: "Avoid",
    review: "Next week",
  },
] as const;

export const watchlists: Watchlist[] = [
  {
    name: "Core ETFs",
    description: "Long-term global exposure with low drama and low upkeep.",
    riskProfile: "low",
    assetCount: 1,
    averageScore: 82,
    lastReviewed: "Today, 08:10",
    highlights: ["VWRP"],
  },
  {
    name: "UK Stocks",
    description: "Dividend and domestic ideas to watch, not chase.",
    riskProfile: "medium",
    assetCount: 1,
    averageScore: 63,
    lastReviewed: "Yesterday, 18:40",
    highlights: ["RR.L"],
  },
  {
    name: "US Stocks",
    description: "High-quality names only after a manual checklist review.",
    riskProfile: "medium",
    assetCount: 1,
    averageScore: 78,
    lastReviewed: "Today, 07:35",
    highlights: ["MSFT"],
  },
  {
    name: "AI & Technology",
    description: "Higher momentum, higher volatility, extra risk discipline.",
    riskProfile: "high",
    assetCount: 2,
    averageScore: 58,
    lastReviewed: "Today, 09:05",
    highlights: ["NVDA", "PLTR"],
  },
  {
    name: "High Risk / Learning Only",
    description: "Watch only. Requires a written reason before any action.",
    riskProfile: "speculative",
    assetCount: 0,
    averageScore: 39,
    lastReviewed: "Two days ago",
    highlights: ["PLTR"],
  },
];

export const portfolioPositions: PortfolioPosition[] = [
  {
    ticker: "VWRP",
    name: "Vanguard FTSE All-World UCITS ETF",
    strategy: "core",
    accountType: "ISA",
    quantity: 1,
    averageBuyPrice: 30,
    currentPrice: 30,
    targetAllocation: 60,
    notes: "Core holding. Keep the thesis simple and the position consistent.",
  },
  {
    ticker: "MSFT",
    name: "Microsoft Corporation",
    strategy: "swing",
    accountType: "Invest",
    quantity: 1,
    averageBuyPrice: 10,
    currentPrice: 10,
    targetAllocation: 20,
    notes: "Small starter position for research and trend review.",
  },
  {
    ticker: "CASH",
    name: "Uninvested cash",
    strategy: "learning",
    accountType: "Other",
    quantity: 10,
    averageBuyPrice: 1,
    currentPrice: 1,
    targetAllocation: 20,
    notes: "Reserve for planned entries and error margin.",
  },
];

export const journalEntries: JournalEntry[] = [
  {
    ticker: "VWRP",
    action: "Add",
    amount: "£80",
    reason: "Core allocation was below target after the last top-up.",
    riskAmount: "£1",
    stopLossIdea: "No hard stop; review if the trend breaks and thesis changes.",
    reviewDate: "2026-06-06",
    emotionBefore: "Calm",
    lesson: "Keep the core bucket boring and consistent.",
  },
  {
    ticker: "MSFT",
    action: "Paper trade",
    amount: "£0",
    reason: "Wanted to test the checklist before putting real capital at risk.",
    riskAmount: "£1",
    stopLossIdea: "Only act if price and sentiment both improve after review.",
    reviewDate: "2026-06-04",
    emotionBefore: "Curious",
    lesson: "A good setup still needs discipline.",
  },
  {
    ticker: "PLTR",
    action: "Avoid",
    amount: "£0",
    reason: "Volatility and narrative risk were too high for beginner mode.",
    riskAmount: "£1",
    stopLossIdea: "Stay out until a cleaner structure appears.",
    reviewDate: "2026-06-10",
    emotionBefore: "Cautious",
    lesson: "Avoiding a trade is still a decision.",
  },
];

export const alerts: AlertItem[] = [
  {
    title: "Review level hit",
    asset: "VWRP",
    type: "Price above",
    action: "Open the research note before acting.",
    due: "Today",
  },
  {
    title: "Score update due",
    asset: "MSFT",
    type: "Score above threshold",
    action: "Check if the score still supports a watch stance.",
    due: "Today",
  },
  {
    title: "Journal check-in",
    asset: "Portfolio",
    type: "Review due",
    action: "Log the weekly review while the context is fresh.",
    due: "Tomorrow",
  },
  {
    title: "News catalyst",
    asset: "NVDA",
    type: "News catalyst",
    action: "Review the source and the risk, not the headline alone.",
    due: "Fri",
  },
];

export const opportunityScans: OpportunityScan[] = [
  {
    id: "scan-morning-20260602",
    label: "Morning Scan",
    title: "What changed overnight",
    summary:
      "Focus on fresh evidence, new catalysts, and items that crossed a review threshold.",
    bullets: [
      "Market health and risk appetite",
      "New opportunities and filings",
      "High-priority reviews for today",
    ],
    status: "Completed",
    marketHealthScore: 68,
    triggerSource: "dev_script",
    startedAt: "2026-06-02T07:00:00Z",
    completedAt: "2026-06-02T07:12:00Z",
    completedSuccessfully: true,
    totalIntelligenceItems: 6,
    totalAlertsGenerated: 4,
    highPriorityCount: 2,
    speculativeCount: 1,
    avoidOrReassessCount: 1,
    errorMessage: null,
  },
  {
    id: "scan-evening-20260602",
    label: "Evening Scan",
    title: "What deserves follow-up",
    summary:
      "Close the loop on today’s evidence and prepare tomorrow’s review list.",
    bullets: [
      "Market summary and portfolio review",
      "Watchlist score changes",
      "Tomorrow’s opportunity candidates",
    ],
    status: "Completed",
    marketHealthScore: 61,
    triggerSource: "dev_script",
    startedAt: "2026-06-02T16:35:00Z",
    completedAt: "2026-06-02T16:48:00Z",
    completedSuccessfully: true,
    totalIntelligenceItems: 6,
    totalAlertsGenerated: 4,
    highPriorityCount: 1,
    speculativeCount: 1,
    avoidOrReassessCount: 1,
    errorMessage: null,
  },
] as const;

export const opportunityAlerts: OpportunityAlert[] = [
  {
    id: "opp-rr-20260602-generated",
    sourceIntelligenceItemId: "rns-mock-final-results-rr",
    symbol: "RR.L",
    name: "Rolls-Royce Holdings plc",
    market: "LSE",
    opportunityType: "Earnings momentum",
    catalystSummary:
      "Final results show improving cash generation and order visibility, so this is a review-only momentum candidate.",
    score: 82,
    priority: "Watch today",
    sourceConfidence: "High",
    sourceConfidenceScore: 95,
    riskLevel: "Medium",
    suggestedPositionRange: "£5-£10",
    suggestedHoldTimeframe: "1 to 10 trading days",
    exitPlan: "Reassess if the post-results follow-through fades or guidance changes.",
    riskWarning:
      "Post-announcement moves can reverse quickly.",
    generatedBy: "deterministic_rules",
    generationReason:
      "Deterministic rules promoted the final results score into a review-only earnings momentum alert.",
    invalidationNotes:
      "Reassess if the final-results thesis no longer appears supported by follow-through.",
    reviewBy: "2026-06-03",
    confidenceLabel: "High",
    evidenceItems: [
      {
        label: "Primary scored intelligence",
        summary:
          "Official final results with improved cash generation and order visibility.",
        sourceUrl: "https://www.londonstockexchange.com/news-article/RR./final-results/mock-001",
        intelligenceItemId: "rns-mock-final-results-rr",
        evidenceType: "scored_intelligence",
        isPrimary: true,
      },
    ],
    evidencePlaceholders: [
      "Primary scored intelligence",
      "Final results evidence",
      "Review-only catalyst",
    ],
    filterTags: ["High-priority review", "Watch today", "Swing trades"],
    scan: "Morning",
  },
  {
    id: "opp-itm-20260602-generated",
    sourceIntelligenceItemId: "rns-mock-trading-update-itm",
    symbol: "ITM.L",
    name: "ITM Power plc",
    market: "LSE",
    opportunityType: "Earnings momentum",
    catalystSummary:
      "Trading update highlights a mixed demand picture and revised expectations, so this stays review-only.",
    score: 86,
    priority: "High-priority review",
    sourceConfidence: "High",
    sourceConfidenceScore: 95,
    riskLevel: "High",
    suggestedPositionRange: "£5-£10",
    suggestedHoldTimeframe: "1 to 10 trading days",
    exitPlan: "Reassess after the market reaction or if revised expectations are confirmed.",
    riskWarning:
      "Mixed updates can reverse quickly and require a fresh read-through.",
    generatedBy: "deterministic_rules",
    generationReason:
      "Deterministic rules promoted the mixed trading update into a high-priority review alert.",
    invalidationNotes:
      "Reassess if the demand picture proves less negative than the headline suggests.",
    reviewBy: "2026-06-03",
    confidenceLabel: "High",
    evidenceItems: [
      {
        label: "Primary scored intelligence",
        summary:
          "Trading update highlighted a mixed demand picture and revised expectations.",
        sourceUrl: "https://www.londonstockexchange.com/news-article/ITM/trading-update/mock-002",
        intelligenceItemId: "rns-mock-trading-update-itm",
        evidenceType: "scored_intelligence",
        isPrimary: true,
      },
    ],
    evidencePlaceholders: [
      "Primary scored intelligence",
      "Trading update evidence",
      "Revised expectations",
    ],
    filterTags: ["High-priority review", "Watch today", "Swing trades"],
    scan: "Morning",
  },
  {
    id: "opp-barc-20260602-generated",
    sourceIntelligenceItemId: "rns-mock-director-dealing-barc",
    symbol: "BARC.L",
    name: "Barclays plc",
    market: "LSE",
    opportunityType: "Swing trade",
    catalystSummary:
      "Director dealing discloses a modest open-market purchase, which is useful context but not a standalone trigger.",
    score: 58,
    priority: "Monitor only",
    sourceConfidence: "High",
    sourceConfidenceScore: 95,
    riskLevel: "Medium",
    suggestedPositionRange: "£0-£5",
    suggestedHoldTimeframe: "1 to 5 trading days",
    exitPlan: "Reassess if the purchase is not supported by other evidence.",
    riskWarning:
      "Director activity is useful context, not a standalone trigger.",
    generatedBy: "deterministic_rules",
    generationReason:
      "Deterministic rules turned the director purchase into a monitor-only swing review.",
    invalidationNotes:
      "Reassess if the purchase proves immaterial or unrelated to the broader thesis.",
    reviewBy: "2026-06-05",
    confidenceLabel: "High",
    evidenceItems: [
      {
        label: "Primary scored intelligence",
        summary:
          "Director dealing disclosed a modest open-market purchase.",
        sourceUrl: "https://www.londonstockexchange.com/news-article/BARC/director-pdmr-shareholding/mock-003",
        intelligenceItemId: "rns-mock-director-dealing-barc",
        evidenceType: "scored_intelligence",
        isPrimary: true,
      },
    ],
    evidencePlaceholders: [
      "Primary scored intelligence",
      "Director dealing evidence",
      "Context only",
    ],
    filterTags: ["Monitor only", "Swing trades"],
    scan: "Evening",
  },
  {
    id: "opp-solg-20260602-generated",
    sourceIntelligenceItemId: "rns-mock-drill-solg",
    symbol: "SOLG",
    name: "SolGold plc",
    market: "AIM",
    opportunityType: "Mining/resource catalyst",
    catalystSummary:
      "Drill results report additional mineralisation, but the setup remains speculative and review-only.",
    score: 91,
    priority: "Speculative review",
    sourceConfidence: "High",
    sourceConfidenceScore: 95,
    riskLevel: "Speculative",
    suggestedPositionRange: "£1-£3",
    suggestedHoldTimeframe: "Same day to 5 trading days",
    exitPlan: "Reassess if follow-up technical detail or funding context weakens the thesis.",
    riskWarning:
      "High volatility and speculative resource risk remain elevated.",
    generatedBy: "deterministic_rules",
    generationReason:
      "Deterministic rules promoted the drilling update into a speculative mining/resource review.",
    invalidationNotes:
      "Reassess if follow-up assays, technical notes, or funding context weaken the catalyst.",
    reviewBy: "2026-06-04",
    confidenceLabel: "High",
    evidenceItems: [
      {
        label: "Primary scored intelligence",
        summary:
          "Drill results reported additional mineralisation in a follow-up update.",
        sourceUrl: "https://www.londonstockexchange.com/news-article/SOLG/drilling-update/mock-004",
        intelligenceItemId: "rns-mock-drill-solg",
        evidenceType: "scored_intelligence",
        isPrimary: true,
      },
    ],
    evidencePlaceholders: [
      "Primary scored intelligence",
      "Drill result evidence",
      "Speculative catalyst",
    ],
    filterTags: ["Penny shares"],
    scan: "Morning",
  },
  {
    id: "opp-aal-20260602-generated",
    sourceIntelligenceItemId: "rns-mock-placing-aal",
    symbol: "AAL.L",
    name: "Anglesey Mining plc",
    market: "LSE",
    opportunityType: "Special situation",
    catalystSummary:
      "Placing and fundraising create dilution and funding risk, so this remains a high-priority review item.",
    score: 94,
    priority: "High-priority review",
    sourceConfidence: "High",
    sourceConfidenceScore: 95,
    riskLevel: "High",
    suggestedPositionRange: "£0",
    suggestedHoldTimeframe: "Wait for dilution impact and market reaction",
    exitPlan: "Reassess after pricing, dilution, and runway are clear.",
    riskWarning:
      "Dilution and funding risk are elevated.",
    generatedBy: "deterministic_rules",
    generationReason:
      "Deterministic rules promoted the placing announcement into a high-priority special situation review.",
    invalidationNotes:
      "Reassess if dilution, pricing, or cash runway turn out less severe than expected.",
    reviewBy: "2026-06-03",
    confidenceLabel: "High",
    evidenceItems: [
      {
        label: "Primary scored intelligence",
        summary:
          "Placing and fundraising announced to support ongoing project work.",
        sourceUrl: "https://www.londonstockexchange.com/news-article/AAL/placing-and-subscription/mock-005",
        intelligenceItemId: "rns-mock-placing-aal",
        evidenceType: "scored_intelligence",
        isPrimary: true,
      },
    ],
    evidencePlaceholders: [
      "Primary scored intelligence",
      "Fundraising evidence",
      "Dilution risk",
    ],
    filterTags: ["High-priority review"],
    scan: "Morning",
  },
  {
    id: "opp-xyz-20260602-generated",
    sourceIntelligenceItemId: "rns-mock-going-concern-xyz",
    symbol: "XYZ.L",
    name: "Example Resources plc",
    market: "LSE",
    opportunityType: "Special situation",
    catalystSummary:
      "Going concern warning is critical risk evidence and should only be reviewed, not acted on blindly.",
    score: 98,
    priority: "Avoid or reassess",
    sourceConfidence: "High",
    sourceConfidenceScore: 95,
    riskLevel: "Critical",
    suggestedPositionRange: "£0",
    suggestedHoldTimeframe: "Avoid until clarified",
    exitPlan: "Only reassess after the company confirms funding or risk resolution.",
    riskWarning:
      "Evidence indicates critical risk.",
    generatedBy: "deterministic_rules",
    generationReason:
      "Deterministic rules promoted the going-concern warning into an avoid-or-reassess special situation alert.",
    invalidationNotes:
      "Reassess only after funding or risk resolution is confirmed.",
    reviewBy: "2026-06-03",
    confidenceLabel: "High",
    evidenceItems: [
      {
        label: "Primary scored intelligence",
        summary:
          "Going concern warning issued alongside financing uncertainty.",
        sourceUrl: "https://www.londonstockexchange.com/news-article/XYZ/going-concern-statement/mock-006",
        intelligenceItemId: "rns-mock-going-concern-xyz",
        evidenceType: "scored_intelligence",
        isPrimary: true,
      },
    ],
    evidencePlaceholders: [
      "Primary scored intelligence",
      "Going concern evidence",
      "Avoid until clarified",
    ],
    filterTags: ["High-priority review"],
    scan: "Morning",
  },
  {
    id: "opp-xlk-20260602-generated",
    sourceIntelligenceItemId: null,
    symbol: "XLK",
    name: "Technology Select Sector SPDR Fund",
    market: "NYSE",
    opportunityType: "ETF/sector rotation",
    catalystSummary:
      "Relative strength versus the broader market suggests a sector rotation idea worth monitoring.",
    score: 71,
    priority: "Monitor only",
    sourceConfidence: "Medium-high",
    sourceConfidenceScore: 81,
    riskLevel: "Low",
    suggestedPositionRange: "£5-£12",
    suggestedHoldTimeframe: "Weeks to months",
    exitPlan: "Reassess if leadership fades or macro conditions rotate away from growth.",
    riskWarning:
      "Sector leadership can reverse quickly if macro risk appetite weakens.",
    generatedBy: "deterministic_rules",
    generationReason:
      "Deterministic rules promoted the sector rotation evidence into a monitor-only review.",
    invalidationNotes:
      "Reassess if leadership fades or the macro backdrop weakens.",
    reviewBy: "2026-06-07",
    confidenceLabel: "Medium-high",
    evidenceItems: [
      {
        label: "Sector rotation placeholder",
        summary: "Relative strength and ETF flow context remain constructive.",
        sourceUrl: "https://www.ssga.com/us/en/intermediary/etfs/funds/xlk",
        intelligenceItemId: null,
        evidenceType: "market_context",
        isPrimary: true,
      },
      {
        label: "Source unavailable",
        summary:
          "Demo/sample evidence — not a live market source. The original source URL is unavailable in mock mode.",
        sourceUrl: null,
        intelligenceItemId: null,
        evidenceType: "demo_sample",
        isPrimary: false,
      },
    ],
    evidencePlaceholders: [
      "Relative strength placeholder",
      "ETF flow placeholder",
      "Sector breadth placeholder",
    ],
    filterTags: ["Monitor only", "Long-term"],
    scan: "Evening",
  },
];

export const recentIntelligenceItems: RecentIntelligenceItem[] = [
  {
    id: "rns-mock-final-results-rr",
    assetSymbol: "RR.L",
    companyName: "Rolls-Royce Holdings plc",
    headline: "Final results show improving cash generation and order visibility",
    announcementType: "Final results",
    classification: "final_results",
    source: "London Stock Exchange RNS",
    sourceConfidence: "High",
    sourceConfidenceScore: 95,
    verificationStatus: "Verified",
    impactScore: 18,
    impactDirection: "Positive",
    riskLevel: "Medium",
    priority: "Watch today",
    scoringReason:
      "Official results language appears constructive and worth reviewing.",
    publishedAt: "2026-06-02T07:05:00Z",
    riskLabel: "Watch",
  },
  {
    id: "rns-mock-trading-update-itm",
    assetSymbol: "ITM.L",
    companyName: "ITM Power plc",
    headline: "Trading update highlights a mixed demand picture and revised expectations",
    announcementType: "Trading update",
    classification: "trading_update",
    source: "London Stock Exchange RNS",
    sourceConfidence: "High",
    sourceConfidenceScore: 95,
    verificationStatus: "Verified",
    impactScore: -8,
    impactDirection: "Mixed",
    riskLevel: "High",
    priority: "High-priority review",
    scoringReason:
      "Trading update language is mixed and needs context before stronger action.",
    publishedAt: "2026-06-02T07:12:00Z",
    riskLabel: "Watch",
  },
  {
    id: "rns-mock-director-dealing-barc",
    assetSymbol: "BARC.L",
    companyName: "Barclays plc",
    headline: "Director dealing discloses a modest open-market purchase",
    announcementType: "Director dealings",
    classification: "director_dealings",
    source: "London Stock Exchange RNS",
    sourceConfidence: "High",
    sourceConfidenceScore: 95,
    verificationStatus: "Verified",
    impactScore: 8,
    impactDirection: "Positive",
    riskLevel: "Medium",
    priority: "Monitor only",
    scoringReason:
      "Director purchase language is mildly constructive, but not urgent.",
    publishedAt: "2026-06-02T07:18:00Z",
    riskLabel: "Core",
  },
  {
    id: "rns-mock-drill-solg",
    assetSymbol: "SOLG",
    companyName: "SolGold plc",
    headline: "Drill results report additional mineralisation in a follow-up update",
    announcementType: "Drill results",
    classification: "drill_results",
    source: "London Stock Exchange RNS",
    sourceConfidence: "High",
    sourceConfidenceScore: 95,
    verificationStatus: "Partially verified",
    impactScore: 22,
    impactDirection: "Speculative",
    riskLevel: "Speculative",
    priority: "Speculative review",
    scoringReason:
      "Official drilling language may be catalytic, but it remains speculative and high risk.",
    publishedAt: "2026-06-02T07:25:00Z",
    riskLabel: "Speculative",
  },
  {
    id: "rns-mock-placing-aal",
    assetSymbol: "AAL.L",
    companyName: "Anglesey Mining plc",
    headline: "Placing and fundraising announced to support ongoing project work",
    announcementType: "Placing/fundraising",
    classification: "placing_fundraising",
    source: "London Stock Exchange RNS",
    sourceConfidence: "High",
    sourceConfidenceScore: 95,
    verificationStatus: "Verified",
    impactScore: -22,
    impactDirection: "Negative",
    riskLevel: "High",
    priority: "High-priority review",
    scoringReason:
      "Fundraising wording raises dilution and financing risk, so the item needs review.",
    publishedAt: "2026-06-02T07:31:00Z",
    riskLabel: "Speculative",
  },
  {
    id: "rns-mock-going-concern-xyz",
    assetSymbol: "XYZ.L",
    companyName: "Example Resources plc",
    headline: "Going concern warning issued alongside financing uncertainty",
    announcementType: "Going concern warning",
    classification: "going_concern_warning",
    source: "London Stock Exchange RNS",
    sourceConfidence: "High",
    sourceConfidenceScore: 95,
    verificationStatus: "Verified",
    impactScore: -40,
    impactDirection: "Negative",
    riskLevel: "Critical",
    priority: "Avoid or reassess",
    scoringReason:
      "Going concern language creates critical financing risk and requires reassessment.",
    publishedAt: "2026-06-02T07:42:00Z",
    riskLabel: "Urgent",
  },
  {
    id: "rns-news-confirm-reuters-rr",
    assetSymbol: "RR.L",
    companyName: "Rolls-Royce Holdings plc",
    headline: "Reuters confirms the market reaction to strong RNS results",
    announcementType: "News confirmation",
    classification: "final_results",
    source: "Reuters Professional News",
    sourceConfidence: "High",
    sourceConfidenceScore: 90,
    verificationStatus: "Partially verified",
    impactScore: 14,
    impactDirection: "Positive",
    riskLevel: "Medium",
    priority: "Watch today",
    scoringReason:
      "Professional news confirms the filing context and supports review without replacing the primary evidence.",
    publishedAt: "2026-06-02T08:12:00Z",
    riskLabel: "Watch",
    signalType: "confirming_news",
    sourceTier: 2,
    weightingMultiplier: 0.8,
    sourceLicenceStatus: "paid_required",
    sourceAccessMethod: "paid_provider",
    primaryConfirmationRequired: true,
    confirmedByPrimarySource: true,
  },
  {
    id: "rns-aggregator-yahoo-nvda",
    assetSymbol: "NVDA",
    companyName: "NVIDIA Corporation",
    headline: "Yahoo Finance summarises the latest price and volume surge",
    announcementType: "Aggregator summary",
    classification: "other",
    source: "Yahoo Finance Aggregator",
    sourceConfidence: "Medium",
    sourceConfidenceScore: 70,
    verificationStatus: "Unverified",
    impactScore: 4,
    impactDirection: "Neutral",
    riskLevel: "Medium",
    priority: "Monitor only",
    scoringReason:
      "Aggregator context is useful, but primary evidence is needed before it can influence the thesis.",
    publishedAt: "2026-06-02T08:24:00Z",
    riskLabel: "Core",
    signalType: "aggregator_summary",
    sourceTier: 3,
    weightingMultiplier: 0.55,
    sourceLicenceStatus: "open",
    sourceAccessMethod: "html",
    primaryConfirmationRequired: true,
    confirmedByPrimarySource: false,
  },
  {
    id: "rns-press-globenewswire-pltr",
    assetSymbol: "PLTR",
    companyName: "Palantir Technologies Inc.",
    headline: "GlobeNewswire press release announces a new commercial collaboration",
    announcementType: "Press release",
    classification: "other",
    source: "GlobeNewswire Press Wire",
    sourceConfidence: "Medium",
    sourceConfidenceScore: 78,
    verificationStatus: "Unverified",
    impactScore: 8,
    impactDirection: "Positive",
    riskLevel: "Medium",
    priority: "Watch today",
    scoringReason:
      "Press-wire distribution can be useful for review, but it is still company-authored and not independent proof.",
    publishedAt: "2026-06-02T08:36:00Z",
    riskLabel: "Watch",
    signalType: "press_release",
    sourceTier: 4,
    weightingMultiplier: 0.35,
    sourceLicenceStatus: "open",
    sourceAccessMethod: "html",
    primaryConfirmationRequired: true,
    confirmedByPrimarySource: false,
  },
  {
    id: "rns-social-reddit-spike-nvda",
    assetSymbol: "NVDA",
    companyName: "NVIDIA Corporation",
    headline: "Reddit users discuss a sharp ticker spike after market open",
    announcementType: "Social attention",
    classification: "other",
    source: "Reddit /r/stocks Discovery",
    sourceConfidence: "Low",
    sourceConfidenceScore: 35,
    verificationStatus: "Unverified",
    impactScore: 0,
    impactDirection: "Unknown",
    riskLevel: "Speculative",
    priority: "Monitor only",
    scoringReason:
      "Social chatter can help discovery, but primary evidence is required before it changes the thesis.",
    publishedAt: "2026-06-02T08:48:00Z",
    riskLabel: "Speculative",
    signalType: "social_attention",
    sourceTier: 5,
    weightingMultiplier: 0.15,
    sourceLicenceStatus: "unknown",
    sourceAccessMethod: "manual",
    rumourFlag: false,
    pumpRiskFlag: false,
    primaryConfirmationRequired: true,
    confirmedByPrimarySource: false,
  },
  {
    id: "rns-forum-pump-risk-advfn-xyz",
    assetSymbol: "XYZ.L",
    companyName: "Example Resources plc",
    headline: "ADVFN forum post claims a guaranteed multibagger and insider tip",
    announcementType: "Pump-risk warning",
    classification: "other",
    source: "ADVFN / LSE Share Chat",
    sourceConfidence: "Low",
    sourceConfidenceScore: 30,
    verificationStatus: "Unverified",
    impactScore: -4,
    impactDirection: "Negative",
    riskLevel: "High",
    priority: "Watch today",
    scoringReason:
      "Guaranteed-return and insider-tip language is pump-risk noise, not evidence, so confidence should stay low.",
    publishedAt: "2026-06-02T09:00:00Z",
    riskLabel: "Urgent",
    signalType: "pump_risk_warning",
    sourceTier: 5,
    weightingMultiplier: 0.15,
    sourceLicenceStatus: "unknown",
    sourceAccessMethod: "manual",
    rumourFlag: true,
    pumpRiskFlag: true,
    primaryConfirmationRequired: true,
    confirmedByPrimarySource: false,
  },
] as const;

export const intelligenceSources = [
  {
    id: "mock-source-lse-rns",
    name: "London Stock Exchange RNS",
    sourceType: "rns",
    tier: 1,
    accessMethod: "html",
    licenceStatus: "open",
    weightingMultiplier: 1,
    canCreateAlerts: true,
    requiresPrimaryConfirmation: false,
    baseUrl: "https://www.londonstockexchange.com/news",
    confidenceScore: 95,
    isActive: true,
    notes: "Official announcement feed used for demo and fallback records.",
    createdAt: "2026-06-02T07:00:00Z",
  },
  {
    id: "mock-source-reuters",
    name: "Reuters Professional News",
    sourceType: "news",
    tier: 2,
    accessMethod: "paid_provider",
    licenceStatus: "paid_required",
    weightingMultiplier: 0.8,
    canCreateAlerts: true,
    requiresPrimaryConfirmation: true,
    baseUrl: null,
    confidenceScore: 90,
    isActive: true,
    notes: "Professional news source used for confirmation examples only.",
    createdAt: "2026-06-02T07:00:00Z",
  },
  {
    id: "mock-source-yahoo-finance",
    name: "Yahoo Finance Aggregator",
    sourceType: "market_data",
    tier: 3,
    accessMethod: "html",
    licenceStatus: "open",
    weightingMultiplier: 0.55,
    canCreateAlerts: false,
    requiresPrimaryConfirmation: true,
    baseUrl: "https://finance.yahoo.com",
    confidenceScore: 70,
    isActive: true,
    notes: "Aggregator example for contextual signals and market summaries.",
    createdAt: "2026-06-02T07:00:00Z",
  },
  {
    id: "mock-source-globenewswire",
    name: "GlobeNewswire Press Wire",
    sourceType: "other",
    tier: 4,
    accessMethod: "html",
    licenceStatus: "open",
    weightingMultiplier: 0.35,
    canCreateAlerts: true,
    requiresPrimaryConfirmation: true,
    baseUrl: "https://www.globenewswire.com",
    confidenceScore: 78,
    isActive: true,
    notes: "Press wire example; company-authored distribution should be reviewed carefully.",
    createdAt: "2026-06-02T07:00:00Z",
  },
  {
    id: "mock-source-reddit",
    name: "Reddit /r/stocks Discovery",
    sourceType: "social",
    tier: 5,
    accessMethod: "manual",
    licenceStatus: "unknown",
    weightingMultiplier: 0.15,
    canCreateAlerts: false,
    requiresPrimaryConfirmation: true,
    baseUrl: "https://www.reddit.com/r/stocks",
    confidenceScore: 35,
    isActive: true,
    notes: "Discovery-only forum signal. Requires primary evidence before promotion.",
    createdAt: "2026-06-02T07:00:00Z",
  },
  {
    id: "mock-source-stocktwits",
    name: "StockTwits Discovery",
    sourceType: "social",
    tier: 5,
    accessMethod: "manual",
    licenceStatus: "unknown",
    weightingMultiplier: 0.15,
    canCreateAlerts: false,
    requiresPrimaryConfirmation: true,
    baseUrl: "https://stocktwits.com",
    confidenceScore: 35,
    isActive: true,
    notes: "Discovery-only social signal source.",
    createdAt: "2026-06-02T07:00:00Z",
  },
  {
    id: "mock-source-advfn",
    name: "ADVFN / LSE Share Chat",
    sourceType: "social",
    tier: 5,
    accessMethod: "manual",
    licenceStatus: "unknown",
    weightingMultiplier: 0.15,
    canCreateAlerts: false,
    requiresPrimaryConfirmation: true,
    baseUrl: "https://www.advfn.com",
    confidenceScore: 30,
    isActive: true,
    notes: "Discovery-only forum signal source; not a trusted evidence source on its own.",
    createdAt: "2026-06-02T07:00:00Z",
  },
  {
    id: "mock-source-demo",
    name: "Demo sample evidence",
    sourceType: "other",
    tier: 5,
    accessMethod: "manual",
    licenceStatus: "unknown",
    weightingMultiplier: 0.15,
    canCreateAlerts: false,
    requiresPrimaryConfirmation: true,
    baseUrl: null,
    confidenceScore: 40,
    isActive: true,
    notes: "Mock record used to demonstrate unavailable evidence states.",
    createdAt: "2026-06-02T07:00:00Z",
  },
] as const;

export const sourceCandidates = [
  {
    id: "mock-source-candidate-lse-news-rejected",
    name: "London Stock Exchange News",
    sourceType: "rns",
    url: "https://www.londonstockexchange.com/news",
    accessMethod: "js_rendered",
    status: "rejected",
    confidenceScore: 60,
    diagnosticStatus: "not_suitable_for_simple_parser",
    diagnosticSummary:
      "HTTP 200, title present, anchorCount 0, likelyRnsHrefCount 0, appearsJavaScriptRendered true",
    lastCheckedAt: "2026-06-02T09:15:00Z",
    validationOwner: "Manual review",
    validationNotes:
      "The page is reachable but does not expose parseable anchors for a simple server fetch.",
    lastDiagnosticId: "mock-source-diagnostic-lse-news-0915",
    validatedAt: null,
    rejectedAt: "2026-06-02T09:15:00Z",
    notes:
      "Reachable but not suitable for simple server-side parsing. Keep as a diagnostic reference only.",
    createdAt: "2026-06-11T00:00:00Z",
    updatedAt: "2026-06-11T00:00:00Z",
  },
  {
    id: "mock-source-candidate-lse-news-validating",
    name: "London Stock Exchange RNS/company announcements candidate",
    sourceType: "rns",
    url: "https://www.londonstockexchange.com/news",
    accessMethod: "js_rendered",
    status: "validating",
    confidenceScore: 70,
    diagnosticStatus: "diagnostic_required",
    diagnosticSummary:
      "Candidate source tracked for future parser work; requires manual validation before any ingestion change.",
    lastCheckedAt: null,
    validationOwner: "Manual review",
    validationNotes:
      "Keep manual-first and re-evaluate after a parser strategy is defined.",
    lastDiagnosticId: "mock-source-diagnostic-lse-news-0900",
    validatedAt: null,
    rejectedAt: null,
    notes: "Keep manual-first. Do not force scraping or unattended crawling.",
    createdAt: "2026-06-11T00:00:00Z",
    updatedAt: "2026-06-11T00:00:00Z",
  },
  {
    id: "mock-source-candidate-company-ir",
    name: "Company investor relations pages",
    sourceType: "company_ir",
    url: null,
    accessMethod: "manual",
    status: "manual_only",
    confidenceScore: 85,
    diagnosticStatus: "future_candidate_category",
    diagnosticSummary:
      "Official issuer pages are useful for manual review and future validation, but coverage and formatting vary by company.",
    lastCheckedAt: null,
    validationOwner: "Manual review",
    validationNotes:
      "Track as a manual-only candidate until issuer-by-issuer coverage is understood.",
    lastDiagnosticId: "mock-source-diagnostic-company-ir-0910",
    validatedAt: null,
    rejectedAt: null,
    notes:
      "Track as a future source category rather than a single parse target.",
    createdAt: "2026-06-11T00:00:00Z",
    updatedAt: "2026-06-11T00:00:00Z",
  },
  {
    id: "mock-source-candidate-paid-provider",
    name: "Paid structured provider",
    sourceType: "provider",
    url: null,
    accessMethod: "paid_provider",
    status: "paid_required",
    confidenceScore: 90,
    diagnosticStatus: "commercial_access_required",
    diagnosticSummary:
      "A structured feed or API may be useful later, but access is commercial and should not be assumed available.",
    lastCheckedAt: null,
    validationOwner: "Research review",
    validationNotes:
      "Paid provider candidate only. Do not assume commercial access until procurement is confirmed.",
    lastDiagnosticId: "mock-source-diagnostic-paid-provider-0912",
    validatedAt: null,
    rejectedAt: null,
    notes:
      "Future option only; do not build around unavailable commercial access.",
    createdAt: "2026-06-11T00:00:00Z",
    updatedAt: "2026-06-11T00:00:00Z",
  },
  {
    id: "mock-source-candidate-sec-filings",
    name: "SEC filings",
    sourceType: "sec",
    url: "https://www.sec.gov/edgar/search/",
    accessMethod: "api",
    status: "validated",
    confidenceScore: 95,
    diagnosticStatus: "validated_future_source_type",
    diagnosticSummary:
      "Validated future source type for US filings if a US source path is later required.",
    lastCheckedAt: null,
    validationOwner: "Research review",
    validationNotes:
      "Validated future source type for US disclosures; not part of the current ingestion scope.",
    lastDiagnosticId: "mock-source-diagnostic-sec-filings-0920",
    validatedAt: "2026-06-02T09:20:00Z",
    rejectedAt: null,
    notes: "High-confidence future source class for US disclosures.",
    createdAt: "2026-06-11T00:00:00Z",
    updatedAt: "2026-06-11T00:00:00Z",
  },
  {
    id: "mock-source-candidate-bloomberg-news",
    name: "Bloomberg Professional News",
    sourceType: "news",
    url: "https://www.bloomberg.com",
    accessMethod: "paid_provider",
    status: "paid_required",
    confidenceScore: 92,
    diagnosticStatus: "paid_required_future_candidate",
    diagnosticSummary:
      "Professional news source candidate. Treat as paid/licensed until valid access is confirmed.",
    lastCheckedAt: null,
    validationOwner: "Research review",
    validationNotes:
      "Discovery only until access terms and licensing are confirmed.",
    lastDiagnosticId: null,
    validatedAt: null,
    rejectedAt: null,
    notes: "Tier 2 professional news candidate. Not enabled for ingestion.",
    createdAt: "2026-06-11T00:00:00Z",
    updatedAt: "2026-06-11T00:00:00Z",
  },
  {
    id: "mock-source-candidate-reuters-news",
    name: "Reuters Professional News",
    sourceType: "news",
    url: "https://www.reuters.com",
    accessMethod: "paid_provider",
    status: "paid_required",
    confidenceScore: 90,
    diagnosticStatus: "paid_required_future_candidate",
    diagnosticSummary:
      "Professional news source candidate. Keep paid access gated until the source is formally validated.",
    lastCheckedAt: null,
    validationOwner: "Research review",
    validationNotes:
      "Discovery only until licensed access is confirmed.",
    lastDiagnosticId: null,
    validatedAt: null,
    rejectedAt: null,
    notes: "Tier 2 professional news candidate. Do not scrape protected content.",
    createdAt: "2026-06-11T00:00:00Z",
    updatedAt: "2026-06-11T00:00:00Z",
  },
  {
    id: "mock-source-candidate-ft-news",
    name: "Financial Times Professional News",
    sourceType: "news",
    url: "https://www.ft.com",
    accessMethod: "paid_provider",
    status: "paid_required",
    confidenceScore: 90,
    diagnosticStatus: "paid_required_future_candidate",
    diagnosticSummary:
      "Professional news source candidate. Keep as paid/licensed until access is proven and documented.",
    lastCheckedAt: null,
    validationOwner: "Research review",
    validationNotes:
      "Discovery only until licensed access is confirmed.",
    lastDiagnosticId: null,
    validatedAt: null,
    rejectedAt: null,
    notes: "Tier 2 professional news candidate. Do not scrape protected content.",
    createdAt: "2026-06-11T00:00:00Z",
    updatedAt: "2026-06-11T00:00:00Z",
  },
  {
    id: "mock-source-candidate-yahoo-aggregator",
    name: "Yahoo Finance Aggregator",
    sourceType: "aggregator",
    url: "https://finance.yahoo.com",
    accessMethod: "html",
    status: "candidate",
    confidenceScore: 72,
    diagnosticStatus: "context_only_candidate",
    diagnosticSummary:
      "Aggregator candidate useful for contextual summaries and market reaction tracking.",
    lastCheckedAt: null,
    validationOwner: "Manual review",
    validationNotes:
      "Can support confirmation but should not dominate scoring.",
    lastDiagnosticId: null,
    validatedAt: null,
    rejectedAt: null,
    notes: "Tier 3 aggregator candidate.",
    createdAt: "2026-06-11T00:00:00Z",
    updatedAt: "2026-06-11T00:00:00Z",
  },
  {
    id: "mock-source-candidate-marketwatch-aggregator",
    name: "MarketWatch Aggregator",
    sourceType: "aggregator",
    url: "https://www.marketwatch.com",
    accessMethod: "html",
    status: "candidate",
    confidenceScore: 70,
    diagnosticStatus: "context_only_candidate",
    diagnosticSummary:
      "Aggregator candidate useful for context and reaction summaries.",
    lastCheckedAt: null,
    validationOwner: "Manual review",
    validationNotes:
      "Keep lower weighting than primary evidence or professional news.",
    lastDiagnosticId: null,
    validatedAt: null,
    rejectedAt: null,
    notes: "Tier 3 aggregator candidate.",
    createdAt: "2026-06-11T00:00:00Z",
    updatedAt: "2026-06-11T00:00:00Z",
  },
  {
    id: "mock-source-candidate-marketbeat-aggregator",
    name: "MarketBeat Aggregator",
    sourceType: "aggregator",
    url: "https://www.marketbeat.com",
    accessMethod: "html",
    status: "candidate",
    confidenceScore: 68,
    diagnosticStatus: "context_only_candidate",
    diagnosticSummary:
      "Aggregator candidate useful for summarising market context and analyst commentary.",
    lastCheckedAt: null,
    validationOwner: "Manual review",
    validationNotes:
      "Keep lower weighting than primary evidence.",
    lastDiagnosticId: null,
    validatedAt: null,
    rejectedAt: null,
    notes: "Tier 3 aggregator candidate.",
    createdAt: "2026-06-11T00:00:00Z",
    updatedAt: "2026-06-11T00:00:00Z",
  },
  {
    id: "mock-source-candidate-globenewswire",
    name: "GlobeNewswire Press Wire",
    sourceType: "press_release",
    url: "https://www.globenewswire.com",
    accessMethod: "html",
    status: "candidate",
    confidenceScore: 80,
    diagnosticStatus: "press_wire_candidate",
    diagnosticSummary:
      "Press wire candidate. Useful for review, but company-authored and not independent proof.",
    lastCheckedAt: null,
    validationOwner: "Manual review",
    validationNotes:
      "Monitor and verify against primary evidence before any promotion.",
    lastDiagnosticId: null,
    validatedAt: null,
    rejectedAt: null,
    notes: "Tier 4 press wire candidate.",
    createdAt: "2026-06-11T00:00:00Z",
    updatedAt: "2026-06-11T00:00:00Z",
  },
  {
    id: "mock-source-candidate-reddit-social",
    name: "Reddit Discovery Stream",
    sourceType: "social",
    url: "https://www.reddit.com",
    accessMethod: "manual",
    status: "manual_only",
    confidenceScore: 38,
    diagnosticStatus: "discovery_only",
    diagnosticSummary:
      "Forum chatter can surface discovery signals, but it is not trusted evidence on its own.",
    lastCheckedAt: null,
    validationOwner: "Manual review",
    validationNotes:
      "Discovery only; primary evidence required before acting.",
    lastDiagnosticId: null,
    validatedAt: null,
    rejectedAt: null,
    notes: "Tier 5 discovery-only candidate.",
    createdAt: "2026-06-11T00:00:00Z",
    updatedAt: "2026-06-11T00:00:00Z",
  },
  {
    id: "mock-source-candidate-stocktwits-social",
    name: "StockTwits Discovery Stream",
    sourceType: "social",
    url: "https://stocktwits.com",
    accessMethod: "manual",
    status: "manual_only",
    confidenceScore: 35,
    diagnosticStatus: "discovery_only",
    diagnosticSummary:
      "Social chatter can identify market attention but cannot stand alone as evidence.",
    lastCheckedAt: null,
    validationOwner: "Manual review",
    validationNotes:
      "Discovery only; primary evidence required before acting.",
    lastDiagnosticId: null,
    validatedAt: null,
    rejectedAt: null,
    notes: "Tier 5 discovery-only candidate.",
    createdAt: "2026-06-11T00:00:00Z",
    updatedAt: "2026-06-11T00:00:00Z",
  },
  {
    id: "mock-source-candidate-advfn-social",
    name: "LSE Share Chat / ADVFN",
    sourceType: "social",
    url: "https://www.advfn.com",
    accessMethod: "manual",
    status: "manual_only",
    confidenceScore: 30,
    diagnosticStatus: "discovery_only",
    diagnosticSummary:
      "Forum chatter is discovery only and should not be treated as verified evidence.",
    lastCheckedAt: null,
    validationOwner: "Manual review",
    validationNotes:
      "Discovery only; primary evidence required before acting.",
    lastDiagnosticId: null,
    validatedAt: null,
    rejectedAt: null,
    notes: "Tier 5 discovery-only candidate.",
    createdAt: "2026-06-11T00:00:00Z",
    updatedAt: "2026-06-11T00:00:00Z",
  },
] as const;

export const sourceDiagnostics = [
  {
    id: "mock-source-diagnostic-lse-news-0900",
    sourceCandidateId: "mock-source-candidate-lse-news-validating",
    checkedUrl: "https://www.londonstockexchange.com/news",
    httpStatus: 200,
    contentType: "text/html; charset=utf-8",
    responseLength: 54995,
    pageTitle: "London Stock Exchange | London Stock Exchange",
    anchorCount: 0,
    likelyRnsHrefCount: 0,
    appearsJavascriptRendered: true,
    validExternalUrlsCount: 0,
    rejectedUrlsCount: 0,
    diagnosticSummary:
      "Reachable but JS-rendered; no anchors were exposed for a simple server fetch.",
    recommendation: "manual_review_then_parser_rethink",
    rawSample: {
      first20Hrefs: [],
      note: "No hrefs surfaced in the fetched HTML.",
    },
    createdAt: "2026-06-02T09:00:00Z",
  },
  {
    id: "mock-source-diagnostic-lse-news-0915",
    sourceCandidateId: "mock-source-candidate-lse-news-rejected",
    checkedUrl: "https://www.londonstockexchange.com/news",
    httpStatus: 200,
    contentType: "text/html; charset=utf-8",
    responseLength: 54995,
    pageTitle: "London Stock Exchange | London Stock Exchange",
    anchorCount: 0,
    likelyRnsHrefCount: 0,
    appearsJavascriptRendered: true,
    validExternalUrlsCount: 0,
    rejectedUrlsCount: 0,
    diagnosticSummary:
      "JS-rendered shell with no extractable announcement links; not suitable for a simple parser.",
    recommendation: "unsuitable_for_simple_parser",
    rawSample: {
      first20Hrefs: [],
      note: "Diagnostic confirms the page should not be forced into scraping.",
    },
    createdAt: "2026-06-02T09:15:00Z",
  },
  {
    id: "mock-source-diagnostic-company-ir-0910",
    sourceCandidateId: "mock-source-candidate-company-ir",
    checkedUrl: "https://example.com/investor-relations",
    httpStatus: 200,
    contentType: "text/html; charset=utf-8",
    responseLength: 12842,
    pageTitle: "Investor Relations",
    anchorCount: 12,
    likelyRnsHrefCount: 2,
    appearsJavascriptRendered: false,
    validExternalUrlsCount: 2,
    rejectedUrlsCount: 0,
    diagnosticSummary:
      "Manual-only issuer page with some announcement-style links, but coverage will vary by company.",
    recommendation: "manual_only_future_candidate",
    rawSample: {
      first20Hrefs: ["/results.pdf", "/webcast", "/news"],
    },
    createdAt: "2026-06-02T09:10:00Z",
  },
  {
    id: "mock-source-diagnostic-paid-provider-0912",
    sourceCandidateId: "mock-source-candidate-paid-provider",
    checkedUrl: "https://example.com/structured-feed",
    httpStatus: 403,
    contentType: "text/html; charset=utf-8",
    responseLength: 2048,
    pageTitle: "Access denied",
    anchorCount: 1,
    likelyRnsHrefCount: 0,
    appearsJavascriptRendered: false,
    validExternalUrlsCount: 0,
    rejectedUrlsCount: 1,
    diagnosticSummary:
      "Commercial provider candidate is gated and not available without a paid contract.",
    recommendation: "paid_required",
    rawSample: {
      first20Hrefs: ["/pricing"],
      note: "No accessible announcement feed is available in the mock example.",
    },
    createdAt: "2026-06-02T09:12:00Z",
  },
  {
    id: "mock-source-diagnostic-sec-filings-0920",
    sourceCandidateId: "mock-source-candidate-sec-filings",
    checkedUrl: "https://www.sec.gov/edgar/search/",
    httpStatus: 200,
    contentType: "text/html; charset=utf-8",
    responseLength: 45210,
    pageTitle: "EDGAR Search",
    anchorCount: 8,
    likelyRnsHrefCount: 0,
    appearsJavascriptRendered: false,
    validExternalUrlsCount: 3,
    rejectedUrlsCount: 0,
    diagnosticSummary:
      "Validated future source type for US filings with accessible structured search output.",
    recommendation: "validated_future_source_type",
    rawSample: {
      first20Hrefs: ["/cgi-bin/browse-edgar?action=getcompany", "/search"],
    },
    createdAt: "2026-06-02T09:20:00Z",
  },
] as const;

export const rawAnnouncements = [
  {
    id: "raw-rns-mock-final-results-rr",
    sourceId: "mock-source-lse-rns",
    externalId: "mock-001",
    assetSymbol: "RR.L",
    companyName: "Rolls-Royce Holdings plc",
    headline: "Final results show improving cash generation and order visibility",
    announcementType: "final_results",
    rawCategory: "final_results",
    sourceUrl: "https://www.londonstockexchange.com/news-article/RR./final-results/mock-001",
    publishedAt: "2026-06-02T07:05:00Z",
    rawPayload: {
      headline: "Final results show improving cash generation and order visibility",
      source: "mock LSE RNS",
    },
    ingestionStatus: "parsed",
    createdAt: "2026-06-02T07:05:00Z",
    updatedAt: "2026-06-02T07:05:00Z",
  },
  {
    id: "raw-rns-mock-trading-update-itm",
    sourceId: "mock-source-lse-rns",
    externalId: "mock-002",
    assetSymbol: "ITM.L",
    companyName: "ITM Power plc",
    headline: "Trading update highlights a mixed demand picture and revised expectations",
    announcementType: "trading_update",
    rawCategory: "trading_update",
    sourceUrl: "https://www.londonstockexchange.com/news-article/ITM/trading-update/mock-002",
    publishedAt: "2026-06-02T07:12:00Z",
    rawPayload: {
      headline:
        "Trading update highlights a mixed demand picture and revised expectations",
      source: "mock LSE RNS",
    },
    ingestionStatus: "parsed",
    createdAt: "2026-06-02T07:12:00Z",
    updatedAt: "2026-06-02T07:12:00Z",
  },
  {
    id: "raw-rns-mock-director-dealing-barc",
    sourceId: "mock-source-lse-rns",
    externalId: "mock-003",
    assetSymbol: "BARC.L",
    companyName: "Barclays plc",
    headline: "Director dealing discloses a modest open-market purchase",
    announcementType: "director_dealings",
    rawCategory: "director_dealings",
    sourceUrl: "https://www.londonstockexchange.com/news-article/BARC/director-pdmr-shareholding/mock-003",
    publishedAt: "2026-06-02T07:18:00Z",
    rawPayload: {
      headline: "Director dealing discloses a modest open-market purchase",
      source: "mock LSE RNS",
    },
    ingestionStatus: "parsed",
    createdAt: "2026-06-02T07:18:00Z",
    updatedAt: "2026-06-02T07:18:00Z",
  },
  {
    id: "raw-rns-mock-drill-solg",
    sourceId: "mock-source-lse-rns",
    externalId: "mock-004",
    assetSymbol: "SOLG",
    companyName: "SolGold plc",
    headline: "Drill results report additional mineralisation in a follow-up update",
    announcementType: "drill_results",
    rawCategory: "drill_results",
    sourceUrl: "https://www.londonstockexchange.com/news-article/SOLG/drilling-update/mock-004",
    publishedAt: "2026-06-02T07:25:00Z",
    rawPayload: {
      headline: "Drill results report additional mineralisation in a follow-up update",
      source: "mock LSE RNS",
    },
    ingestionStatus: "parsed",
    createdAt: "2026-06-02T07:25:00Z",
    updatedAt: "2026-06-02T07:25:00Z",
  },
  {
    id: "raw-rns-mock-placing-aal",
    sourceId: "mock-source-lse-rns",
    externalId: "mock-005",
    assetSymbol: "AAL.L",
    companyName: "Anglesey Mining plc",
    headline: "Placing and fundraising announced to support ongoing project work",
    announcementType: "placing_fundraising",
    rawCategory: "placing_fundraising",
    sourceUrl: "https://www.londonstockexchange.com/news-article/AAL/placing-and-subscription/mock-005",
    publishedAt: "2026-06-02T07:31:00Z",
    rawPayload: {
      headline: "Placing and fundraising announced to support ongoing project work",
      source: "mock LSE RNS",
    },
    ingestionStatus: "parsed",
    createdAt: "2026-06-02T07:31:00Z",
    updatedAt: "2026-06-02T07:31:00Z",
  },
  {
    id: "raw-rns-mock-going-concern-xyz",
    sourceId: "mock-source-lse-rns",
    externalId: "mock-006",
    assetSymbol: "XYZ.L",
    companyName: "Example Resources plc",
    headline: "Going concern warning issued alongside financing uncertainty",
    announcementType: "going_concern_warning",
    rawCategory: "going_concern_warning",
    sourceUrl: "https://www.londonstockexchange.com/news-article/XYZ/going-concern-statement/mock-006",
    publishedAt: "2026-06-02T07:42:00Z",
    rawPayload: {
      headline: "Going concern warning issued alongside financing uncertainty",
      source: "mock LSE RNS",
    },
    ingestionStatus: "parsed",
    createdAt: "2026-06-02T07:42:00Z",
    updatedAt: "2026-06-02T07:42:00Z",
  },
  {
    id: "raw-demo-missing-source",
    sourceId: "mock-source-demo",
    externalId: "demo-007",
    assetSymbol: "DEMO",
    companyName: "Demo Holdings plc",
    headline: "Demo sample evidence without a stored source URL",
    announcementType: "other",
    rawCategory: "demo_sample",
    sourceUrl: null,
    publishedAt: "2026-06-02T08:00:00Z",
    rawPayload: {
      headline: "Demo sample evidence without a stored source URL",
      note: "The mock mode keeps this record intentionally incomplete.",
    },
    ingestionStatus: "parsed",
    createdAt: "2026-06-02T08:00:00Z",
    updatedAt: "2026-06-02T08:00:00Z",
  },
  {
    id: "raw-news-confirm-reuters-rr",
    sourceId: "mock-source-reuters",
    externalId: "reuters-101",
    assetSymbol: "RR.L",
    companyName: "Rolls-Royce Holdings plc",
    headline: "Reuters confirms the market reaction to strong RNS results",
    announcementType: "other",
    rawCategory: "confirming_news",
    sourceUrl: "https://www.reuters.com/markets/example/mock-101",
    publishedAt: "2026-06-02T08:12:00Z",
    rawPayload: {
      headline: "Reuters confirms the market reaction to strong RNS results",
      source: "Reuters Professional News",
    },
    ingestionStatus: "parsed",
    createdAt: "2026-06-02T08:12:00Z",
    updatedAt: "2026-06-02T08:12:00Z",
  },
  {
    id: "raw-aggregator-yahoo-nvda",
    sourceId: "mock-source-yahoo-finance",
    externalId: "yahoo-102",
    assetSymbol: "NVDA",
    companyName: "NVIDIA Corporation",
    headline: "Yahoo Finance summarises the latest price and volume surge",
    announcementType: "other",
    rawCategory: "aggregator_summary",
    sourceUrl: "https://finance.yahoo.com/news/example/mock-102",
    publishedAt: "2026-06-02T08:24:00Z",
    rawPayload: {
      headline: "Yahoo Finance summarises the latest price and volume surge",
      source: "Yahoo Finance Aggregator",
    },
    ingestionStatus: "parsed",
    createdAt: "2026-06-02T08:24:00Z",
    updatedAt: "2026-06-02T08:24:00Z",
  },
  {
    id: "raw-press-globenewswire-pltr",
    sourceId: "mock-source-globenewswire",
    externalId: "press-103",
    assetSymbol: "PLTR",
    companyName: "Palantir Technologies Inc.",
    headline: "GlobeNewswire press release announces a new commercial collaboration",
    announcementType: "other",
    rawCategory: "press_release",
    sourceUrl: "https://www.globenewswire.com/news-release/example/mock-103",
    publishedAt: "2026-06-02T08:36:00Z",
    rawPayload: {
      headline: "GlobeNewswire press release announces a new commercial collaboration",
      source: "GlobeNewswire Press Wire",
    },
    ingestionStatus: "parsed",
    createdAt: "2026-06-02T08:36:00Z",
    updatedAt: "2026-06-02T08:36:00Z",
  },
  {
    id: "raw-social-reddit-spike-nvda",
    sourceId: "mock-source-reddit",
    externalId: "reddit-104",
    assetSymbol: "NVDA",
    companyName: "NVIDIA Corporation",
    headline: "Reddit users discuss a sharp ticker spike after market open",
    announcementType: "other",
    rawCategory: "social_attention",
    sourceUrl: "https://www.reddit.com/r/stocks/comments/mock-104",
    publishedAt: "2026-06-02T08:48:00Z",
    rawPayload: {
      headline: "Reddit users discuss a sharp ticker spike after market open",
      source: "Reddit /r/stocks Discovery",
    },
    ingestionStatus: "parsed",
    createdAt: "2026-06-02T08:48:00Z",
    updatedAt: "2026-06-02T08:48:00Z",
  },
  {
    id: "raw-forum-pump-risk-advfn-xyz",
    sourceId: "mock-source-advfn",
    externalId: "advfn-105",
    assetSymbol: "XYZ.L",
    companyName: "Example Resources plc",
    headline: "ADVFN forum post claims a guaranteed multibagger and insider tip",
    announcementType: "other",
    rawCategory: "pump_risk_warning",
    sourceUrl: "https://www.advfn.com/forum/example/mock-105",
    publishedAt: "2026-06-02T09:00:00Z",
    rawPayload: {
      headline: "ADVFN forum post claims a guaranteed multibagger and insider tip",
      source: "ADVFN / LSE Share Chat",
    },
    ingestionStatus: "parsed",
    createdAt: "2026-06-02T09:00:00Z",
    updatedAt: "2026-06-02T09:00:00Z",
  },
] as const;

export const intelligenceItems = [
  {
    id: "rns-mock-final-results-rr",
    scanRunId: "scan-morning-20260602",
    sourceId: "mock-source-lse-rns",
    rawAnnouncementId: "raw-rns-mock-final-results-rr",
    assetSymbol: "RR.L",
    headline: "Final results show improving cash generation and order visibility",
    summary: "Official final results with improved cash generation and order visibility.",
    classification: "final_results",
    impactDirection: "positive",
    itemType: "result",
    sourceUrl: "https://www.londonstockexchange.com/news-article/RR./final-results/mock-001",
    publishedAt: "2026-06-02T07:05:00Z",
    sourceConfidence: 95,
    verificationStatus: "verified",
    impactScore: 18,
    riskLevel: "medium",
    priority: "watch_today",
    scoringReason: "Official results language appears constructive and worth reviewing.",
    scoredAt: "2026-06-02T07:10:00Z",
    createdAt: "2026-06-02T07:10:00Z",
  },
  {
    id: "rns-mock-trading-update-itm",
    scanRunId: "scan-morning-20260602",
    sourceId: "mock-source-lse-rns",
    rawAnnouncementId: "raw-rns-mock-trading-update-itm",
    assetSymbol: "ITM.L",
    headline: "Trading update highlights a mixed demand picture and revised expectations",
    summary: "Trading update highlighted a mixed demand picture and revised expectations.",
    classification: "trading_update",
    impactDirection: "mixed",
    itemType: "trading_update",
    sourceUrl: "https://www.londonstockexchange.com/news-article/ITM/trading-update/mock-002",
    publishedAt: "2026-06-02T07:12:00Z",
    sourceConfidence: 95,
    verificationStatus: "verified",
    impactScore: -8,
    riskLevel: "high",
    priority: "high_priority_review",
    scoringReason: "Trading update language is mixed and needs context before stronger action.",
    scoredAt: "2026-06-02T07:14:00Z",
    createdAt: "2026-06-02T07:14:00Z",
  },
  {
    id: "rns-mock-director-dealing-barc",
    scanRunId: "scan-morning-20260602",
    sourceId: "mock-source-lse-rns",
    rawAnnouncementId: "raw-rns-mock-director-dealing-barc",
    assetSymbol: "BARC.L",
    headline: "Director dealing discloses a modest open-market purchase",
    summary: "Director dealing disclosed a modest open-market purchase.",
    classification: "director_dealings",
    impactDirection: "positive",
    itemType: "other",
    sourceUrl: "https://www.londonstockexchange.com/news-article/BARC/director-pdmr-shareholding/mock-003",
    publishedAt: "2026-06-02T07:18:00Z",
    sourceConfidence: 95,
    verificationStatus: "verified",
    impactScore: 8,
    riskLevel: "medium",
    priority: "monitor_only",
    scoringReason: "Director purchase language is mildly constructive, but not urgent.",
    scoredAt: "2026-06-02T07:20:00Z",
    createdAt: "2026-06-02T07:20:00Z",
  },
  {
    id: "rns-mock-drill-solg",
    scanRunId: "scan-morning-20260602",
    sourceId: "mock-source-lse-rns",
    rawAnnouncementId: "raw-rns-mock-drill-solg",
    assetSymbol: "SOLG",
    headline: "Drill results report additional mineralisation in a follow-up update",
    summary: "Drill results reported additional mineralisation in a follow-up update.",
    classification: "drill_results",
    impactDirection: "speculative",
    itemType: "filing",
    sourceUrl: "https://www.londonstockexchange.com/news-article/SOLG/drilling-update/mock-004",
    publishedAt: "2026-06-02T07:25:00Z",
    sourceConfidence: 95,
    verificationStatus: "partially_verified",
    impactScore: 22,
    riskLevel: "speculative",
    priority: "speculative_review",
    scoringReason:
      "Official drilling language may be catalytic, but it remains speculative and high risk.",
    scoredAt: "2026-06-02T07:26:00Z",
    createdAt: "2026-06-02T07:26:00Z",
  },
  {
    id: "rns-mock-placing-aal",
    scanRunId: "scan-morning-20260602",
    sourceId: "mock-source-lse-rns",
    rawAnnouncementId: "raw-rns-mock-placing-aal",
    assetSymbol: "AAL.L",
    headline: "Placing and fundraising announced to support ongoing project work",
    summary: "Placing and fundraising announced to support ongoing project work.",
    classification: "placing_fundraising",
    impactDirection: "negative",
    itemType: "filing",
    sourceUrl: "https://www.londonstockexchange.com/news-article/AAL/placing-and-subscription/mock-005",
    publishedAt: "2026-06-02T07:31:00Z",
    sourceConfidence: 95,
    verificationStatus: "verified",
    impactScore: -22,
    riskLevel: "high",
    priority: "high_priority_review",
    scoringReason:
      "Fundraising wording raises dilution and financing risk, so the item needs review.",
    scoredAt: "2026-06-02T07:32:00Z",
    createdAt: "2026-06-02T07:32:00Z",
  },
  {
    id: "rns-mock-going-concern-xyz",
    scanRunId: "scan-morning-20260602",
    sourceId: "mock-source-lse-rns",
    rawAnnouncementId: "raw-rns-mock-going-concern-xyz",
    assetSymbol: "XYZ.L",
    headline: "Going concern warning issued alongside financing uncertainty",
    summary: "Going concern warning issued alongside financing uncertainty.",
    classification: "going_concern_warning",
    impactDirection: "negative",
    itemType: "other",
    sourceUrl: "https://www.londonstockexchange.com/news-article/XYZ/going-concern-statement/mock-006",
    publishedAt: "2026-06-02T07:42:00Z",
    sourceConfidence: 95,
    verificationStatus: "verified",
    impactScore: -40,
    riskLevel: "critical",
    priority: "avoid_or_reassess",
    scoringReason:
      "Going concern language creates critical financing risk and requires reassessment.",
    scoredAt: "2026-06-02T07:43:00Z",
    createdAt: "2026-06-02T07:43:00Z",
  },
  {
    id: "rns-demo-missing-source",
    scanRunId: "scan-evening-20260602",
    sourceId: "mock-source-demo",
    rawAnnouncementId: "raw-demo-missing-source",
    assetSymbol: "DEMO",
    headline: "Demo sample evidence without a stored source URL",
    summary: "Demo/sample evidence — not a live market source.",
    classification: "other",
    impactDirection: "unknown",
    itemType: "other",
    sourceUrl: null,
    publishedAt: "2026-06-02T08:00:00Z",
    sourceConfidence: 40,
    verificationStatus: "unverified",
    impactScore: 0,
    riskLevel: "medium",
    priority: "monitor_only",
    scoringReason:
      "Demo record intentionally has no external source URL so the UI can show unavailable evidence states.",
    scoredAt: "2026-06-02T08:01:00Z",
    createdAt: "2026-06-02T08:01:00Z",
  },
  {
    id: "rns-news-confirm-reuters-rr",
    scanRunId: "scan-evening-20260602",
    sourceId: "mock-source-reuters",
    rawAnnouncementId: "raw-news-confirm-reuters-rr",
    assetSymbol: "RR.L",
    headline: "Reuters confirms the market reaction to strong RNS results",
    summary: "Professional news confirmation of a positive RNS reaction.",
    classification: "final_results",
    signalType: "confirming_news",
    sourceTier: 2,
    weightingMultiplier: 0.8,
    primaryConfirmationRequired: true,
    confirmedByPrimarySource: true,
    rumourFlag: false,
    pumpRiskFlag: false,
    impactDirection: "positive",
    itemType: "other",
    sourceUrl: "https://www.reuters.com/markets/example/mock-101",
    publishedAt: "2026-06-02T08:12:00Z",
    sourceConfidence: 90,
    verificationStatus: "partially_verified",
    impactScore: 14,
    riskLevel: "medium",
    priority: "watch_today",
    scoringReason:
      "Professional news confirms the filing context and supports a review, but it is not the primary evidence source.",
    scoredAt: "2026-06-02T08:13:00Z",
    createdAt: "2026-06-02T08:13:00Z",
  },
  {
    id: "rns-aggregator-yahoo-nvda",
    scanRunId: "scan-evening-20260602",
    sourceId: "mock-source-yahoo-finance",
    rawAnnouncementId: "raw-aggregator-yahoo-nvda",
    assetSymbol: "NVDA",
    headline: "Yahoo Finance summarises the latest price and volume surge",
    summary: "Aggregator summary contextualises the move, but should not dominate the score.",
    classification: "other",
    signalType: "aggregator_summary",
    sourceTier: 3,
    weightingMultiplier: 0.55,
    primaryConfirmationRequired: true,
    confirmedByPrimarySource: false,
    rumourFlag: false,
    pumpRiskFlag: false,
    impactDirection: "neutral",
    itemType: "price_move",
    sourceUrl: "https://finance.yahoo.com/news/example/mock-102",
    publishedAt: "2026-06-02T08:24:00Z",
    sourceConfidence: 70,
    verificationStatus: "unverified",
    impactScore: 4,
    riskLevel: "medium",
    priority: "monitor_only",
    scoringReason:
      "Aggregator context is useful, but primary evidence would be needed before it can drive stronger action.",
    scoredAt: "2026-06-02T08:25:00Z",
    createdAt: "2026-06-02T08:25:00Z",
  },
  {
    id: "rns-press-globenewswire-pltr",
    scanRunId: "scan-evening-20260602",
    sourceId: "mock-source-globenewswire",
    rawAnnouncementId: "raw-press-globenewswire-pltr",
    assetSymbol: "PLTR",
    headline: "GlobeNewswire press release announces a new commercial collaboration",
    summary: "Press release is review-worthy but remains company-authored distribution.",
    classification: "other",
    signalType: "press_release",
    sourceTier: 4,
    weightingMultiplier: 0.35,
    primaryConfirmationRequired: true,
    confirmedByPrimarySource: false,
    rumourFlag: false,
    pumpRiskFlag: false,
    impactDirection: "positive",
    itemType: "other",
    sourceUrl: "https://www.globenewswire.com/news-release/example/mock-103",
    publishedAt: "2026-06-02T08:36:00Z",
    sourceConfidence: 78,
    verificationStatus: "unverified",
    impactScore: 8,
    riskLevel: "medium",
    priority: "watch_today",
    scoringReason:
      "Press-wire distribution may be useful for review, but it should not be treated as independent proof.",
    scoredAt: "2026-06-02T08:37:00Z",
    createdAt: "2026-06-02T08:37:00Z",
  },
  {
    id: "rns-social-reddit-spike-nvda",
    scanRunId: "scan-evening-20260602",
    sourceId: "mock-source-reddit",
    rawAnnouncementId: "raw-social-reddit-spike-nvda",
    assetSymbol: "NVDA",
    headline: "Reddit users discuss a sharp ticker spike after market open",
    summary: "Discovery-only social chatter identifies attention, but not verified evidence.",
    classification: "other",
    signalType: "social_attention",
    sourceTier: 5,
    weightingMultiplier: 0.15,
    primaryConfirmationRequired: true,
    confirmedByPrimarySource: false,
    rumourFlag: false,
    pumpRiskFlag: false,
    impactDirection: "unknown",
    itemType: "price_move",
    sourceUrl: "https://www.reddit.com/r/stocks/comments/mock-104",
    publishedAt: "2026-06-02T08:48:00Z",
    sourceConfidence: 35,
    verificationStatus: "unverified",
    impactScore: 0,
    riskLevel: "speculative",
    priority: "monitor_only",
    scoringReason:
      "Social chatter can help discovery, but primary evidence is required before it changes the thesis.",
    scoredAt: "2026-06-02T08:49:00Z",
    createdAt: "2026-06-02T08:49:00Z",
  },
  {
    id: "rns-forum-pump-risk-advfn-xyz",
    scanRunId: "scan-evening-20260602",
    sourceId: "mock-source-advfn",
    rawAnnouncementId: "raw-forum-pump-risk-advfn-xyz",
    assetSymbol: "XYZ.L",
    headline: "ADVFN forum post claims a guaranteed multibagger and insider tip",
    summary: "Pump-risk forum language should reduce confidence and trigger caution.",
    classification: "other",
    signalType: "pump_risk_warning",
    sourceTier: 5,
    weightingMultiplier: 0.15,
    primaryConfirmationRequired: true,
    confirmedByPrimarySource: false,
    rumourFlag: true,
    pumpRiskFlag: true,
    impactDirection: "negative",
    itemType: "other",
    sourceUrl: "https://www.advfn.com/forum/example/mock-105",
    publishedAt: "2026-06-02T09:00:00Z",
    sourceConfidence: 30,
    verificationStatus: "unverified",
    impactScore: -4,
    riskLevel: "high",
    priority: "watch_today",
    scoringReason:
      "Guaranteed-return and insider-tip language is pump-risk noise, not evidence, so confidence should stay low.",
    scoredAt: "2026-06-02T09:01:00Z",
    createdAt: "2026-06-02T09:01:00Z",
  },
] as const;

export const settingsGuardrails = [
  "Decision support only, not financial advice.",
  "No automated trading or broker integration in Phase 1.",
  "No guarantee language, no hype, no rushed action prompts.",
  "Trade journal entries require reason, risk amount, stop-loss idea, and review date.",
  "Default beginner mode keeps the risk bucket intentionally small.",
] as const;

export const disclaimer =
  "Trader AI is a personal research and journaling tool. It is not financial advice. It does not place trades and does not guarantee returns.";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 2,
  }).format(value);
}
