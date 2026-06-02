import "server-only";

import { getSupabaseClient, hasSupabaseConfig } from "./supabase/server";
import type {
  AiScoreRow,
  AlertRow,
  AppSettingsRow,
  AssetRow,
  PortfolioPositionRow,
  TradeJournalRow,
  WatchlistRow,
} from "./supabase/types";
import {
  alerts as mockAlerts,
  dashboardScores as mockDashboardScores,
  disclaimer as mockDisclaimer,
  formatCurrency,
  journalEntries as mockJournalEntries,
  portfolioPositions as mockPortfolioPositions,
  quickActions,
  summaryCards,
  watchlists as mockWatchlists,
} from "./mock-data";

export type DashboardScoreCard = {
  ticker: string;
  name: string;
  score: number;
  status: "Watch" | "Wait" | "Avoid";
  review: string;
};

export type WatchlistViewModel = {
  id: string;
  name: string;
  description: string;
  riskProfile: "low" | "medium" | "high" | "speculative";
  assetCount: number;
  averageScore: number;
  lastReviewed: string;
  highlights: string[];
  archivedAt?: string | null;
};

export type PortfolioViewModel = {
  id: string;
  assetId: string;
  ticker: string;
  name: string;
  strategy: "core" | "swing" | "learning";
  accountType: "ISA" | "Invest" | "Other";
  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;
  targetAllocation: number;
  notes: string;
  archivedAt?: string | null;
};

export type JournalViewModel = {
  id: string;
  assetId: string;
  ticker: string;
  action: "Buy" | "Add" | "Trim" | "Sell" | "Paper trade" | "Avoid";
  amount: string;
  thesisReason: string;
  riskNotes: string;
  riskAmount: string;
  stopLossIdea: string;
  reviewDate: string;
  manualExecutionConfirmed: boolean;
  emotionBefore: string;
  lesson: string;
  archivedAt?: string | null;
};

export type AlertViewModel = {
  id: string;
  assetId: string | null;
  title: string;
  asset: string;
  type: string;
  action: string;
  due: string;
  reviewedAt?: string | null;
  archivedAt?: string | null;
};

export type SettingsViewModel = {
  decisionSupportOnly: boolean;
  riskMode: "beginner" | "standard" | "custom";
  baseCurrency: string;
  disclaimer: string;
};

export type AssetViewModel = {
  id: string;
  watchlistId: string | null;
  symbol: string;
  name: string;
  assetType: string;
  watchlistName: string;
  status: string;
  notes: string;
  archivedAt?: string | null;
};

export type AssetDetailViewModel = {
  id: string;
  symbol: string;
  name: string;
  assetType: string;
  currency: string;
  market: string;
  riskLevel: string;
  status: string;
  notes: string;
  watchlistName: string;
  watchlistStatus: string;
  positionStatus: string;
  aiScore: number | null;
  aiLabel: string | null;
  journalEntries: JournalViewModel[];
  alerts: AlertViewModel[];
  archivedAt?: string | null;
};

export type DashboardViewModel = {
  summaryCards: ReadonlyArray<{
    label: string;
    value: string;
    detail: string;
  }>;
  quickActions: ReadonlyArray<string>;
  scores: ReadonlyArray<DashboardScoreCard>;
  alerts: ReadonlyArray<AlertViewModel>;
  journalHighlights: {
    title: string;
    body: string;
  }[];
  disclaimer: string;
};

function formatReviewDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function mapWatchlist(row: WatchlistRow, assets: AssetRow[]): WatchlistViewModel {
  const watchlistAssets = assets.filter((asset) => asset.watchlist_id === row.id);
  const scoreSeed = watchlistAssets.length ? 60 + watchlistAssets.length * 3 : 55;

  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    riskProfile: row.risk_profile,
    assetCount: watchlistAssets.length,
    averageScore: scoreSeed,
    lastReviewed: new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(row.updated_at)),
    highlights: watchlistAssets.map((asset) => asset.ticker),
    archivedAt: row.archived_at,
  };
}

