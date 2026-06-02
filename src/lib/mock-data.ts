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
