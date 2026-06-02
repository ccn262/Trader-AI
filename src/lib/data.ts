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
  name: string;
  description: string;
  riskProfile: "low" | "medium" | "high" | "speculative";
  assetCount: number;
  averageScore: number;
  lastReviewed: string;
  highlights: string[];
};

export type PortfolioViewModel = {
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

export type JournalViewModel = {
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
};

export type AlertViewModel = {
  title: string;
  asset: string;
  type: string;
  action: string;
  due: string;
};

export type SettingsViewModel = {
  decisionSupportOnly: boolean;
  riskMode: "beginner" | "standard" | "custom";
  baseCurrency: string;
  disclaimer: string;
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
  };
}

function mapPortfolioPosition(
  row: PortfolioPositionRow,
  assets: AssetRow[],
): PortfolioViewModel {
  const asset = assets.find((item) => item.id === row.asset_id);

  return {
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
  };
}

function mapJournalRow(
  row: TradeJournalRow,
  assets: AssetRow[],
): JournalViewModel {
  const asset = assets.find((item) => item.id === row.asset_id);

  return {
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
  };
}

function mapAlertRow(row: AlertRow, assets: AssetRow[]): AlertViewModel {
  const asset = row.asset_id
    ? assets.find((item) => item.id === row.asset_id)?.ticker ?? "Portfolio"
    : "Portfolio";

  return {
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
      alerts: mockAlerts,
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
      alerts: mockAlerts,
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
    return mockWatchlists;
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return mockWatchlists;
  }

  const [{ data: watchlists = [] }, { data: assets = [] }] = await Promise.all([
    supabase.from("watchlists").select("*").order("created_at", { ascending: true }),
    supabase.from("assets").select("*"),
  ]);

  const watchlistRows = (watchlists ?? []) as WatchlistRow[];
  const assetRows = (assets ?? []) as AssetRow[];

  if (!watchlistRows.length) {
    return mockWatchlists;
  }

  return watchlistRows.map((row) => mapWatchlist(row, assetRows));
}

export async function getPortfolioPositions(): Promise<PortfolioViewModel[]> {
  if (!hasSupabaseConfig()) {
    return mockPortfolioPositions;
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return mockPortfolioPositions;
  }

  const [{ data: positions = [] }, { data: assets = [] }] = await Promise.all([
    supabase.from("portfolio_positions").select("*").order("created_at", { ascending: true }),
    supabase.from("assets").select("*"),
  ]);

  const positionRows = (positions ?? []) as PortfolioPositionRow[];
  const assetRows = (assets ?? []) as AssetRow[];

  if (!positionRows.length) {
    return mockPortfolioPositions;
  }

  return positionRows.map((row) => mapPortfolioPosition(row, assetRows));
}

export async function getJournalEntries(): Promise<JournalViewModel[]> {
  if (!hasSupabaseConfig()) {
    return mockJournalEntries.map((entry) => ({
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
    }));
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return mockJournalEntries.map((entry) => ({
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
    }));
  }

  const [{ data: journals = [] }, { data: assets = [] }] = await Promise.all([
    supabase.from("trade_journal").select("*").order("created_at", { ascending: false }).limit(10),
    supabase.from("assets").select("*"),
  ]);

  const journalRows = (journals ?? []) as TradeJournalRow[];
  const assetRows = (assets ?? []) as AssetRow[];

  if (!journalRows.length) {
    return mockJournalEntries.map((entry) => ({
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
    }));
  }

  return journalRows.map((row) => mapJournalRow(row, assetRows));
}

export async function getAlerts(): Promise<AlertViewModel[]> {
  if (!hasSupabaseConfig()) {
    return mockAlerts;
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return mockAlerts;
  }

  const [{ data: alerts = [] }, { data: assets = [] }] = await Promise.all([
    supabase.from("alerts").select("*").eq("is_active", true).order("created_at", { ascending: false }),
    supabase.from("assets").select("*"),
  ]);

  const alertRows = (alerts ?? []) as AlertRow[];
  const assetRows = (assets ?? []) as AssetRow[];

  if (!alertRows.length) {
    return mockAlerts;
  }

  return alertRows.map((row) => mapAlertRow(row, assetRows));
}

export async function getSettings(): Promise<SettingsViewModel> {
  return readAppSettings();
}