function mapPortfolioPosition(
  row: PortfolioPositionRow,
  assets: AssetRow[],
): PortfolioViewModel {
  const asset = assets.find((item) => item.id === row.asset_id);

  return {
    id: row.id,
    assetId: row.asset_id,
    ticker: asset?.ticker ?? "UNKNOWN",
    name: asset?.name ?? "Unknown asset",
    strategy: row.strategy,
    accountType:
      row.account_type === "isa"
        ? "ISA"
        : row.account_type === "invest"
          ? "Invest"
          : "Other",
    quantity: Number(row.quantity),
    averageBuyPrice: Number(row.average_buy_price),
    currentPrice: Number(row.current_price),
    targetAllocation: Number(row.target_allocation),
    notes: row.notes ?? "",
    archivedAt: row.archived_at,
  };
}

function mapJournalRow(
  row: TradeJournalRow,
  assets: AssetRow[],
): JournalViewModel {
  const asset = assets.find((item) => item.id === row.asset_id);

  return {
    id: row.id,
    assetId: row.asset_id,
    ticker: asset?.ticker ?? "UNKNOWN",
    action:
      row.action === "paper_trade"
        ? "Paper trade"
        : row.action === "add"
          ? "Add"
          : row.action === "buy"
            ? "Buy"
            : row.action === "sell"
              ? "Sell"
              : row.action === "trim"
                ? "Trim"
                : "Avoid",
    amount: `£${Number(row.amount).toFixed(0)}`,
    thesisReason: row.thesis_reason,
    riskNotes: row.risk_notes,
    riskAmount: `£${Number(row.risk_amount ?? 0).toFixed(0)}`,
    stopLossIdea: row.stop_loss_idea,
    reviewDate: row.review_date,
    manualExecutionConfirmed: row.manual_execution_confirmed,
    emotionBefore: row.emotion_before ?? "",
    lesson: row.lesson_learned ?? "",
    archivedAt: row.archived_at,
  };
}

function mapAlertRow(row: AlertRow, assets: AssetRow[]): AlertViewModel {
  const asset = row.asset_id
    ? assets.find((item) => item.id === row.asset_id)?.ticker ?? "Portfolio"
    : "Portfolio";

  return {
    id: row.id,
    assetId: row.asset_id,
    title: row.message,
    asset,
    type:
      row.alert_type === "price_above"
        ? "Price above"
        : row.alert_type === "price_below"
          ? "Price below"
          : row.alert_type === "score_above"
            ? "Score above threshold"
            : row.alert_type === "review_due"
              ? "Review due"
              : row.alert_type === "news"
                ? "News catalyst"
                : row.alert_type === "earnings"
                  ? "Earnings date"
                  : "Manual reminder",
    action: row.message,
    due: row.due_at
      ? formatReviewDate(row.due_at)
      : row.created_at
        ? "Today"
        : "Today",
    reviewedAt: row.reviewed_at,
    archivedAt: row.archived_at,
  };
}

function mapScoreRow(row: AiScoreRow, assets: AssetRow[]): DashboardScoreCard {
  const asset = assets.find((item) => item.id === row.asset_id);

  return {
    ticker: asset?.ticker ?? "UNKNOWN",
    name: asset?.name ?? "Unknown asset",
    score: Number(row.total_score),
    status:
      Number(row.total_score) >= 80
        ? "Watch"
        : Number(row.total_score) >= 45
          ? "Wait"
          : "Avoid",
    review: formatReviewDate(row.review_date),
  };
}

function mapAssetRow(row: AssetRow, watchlists: WatchlistRow[]): AssetViewModel {
  const watchlist = row.watchlist_id
    ? watchlists.find((item) => item.id === row.watchlist_id)
    : null;

  return {
    id: row.id,
    watchlistId: row.watchlist_id,
    symbol: row.ticker,
    name: row.name,
    assetType: row.asset_type,
    watchlistName: watchlist?.name ?? "Unassigned",
    status: row.status,
    notes: row.notes ?? "",
    archivedAt: row.archived_at,
  };
}

