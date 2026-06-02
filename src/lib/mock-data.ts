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
] as const;

export const intelligenceSources = [
  {
    id: "mock-source-lse-rns",
    name: "London Stock Exchange RNS",
    sourceType: "rns",
    baseUrl: "https://www.londonstockexchange.com/news",
    confidenceScore: 95,
    isActive: true,
    notes: "Official announcement feed used for demo and fallback records.",
    createdAt: "2026-06-02T07:00:00Z",
  },
  {
    id: "mock-source-demo",
    name: "Demo sample evidence",
    sourceType: "other",
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
    notes: "High-confidence future source class for US disclosures.",
    createdAt: "2026-06-11T00:00:00Z",
    updatedAt: "2026-06-11T00:00:00Z",
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
