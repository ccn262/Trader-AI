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
  label: "Morning Scan" | "Evening Scan";
  title: string;
  summary: string;
  bullets: string[];
  status: "Completed" | "Running" | "Pending" | "Failed";
  marketHealthScore: number;
};

export type OpportunityAlert = {
  id: string;
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
    | "Speculative review";
  sourceConfidence: string;
  sourceConfidenceScore: number;
  riskLevel: "Low" | "Medium" | "High" | "Speculative";
  suggestedPositionRange: string;
  suggestedHoldTimeframe: string;
  exitPlan: string;
  riskWarning: string;
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
  },
] as const;

export const opportunityAlerts: OpportunityAlert[] = [
  {
    id: "opp-vwrp-20260602-morning",
    symbol: "VWRP",
    name: "Vanguard FTSE All-World UCITS ETF",
    market: "LSE",
    opportunityType: "Long-term investment",
    catalystSummary:
      "Broad global exposure remains aligned with the core long-term allocation plan.",
    score: 84,
    priority: "High-priority review",
    sourceConfidence: "High",
    sourceConfidenceScore: 92,
    riskLevel: "Low",
    suggestedPositionRange: "£10-£20",
    suggestedHoldTimeframe: "Weeks to months",
    exitPlan: "Reassess if allocation drifts or the thesis changes materially.",
    riskWarning:
      "Market risk remains present even when the thesis is simple.",
    evidencePlaceholders: [
      "ETF composition placeholder",
      "Market breadth placeholder",
      "Allocation review placeholder",
    ],
    filterTags: ["High-priority review", "Long-term"],
    scan: "Morning",
  },
  {
    id: "opp-msft-20260602-morning",
    symbol: "MSFT",
    name: "Microsoft Corporation",
    market: "NASDAQ",
    opportunityType: "Earnings momentum",
    catalystSummary:
      "Earnings and guidance context may justify a fresh review of the current setup.",
    score: 79,
    priority: "High-priority review",
    sourceConfidence: "Medium-high",
    sourceConfidenceScore: 88,
    riskLevel: "Medium",
    suggestedPositionRange: "£5-£15",
    suggestedHoldTimeframe: "Days to weeks",
    exitPlan: "Reassess after earnings follow-through or if momentum fades.",
    riskWarning:
      "Post-earnings moves can reverse quickly if the market disagrees.",
    evidencePlaceholders: [
      "Earnings transcript placeholder",
      "Guidance revision placeholder",
      "Relative strength placeholder",
    ],
    filterTags: ["High-priority review", "Watch today", "Swing trades"],
    scan: "Morning",
  },
  {
    id: "opp-nvda-20260602-evening",
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    market: "NASDAQ",
    opportunityType: "Swing trade",
    catalystSummary:
      "High momentum and active sector attention create a review-worthy setup.",
    score: 74,
    priority: "Watch today",
    sourceConfidence: "Medium",
    sourceConfidenceScore: 76,
    riskLevel: "High",
    suggestedPositionRange: "£5-£10",
    suggestedHoldTimeframe: "Days to weeks",
    exitPlan: "Reassess if volume weakens or the trend structure breaks.",
    riskWarning:
      "Volatility is elevated and position sizing should stay disciplined.",
    evidencePlaceholders: [
      "Price action placeholder",
      "Volume confirmation placeholder",
      "News catalyst placeholder",
    ],
    filterTags: ["Watch today", "Swing trades"],
    scan: "Evening",
  },
  {
    id: "opp-rrl-20260602-evening",
    symbol: "RR.L",
    name: "Rolls-Royce Holdings plc",
    market: "LSE",
    opportunityType: "Special situation",
    catalystSummary:
      "Event-driven interest warrants a structured review rather than a rushed decision.",
    score: 67,
    priority: "Monitor only",
    sourceConfidence: "Medium",
    sourceConfidenceScore: 72,
    riskLevel: "Medium",
    suggestedPositionRange: "£5-£10",
    suggestedHoldTimeframe: "Event window",
    exitPlan: "Reassess after the catalyst or if the event thesis loses support.",
    riskWarning:
      "Headline risk and event risk can move faster than the thesis.",
    evidencePlaceholders: [
      "RNS placeholder",
      "Event calendar placeholder",
      "Company update placeholder",
    ],
    filterTags: ["Monitor only"],
    scan: "Evening",
  },
  {
    id: "opp-solg-20260602-morning",
    symbol: "SOLG",
    name: "SolGold plc",
    market: "AIM",
    opportunityType: "Mining/resource catalyst",
    catalystSummary:
      "Fresh drilling commentary and financing context create a speculative review candidate, not an execution prompt.",
    score: 49,
    priority: "Speculative review",
    sourceConfidence: "Low-medium",
    sourceConfidenceScore: 44,
    riskLevel: "Speculative",
    suggestedPositionRange: "£1-£3",
    suggestedHoldTimeframe: "Catalyst window only",
    exitPlan: "Reassess if follow-up RNS detail is weak or funding risk rises.",
    riskWarning:
      "Thin liquidity, financing risk, and headline volatility make this unsuitable for oversized positions.",
    evidencePlaceholders: [
      "RNS drill result placeholder",
      "Commodity trend placeholder",
      "Funding risk placeholder",
    ],
    filterTags: ["Penny shares"],
    scan: "Morning",
  },
  {
    id: "opp-xlk-20260602-evening",
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
    evidencePlaceholders: [
      "Relative strength placeholder",
      "ETF flow placeholder",
      "Sector breadth placeholder",
    ],
    filterTags: ["Monitor only", "Long-term"],
    scan: "Evening",
  },
  {
    id: "opp-pltr-20260602-morning",
    symbol: "PLTR",
    name: "Palantir Technologies Inc.",
    market: "NYSE",
    opportunityType: "Penny share catalyst",
    catalystSummary:
      "Narrative-driven interest is present, but evidence quality must remain tight.",
    score: 46,
    priority: "Speculative review",
    sourceConfidence: "Low-medium",
    sourceConfidenceScore: 42,
    riskLevel: "Speculative",
    suggestedPositionRange: "£1-£5",
    suggestedHoldTimeframe: "Short review cycle",
    exitPlan: "Reassess quickly if the catalyst does not earn confirmation.",
    riskWarning:
      "Volatility and narrative risk remain high for smaller accounts.",
    evidencePlaceholders: [
      "Social sentiment placeholder",
      "News catalyst placeholder",
      "Liquidity placeholder",
    ],
    filterTags: ["Penny shares", "Watch today"],
    scan: "Morning",
  },
] as const;

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