function getFallbackAssetDetail(symbol: string): AssetDetailViewModel | null {
  const normalizedSymbol = symbol.toUpperCase();
  const assetCatalog: Record<
    string,
    {
      name: string;
      assetType: string;
      currency: string;
      market: string;
      riskLevel: string;
      status: string;
      watchlistName: string;
      notes: string;
    }
  > = {
    VWRP: {
      name: "Vanguard FTSE All-World UCITS ETF",
      assetType: "etf",
      currency: "GBP",
      market: "London",
      riskLevel: "low",
      status: "watch",
      watchlistName: "Core ETFs",
      notes: "Core holding for the starter portfolio.",
    },
    MSFT: {
      name: "Microsoft Corporation",
      assetType: "stock",
      currency: "USD",
      market: "NASDAQ",
      riskLevel: "medium",
      status: "watch",
      watchlistName: "US Stocks",
      notes: "Small starter position.",
    },
    NVDA: {
      name: "NVIDIA Corporation",
      assetType: "stock",
      currency: "USD",
      market: "NASDAQ",
      riskLevel: "high",
      status: "watch",
      watchlistName: "AI & Technology",
      notes: "High momentum watchlist item.",
    },
    "RR.L": {
      name: "Rolls-Royce Holdings plc",
      assetType: "stock",
      currency: "GBP",
      market: "London",
      riskLevel: "medium",
      status: "watch",
      watchlistName: "UK Stocks",
      notes: "UK watchlist item.",
    },
    PLTR: {
      name: "Palantir Technologies Inc.",
      assetType: "stock",
      currency: "USD",
      market: "NASDAQ",
      riskLevel: "speculative",
      status: "watch",
      watchlistName: "AI & Technology",
      notes: "Speculative learning-only idea.",
    },
    CASH: {
      name: "Cash",
      assetType: "cash",
      currency: "GBP",
      market: "N/A",
      riskLevel: "low",
      status: "hold",
      watchlistName: "Unassigned",
      notes: "Manual cash balance.",
    },
  };

  const catalogItem = assetCatalog[normalizedSymbol];
  const score = mockDashboardScores.find((entry) => entry.ticker === normalizedSymbol);
  const portfolio = mockPortfolioPositions.find((entry) => entry.ticker === normalizedSymbol);
  const watchlist =
    mockWatchlists.find((entry) => entry.highlights.includes(normalizedSymbol)) ??
    mockWatchlists[0];
  const journalEntries = mockJournalEntries
    .filter((entry) => entry.ticker === normalizedSymbol)
    .map((entry, index) => ({
      id: `mock-journal-${normalizedSymbol}-${index}`,
      assetId: `mock-asset-${normalizedSymbol}`,
      ticker: entry.ticker,
      action: entry.action,
      amount: entry.amount,
      thesisReason: entry.reason,
      riskNotes: entry.stopLossIdea,
      riskAmount: entry.riskAmount,
      stopLossIdea: entry.stopLossIdea,
      reviewDate: entry.reviewDate,
      manualExecutionConfirmed: true,
      emotionBefore: entry.emotionBefore,
      lesson: entry.lesson,
      archivedAt: null,
    }));
  const alerts = mockAlerts
    .filter((entry) => entry.asset === normalizedSymbol)
    .map((entry, index) => ({
      id: `mock-alert-${normalizedSymbol}-${index}`,
      assetId: `mock-asset-${normalizedSymbol}`,
      title: entry.title,
      asset: entry.asset,
      type: entry.type,
      action: entry.action,
      due: entry.due,
      reviewedAt: null,
      archivedAt: null,
    }));

  if (!catalogItem && !score && !portfolio) {
    return null;
  }

  return {
    id: `mock-asset-${normalizedSymbol}`,
    symbol: normalizedSymbol,
    name: catalogItem?.name ?? portfolio?.name ?? normalizedSymbol,
    assetType: catalogItem?.assetType ?? (portfolio ? "stock" : "etf"),
    currency: catalogItem?.currency ?? (portfolio?.accountType === "ISA" ? "GBP" : "USD"),
    market: catalogItem?.market ?? (normalizedSymbol.endsWith(".L") ? "London" : "US"),
    riskLevel: catalogItem?.riskLevel ?? "medium",
    status: catalogItem?.status ?? score?.status ?? "watch",
    notes: catalogItem?.notes ?? portfolio?.notes ?? "",
    watchlistName: catalogItem?.watchlistName ?? watchlist.name,
    watchlistStatus: catalogItem?.status ?? score?.status ?? "watch",
    positionStatus: portfolio ? "Recorded position" : "No position",
    aiScore: score?.score ?? null,
    aiLabel: score?.status ?? null,
    journalEntries,
    alerts,
    archivedAt: null,
  };
}

