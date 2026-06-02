export interface WatchlistRow {
  id: string;
  name: string;
  description: string | null;
  risk_profile: "low" | "medium" | "high" | "speculative";
  created_at: string;
  updated_at: string;
}

export interface AssetRow {
  id: string;
  watchlist_id: string | null;
  ticker: string;
  name: string;
  market: string | null;
  asset_type: "etf" | "stock" | "fund" | "cash" | "other";
  currency: string;
  risk_level: "low" | "medium" | "high" | "speculative";
  status: "research" | "watch" | "buy_zone" | "hold" | "wait" | "avoid";
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioPositionRow {
  id: string;
  asset_id: string;
  quantity: number;
  average_buy_price: number;
  current_price: number;
  currency: string;
  account_type: "isa" | "invest" | "other";
  strategy: "core" | "swing" | "learning";
  target_allocation: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TradeJournalRow {
  id: string;
  asset_id: string;
  action: "buy" | "sell" | "trim" | "add" | "paper_trade" | "avoid";
  amount: number;
  entry_price: number | null;
  thesis_reason: string;
  risk_notes: string;
  risk_amount: number | null;
  stop_loss_idea: string;
  review_date: string;
  manual_execution_confirmed: boolean;
  emotion_before: string | null;
  result: string | null;
  lesson_learned: string | null;
  created_at: string;
  updated_at: string;
}

export interface AlertRow {
  id: string;
  asset_id: string | null;
  alert_type:
    | "price_above"
    | "price_below"
    | "score_above"
    | "review_due"
    | "news"
    | "earnings"
    | "manual";
  threshold_value: number | null;
  message: string;
  due_at: string | null;
  is_active: boolean;
  triggered_at: string | null;
  created_at: string;
}

export interface AiScoreRow {
  id: string;
  asset_id: string;
  trend_score: number;
  sentiment_score: number;
  quality_score: number;
  valuation_risk_score: number;
  setup_score: number;
  total_score: number;
  label: string;
  summary: string;
  bull_case: string;
  bear_case: string;
  what_would_change_view: string;
  review_date: string;
  risk_warning: string;
  created_at: string;
}

export interface AppSettingsRow {
  id: string;
  setting_key: string;
  decision_support_only: boolean;
  risk_mode: "beginner" | "standard" | "custom";
  base_currency: string;
  disclaimer: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      watchlists: {
        Row: WatchlistRow;
        Insert: Partial<Omit<WatchlistRow, "id" | "created_at" | "updated_at">>;
        Update: Partial<WatchlistRow>;
      };
      assets: {
        Row: AssetRow;
        Insert: Partial<Omit<AssetRow, "id" | "created_at" | "updated_at">>;
        Update: Partial<AssetRow>;
      };
      portfolio_positions: {
        Row: PortfolioPositionRow;
        Insert: Partial<
          Omit<PortfolioPositionRow, "id" | "created_at" | "updated_at">
        >;
        Update: Partial<PortfolioPositionRow>;
      };
      trade_journal: {
        Row: TradeJournalRow;
        Insert: Partial<Omit<TradeJournalRow, "id" | "created_at" | "updated_at">>;
        Update: Partial<TradeJournalRow>;
      };
      alerts: {
        Row: AlertRow;
        Insert: Partial<Omit<AlertRow, "id" | "created_at">>;
        Update: Partial<AlertRow>;
      };
      ai_scores: {
        Row: AiScoreRow;
        Insert: Partial<Omit<AiScoreRow, "id" | "created_at">>;
        Update: Partial<AiScoreRow>;
      };
      app_settings: {
        Row: AppSettingsRow;
        Insert: Partial<Omit<AppSettingsRow, "id" | "updated_at">>;
        Update: Partial<AppSettingsRow>;
      };
    };
  };
}