async function readAppSettings(): Promise<SettingsViewModel> {
  if (!hasSupabaseConfig()) {
    return {
      decisionSupportOnly: true,
      riskMode: "beginner",
      baseCurrency: "GBP",
      disclaimer: mockDisclaimer,
    };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      decisionSupportOnly: true,
      riskMode: "beginner",
      baseCurrency: "GBP",
      disclaimer: mockDisclaimer,
    };
  }

  const { data } = await supabase
    .from("app_settings")
    .select("*")
    .eq("setting_key", "global")
    .maybeSingle();

  if (!data) {
    return {
      decisionSupportOnly: true,
      riskMode: "beginner",
      baseCurrency: "GBP",
      disclaimer: mockDisclaimer,
    };
  }

  const settingsRow = data as AppSettingsRow;

  return {
    decisionSupportOnly: settingsRow.decision_support_only,
    riskMode: settingsRow.risk_mode,
    baseCurrency: settingsRow.base_currency,
    disclaimer: settingsRow.disclaimer,
  };
}

export async function getDashboardData(): Promise<DashboardViewModel> {
  const settings = await readAppSettings();

  if (!hasSupabaseConfig()) {
    return {
      summaryCards,
      quickActions,
      scores: mockDashboardScores,
      alerts: mockAlerts.map((entry, index) => ({
        id: `mock-alert-${index}`,
        assetId: null,
        title: entry.title,
        asset: entry.asset,
        type: entry.type,
        action: entry.action,
        due: entry.due,
        reviewedAt: null,
        archivedAt: null,
      })),
      journalHighlights: mockJournalEntries.map((entry) => ({
        title: `${entry.ticker} · ${entry.action}`,
        body: `${entry.reason} Review date: ${entry.reviewDate}.`,
      })),
      disclaimer: settings.disclaimer,
    };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      summaryCards,
      quickActions,
      scores: mockDashboardScores,
      alerts: mockAlerts.map((entry, index) => ({
        id: `mock-alert-${index}`,
        assetId: null,
        title: entry.title,
        asset: entry.asset,
        type: entry.type,
        action: entry.action,
        due: entry.due,
        reviewedAt: null,
        archivedAt: null,
      })),
      journalHighlights: mockJournalEntries.map((entry) => ({
        title: `${entry.ticker} · ${entry.action}`,
        body: `${entry.reason} Review date: ${entry.reviewDate}.`,
      })),
      disclaimer: settings.disclaimer,
    };
  }

  const [
    { data: assets = [] },
    { data: positions = [] },
    { data: alerts = [] },
    { data: journals = [] },
    { data: scores = [] },
  ] = await Promise.all([
    supabase.from("assets").select("*"),
    supabase.from("portfolio_positions").select("*"),
    supabase.from("alerts").select("*").eq("is_active", true),
    supabase.from("trade_journal").select("*").order("created_at", { ascending: false }).limit(3),
    supabase.from("ai_scores").select("*").order("total_score", { ascending: false }).limit(4),
  ]);

  const assetRows = (assets ?? []) as AssetRow[];
  const positionRows = (positions ?? []) as PortfolioPositionRow[];
  const alertRows = (alerts ?? []) as AlertRow[];
  const journalRows = (journals ?? []) as TradeJournalRow[];
  const scoreRows = (scores ?? []) as AiScoreRow[];

  const portfolioValue = positionRows.reduce((sum, row) => {
    const value = Number(row.quantity) * Number(row.current_price);
    return sum + value;
  }, 0);
  const cash = positionRows
    .filter((position) => {
      const asset = assetRows.find((item) => item.id === position.asset_id);
      return asset?.asset_type === "cash" || asset?.ticker === "CASH";
    })
    .reduce((sum, row) => sum + Number(row.current_price) * Number(row.quantity), 0);
  const etfValue = positionRows
    .filter((position) => {
      const asset = assetRows.find((item) => item.id === position.asset_id);
      return asset?.asset_type === "etf";
    })
    .reduce((sum, row) => sum + Number(row.current_price) * Number(row.quantity), 0);
  const etfAllocation = portfolioValue > 0 ? Math.round((etfValue / portfolioValue) * 100) : 0;

  return {
    summaryCards: [
      { label: "Portfolio value", value: formatCurrency(portfolioValue), detail: "Live from Supabase or seed data" },
      { label: "Cash available", value: formatCurrency(cash), detail: "Tracked manually in the portfolio table" },
      { label: "ETF allocation", value: `${etfAllocation}%`, detail: "Core allocation keeps the beginner risk box calm" },
      { label: "Alerts due", value: `${alertRows.length}`, detail: "Review before action" },
    ] as const,
    quickActions,
    scores: scoreRows.map((row) => mapScoreRow(row, assetRows)),
    alerts: alertRows.map((row) => mapAlertRow(row, assetRows)),
    journalHighlights: journalRows.map((row) => {
      const entry = mapJournalRow(row, assetRows);
      return {
        title: `${entry.ticker} · ${entry.action}`,
        body: `${entry.thesisReason} Review date: ${entry.reviewDate}.`,
      };
    }),
    disclaimer: settings.disclaimer,
  };
}

export async function getWatchlists(): Promise<WatchlistViewModel[]> {
  if (!hasSupabaseConfig()) {
    return mockWatchlists.map((watchlist, index) => ({
      id: `mock-watchlist-${index}`,
      name: watchlist.name,
      description: watchlist.description,
      riskProfile: watchlist.riskProfile,
      assetCount: watchlist.assetCount,
      averageScore: watchlist.averageScore,
      lastReviewed: watchlist.lastReviewed,
      highlights: watchlist.highlights,
      archivedAt: null,
    }));
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return mockWatchlists.map((watchlist, index) => ({
      id: `mock-watchlist-${index}`,
      name: watchlist.name,
      description: watchlist.description,
      riskProfile: watchlist.riskProfile,
      assetCount: watchlist.assetCount,
      averageScore: watchlist.averageScore,
      lastReviewed: watchlist.lastReviewed,
      highlights: watchlist.highlights,
      archivedAt: null,
    }));
  }

  const [{ data: watchlists = [] }, { data: assets = [] }] = await Promise.all([
    supabase.from("watchlists").select("*").order("created_at", { ascending: true }),
    supabase.from("assets").select("*"),
  ]);

  const watchlistRows = (watchlists ?? []) as WatchlistRow[];
  const assetRows = (assets ?? []) as AssetRow[];

  if (!watchlistRows.length) {
    return mockWatchlists.map((watchlist, index) => ({
      id: `mock-watchlist-${index}`,
      name: watchlist.name,
      description: watchlist.description,
      riskProfile: watchlist.riskProfile,
      assetCount: watchlist.assetCount,
      averageScore: watchlist.averageScore,
      lastReviewed: watchlist.lastReviewed,
      highlights: watchlist.highlights,
      archivedAt: null,
    }));
  }

  return watchlistRows.map((row) => mapWatchlist(row, assetRows));
}

export async function getPortfolioPositions(): Promise<PortfolioViewModel[]> {
  if (!hasSupabaseConfig()) {
    return mockPortfolioPositions.map((position, index) => ({
      id: `mock-position-${index}`,
      assetId: `mock-asset-${position.ticker}`,
      ticker: position.ticker,
      name: position.name,
      strategy: position.strategy,
      accountType: position.accountType,
      quantity: position.quantity,
      averageBuyPrice: position.averageBuyPrice,
      currentPrice: position.currentPrice,
      targetAllocation: position.targetAllocation,
      notes: position.notes,
      archivedAt: null,
    }));
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return mockPortfolioPositions.map((position, index) => ({
      id: `mock-position-${index}`,
      assetId: `mock-asset-${position.ticker}`,
      ticker: position.ticker,
      name: position.name,
      strategy: position.strategy,
      accountType: position.accountType,
      quantity: position.quantity,
      averageBuyPrice: position.averageBuyPrice,
      currentPrice: position.currentPrice,
      targetAllocation: position.targetAllocation,
      notes: position.notes,
      archivedAt: null,
    }));
  }

  const [{ data: positions = [] }, { data: assets = [] }] = await Promise.all([
    supabase.from("portfolio_positions").select("*").order("created_at", { ascending: true }),
    supabase.from("assets").select("*"),
  ]);

  const positionRows = (positions ?? []) as PortfolioPositionRow[];
  const assetRows = (assets ?? []) as AssetRow[];

  if (!positionRows.length) {
    return mockPortfolioPositions.map((position, index) => ({
      id: `mock-position-${index}`,
      assetId: `mock-asset-${position.ticker}`,
      ticker: position.ticker,
      name: position.name,
      strategy: position.strategy,
      accountType: position.accountType,
      quantity: position.quantity,
      averageBuyPrice: position.averageBuyPrice,
      currentPrice: position.currentPrice,
      targetAllocation: position.targetAllocation,
      notes: position.notes,
      archivedAt: null,
    }));
  }

  return positionRows.map((row) => mapPortfolioPosition(row, assetRows));
}

export async function getJournalEntries(): Promise<JournalViewModel[]> {
  if (!hasSupabaseConfig()) {
    return mockJournalEntries.map((entry, index) => ({
      id: `mock-journal-${index}`,
      assetId: `mock-asset-${entry.ticker}`,
      ticker: entry.ticker,
      action: entry.action,
      amount: entry.amount,
      thesisReason: entry.reason,
      riskNotes: entry.stopLossIdea,
      riskAmount: entry.riskAmount,
      stopLossIdea: entry.stopLossIdea,
      reviewDate: entry.reviewDate,
      manualExecutionConfirmed: true,
      emotionBefore: entry.emotionBefore,
      lesson: entry.lesson,
      archivedAt: null,
    }));
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return mockJournalEntries.map((entry, index) => ({
      id: `mock-journal-${index}`,
      assetId: `mock-asset-${entry.ticker}`,
      ticker: entry.ticker,
      action: entry.action,
      amount: entry.amount,
      thesisReason: entry.reason,
      riskNotes: entry.stopLossIdea,
      riskAmount: entry.riskAmount,
      stopLossIdea: entry.stopLossIdea,
      reviewDate: entry.reviewDate,
      manualExecutionConfirmed: true,
      emotionBefore: entry.emotionBefore,
      lesson: entry.lesson,
      archivedAt: null,
    }));
  }

  const [{ data: journals = [] }, { data: assets = [] }] = await Promise.all([
    supabase.from("trade_journal").select("*").order("created_at", { ascending: false }).limit(10),
    supabase.from("assets").select("*"),
  ]);

  const journalRows = (journals ?? []) as TradeJournalRow[];
  const assetRows = (assets ?? []) as AssetRow[];

  if (!journalRows.length) {
    return mockJournalEntries.map((entry, index) => ({
      id: `mock-journal-${index}`,
      assetId: `mock-asset-${entry.ticker}`,
      ticker: entry.ticker,
      action: entry.action,
      amount: entry.amount,
      thesisReason: entry.reason,
      riskNotes: entry.stopLossIdea,
      riskAmount: entry.riskAmount,
      stopLossIdea: entry.stopLossIdea,
      reviewDate: entry.reviewDate,
      manualExecutionConfirmed: true,
      emotionBefore: entry.emotionBefore,
      lesson: entry.lesson,
      archivedAt: null,
    }));
  }

  return journalRows.map((row) => mapJournalRow(row, assetRows));
}

export async function getAlerts(): Promise<AlertViewModel[]> {
  if (!hasSupabaseConfig()) {
    return mockAlerts.map((entry, index) => ({
      id: `mock-alert-${index}`,
      assetId: null,
      title: entry.title,
      asset: entry.asset,
      type: entry.type,
      action: entry.action,
      due: entry.due,
      reviewedAt: null,
      archivedAt: null,
    }));
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return mockAlerts.map((entry, index) => ({
      id: `mock-alert-${index}`,
      assetId: null,
      title: entry.title,
      asset: entry.asset,
      type: entry.type,
      action: entry.action,
      due: entry.due,
      reviewedAt: null,
      archivedAt: null,
    }));
  }

  const [{ data: alerts = [] }, { data: assets = [] }] = await Promise.all([
    supabase.from("alerts").select("*").eq("is_active", true).order("created_at", { ascending: false }),
    supabase.from("assets").select("*"),
  ]);

  const alertRows = (alerts ?? []) as AlertRow[];
  const assetRows = (assets ?? []) as AssetRow[];

  if (!alertRows.length) {
    return mockAlerts.map((entry, index) => ({
      id: `mock-alert-${index}`,
      assetId: null,
      title: entry.title,
      asset: entry.asset,
      type: entry.type,
      action: entry.action,
      due: entry.due,
      reviewedAt: null,
      archivedAt: null,
    }));
  }

  return alertRows.map((row) => mapAlertRow(row, assetRows));
}

export async function getSettings(): Promise<SettingsViewModel> {
  return readAppSettings();
}

export async function getAssets(): Promise<AssetViewModel[]> {
  if (!hasSupabaseConfig()) {
    return [
      {
        id: "mock-asset-VWRP",
        watchlistId: "mock-watchlist-Core ETFs",
        symbol: "VWRP",
        name: "Vanguard FTSE All-World UCITS ETF",
        assetType: "etf",
        watchlistName: "Core ETFs",
        status: "watch",
        notes: "Core holding for the starter portfolio.",
        archivedAt: null,
      },
      {
        id: "mock-asset-MSFT",
        watchlistId: "mock-watchlist-US Stocks",
        symbol: "MSFT",
        name: "Microsoft Corporation",
        assetType: "stock",
        watchlistName: "US Stocks",
        status: "watch",
        notes: "Small starter position.",
        archivedAt: null,
      },
      {
        id: "mock-asset-NVDA",
        watchlistId: "mock-watchlist-AI & Technology",
        symbol: "NVDA",
        name: "NVIDIA Corporation",
        assetType: "stock",
        watchlistName: "AI & Technology",
        status: "watch",
        notes: "High momentum watchlist item.",
        archivedAt: null,
      },
      {
        id: "mock-asset-RR.L",
        watchlistId: "mock-watchlist-UK Stocks",
        symbol: "RR.L",
        name: "Rolls-Royce Holdings plc",
        assetType: "stock",
        watchlistName: "UK Stocks",
        status: "watch",
        notes: "UK watchlist item.",
        archivedAt: null,
      },
      {
        id: "mock-asset-PLTR",
        watchlistId: "mock-watchlist-AI & Technology",
        symbol: "PLTR",
        name: "Palantir Technologies Inc.",
        assetType: "stock",
        watchlistName: "AI & Technology",
        status: "watch",
        notes: "Speculative learning-only idea.",
        archivedAt: null,
      },
      {
        id: "mock-asset-CASH",
        watchlistId: null,
        symbol: "CASH",
        name: "Cash",
        assetType: "cash",
        watchlistName: "Unassigned",
        status: "hold",
        notes: "Manual cash balance.",
        archivedAt: null,
      },
    ].filter((asset) => asset.archivedAt == null);
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return [];
  }

  const [{ data: assets = [] }, { data: watchlists = [] }] = await Promise.all([
    supabase.from("assets").select("*").order("ticker", { ascending: true }),
    supabase.from("watchlists").select("*"),
  ]);

  const assetRows = (assets ?? []) as AssetRow[];
  const watchlistRows = (watchlists ?? []) as WatchlistRow[];

  return assetRows
    .filter((row) => row.archived_at == null)
    .map((row) => mapAssetRow(row, watchlistRows))
    .sort((a, b) => a.symbol.localeCompare(b.symbol));
}

export async function getAssetDetail(symbol: string): Promise<AssetDetailViewModel | null> {
  const normalizedSymbol = symbol.toUpperCase();

  if (!hasSupabaseConfig()) {
    return getFallbackAssetDetail(normalizedSymbol);
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return getFallbackAssetDetail(normalizedSymbol);
  }

  const [{ data: asset }, { data: watchlists = [] }] = await Promise.all([
    supabase.from("assets").select("*").eq("ticker", normalizedSymbol).maybeSingle(),
    supabase.from("watchlists").select("*"),
  ]);

  const assetRow = asset as AssetRow | null;
  if (!assetRow) {
    return getFallbackAssetDetail(normalizedSymbol);
  }

  const [positionResult, scoreResult, journalResult, alertResult] = await Promise.all([
    supabase
      .from("portfolio_positions")
      .select("*")
      .eq("asset_id", assetRow.id)
      .order("created_at", { ascending: false })
      .limit(1),
    supabase
      .from("ai_scores")
      .select("*")
      .eq("asset_id", assetRow.id)
      .order("created_at", { ascending: false })
      .limit(1),
    supabase
      .from("trade_journal")
      .select("*")
      .eq("asset_id", assetRow.id)
      .is("archived_at", null)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("alerts")
      .select("*")
      .eq("asset_id", assetRow.id)
      .is("archived_at", null)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const positionRows = (positionResult.data ?? []) as PortfolioPositionRow[];
  const scoreRows = (scoreResult.data ?? []) as AiScoreRow[];
  const journalRows = (journalResult.data ?? []) as TradeJournalRow[];
  const alertRows = (alertResult.data ?? []) as AlertRow[];
  const watchlistRows = (watchlists ?? []) as WatchlistRow[];
  const watchlistRow = assetRow.watchlist_id
    ? watchlistRows.find((row) => row.id === assetRow.watchlist_id)
    : null;
  const portfolioPosition = positionRows[0] ?? null;
  const latestScore = scoreRows[0] ?? null;

  return {
    id: assetRow.id,
    symbol: assetRow.ticker,
    name: assetRow.name,
    assetType: assetRow.asset_type,
    currency: assetRow.currency,
    market: assetRow.market ?? "Unspecified",
    riskLevel: assetRow.risk_level,
    status: assetRow.status,
    notes: assetRow.notes ?? "",
    watchlistName: watchlistRow?.name ?? "Unassigned",
    watchlistStatus: assetRow.status,
    positionStatus: portfolioPosition ? "Recorded position" : "No position",
    aiScore: latestScore?.total_score ?? null,
    aiLabel: latestScore?.label ?? null,
    journalEntries: journalRows.map((row) => mapJournalRow(row, [assetRow])),
    alerts: alertRows.map((row) => mapAlertRow(row, [assetRow])),
    archivedAt: assetRow.archived_at,
  };
}

export async function getJournalEntryById(
  id: string,
): Promise<JournalViewModel | null> {
  if (!hasSupabaseConfig()) {
    return (
      mockJournalEntries
        .map((entry, index) => ({
          id: `mock-journal-${index}`,
          assetId: `mock-asset-${entry.ticker}`,
          ticker: entry.ticker,
          action: entry.action,
          amount: entry.amount,
          thesisReason: entry.reason,
          riskNotes: entry.stopLossIdea,
          riskAmount: entry.riskAmount,
          stopLossIdea: entry.stopLossIdea,
          reviewDate: entry.reviewDate,
          manualExecutionConfirmed: true,
          emotionBefore: entry.emotionBefore,
          lesson: entry.lesson,
          archivedAt: null,
        }))
        .find((entry) => entry.id === id) ?? null
    );
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data: journal } = await supabase
    .from("trade_journal")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!journal) {
    return null;
  }

  const journalRow = journal as TradeJournalRow;
  const { data: asset } = await supabase
    .from("assets")
    .select("*")
    .eq("id", journalRow.asset_id)
    .maybeSingle();

  const assetRow = (asset as AssetRow | null) ?? null;
  return mapJournalRow(journalRow, assetRow ? [assetRow] : []);
}
