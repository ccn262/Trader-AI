export interface WatchlistRow {
  id: string;
  name: string;
  description: string | null;
  risk_profile: "low" | "medium" | "high" | "speculative";
  created_at: string;
  updated_at: string;
  archived_at: string | null;
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
  archived_at: string | null;
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
  archived_at: string | null;
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
  archived_at: string | null;
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
  reviewed_at: string | null;
  archived_at: string | null;
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

export interface ScanRunRow {
  id: string;
  scan_type: "morning" | "evening" | "manual";
  status: "pending" | "running" | "completed" | "failed";
  started_at: string | null;
  completed_at: string | null;
  summary: string | null;
  market_health_score: number | null;
  notes: string | null;
  trigger_source: "manual" | "cron" | "dev_script";
  started_by: string | null;
  total_intelligence_items: number;
  total_alerts_generated: number;
  high_priority_count: number;
  speculative_count: number;
  avoid_or_reassess_count: number;
  error_message: string | null;
  completed_successfully: boolean;
  created_at: string;
}

export interface IntelligenceSourceRow {
  id: string;
  name: string;
  source_type:
    | "company_filing"
    | "rns"
    | "sec"
    | "market_data"
    | "news"
    | "government"
    | "analyst"
    | "social"
    | "other";
  base_url: string | null;
  confidence_score: number;
  is_active: boolean;
  notes: string | null;
  created_at: string;
}

export interface SourceCandidateRow {
  id: string;
  name: string;
  source_type: string;
  url: string | null;
  access_method: "rss" | "api" | "html" | "js_rendered" | "manual" | "paid_provider";
  status:
    | "candidate"
    | "validating"
    | "validated"
    | "rejected"
    | "paid_required"
    | "manual_only";
  confidence_score: number;
  diagnostic_status: string | null;
  diagnostic_summary: string | null;
  last_checked_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface IntelligenceItemRow {
  id: string;
  scan_run_id: string | null;
  source_id: string | null;
  raw_announcement_id: string | null;
  asset_symbol: string | null;
  headline: string;
  summary: string | null;
  classification: string | null;
  impact_direction:
    | "positive"
    | "negative"
    | "neutral"
    | "mixed"
    | "unknown"
    | "speculative"
    | null;
  item_type:
    | "filing"
    | "result"
    | "trading_update"
    | "earnings"
    | "price_move"
    | "volume_move"
    | "sector_news"
    | "social_signal"
    | "other";
  source_url: string | null;
  published_at: string | null;
  source_confidence: number | null;
  verification_status:
    | "unverified"
    | "partially_verified"
    | "verified"
    | "disputed";
  impact_score: number | null;
  risk_level:
    | "low"
    | "medium"
    | "high"
    | "speculative"
    | "critical"
    | null;
  priority:
    | "high_priority_review"
    | "watch_today"
    | "monitor_only"
    | "speculative_review"
    | "avoid_or_reassess"
    | null;
  scoring_reason: string | null;
  scored_at: string | null;
  created_at: string;
}

export interface RawAnnouncementRow {
  id: string;
  source_id: string | null;
  external_id: string | null;
  asset_symbol: string | null;
  company_name: string | null;
  headline: string;
  announcement_type: string | null;
  raw_category: string | null;
  source_url: string | null;
  published_at: string | null;
  raw_payload: Record<string, unknown> | null;
  ingestion_status: "new" | "parsed" | "ignored" | "failed";
  created_at: string;
  updated_at: string;
}

export interface OpportunityAlertRow {
  id: string;
  scan_run_id: string | null;
  source_intelligence_item_id: string | null;
  asset_symbol: string;
  asset_name: string;
  market: string | null;
  opportunity_type:
    | "long_term_investment"
    | "swing_trade"
    | "penny_share_catalyst"
    | "mining_resource_catalyst"
    | "earnings_momentum"
    | "special_situation"
    | "etf_sector_rotation";
  priority:
    | "high_priority_review"
    | "watch_today"
    | "monitor_only"
    | "speculative_review"
    | "avoid_or_reassess";
  catalyst_summary: string;
  score: number;
  source_confidence: number | null;
  risk_level: string | null;
  suggested_position_min: number | null;
  suggested_position_max: number | null;
  suggested_hold_timeframe: string | null;
  exit_plan: string | null;
  risk_warning: string | null;
  generated_by: string;
  generation_reason: string | null;
  invalidation_notes: string | null;
  review_by: string | null;
  confidence_label: string | null;
  review_status: "new" | "reviewed" | "ignored" | "archived";
  archived: boolean;
  created_at: string;
  reviewed_at: string | null;
}

export interface OpportunityEvidenceRow {
  id: string;
  opportunity_alert_id: string;
  intelligence_item_id: string | null;
  evidence_label: string;
  evidence_summary: string | null;
  source_url: string | null;
  confidence_score: number | null;
  evidence_type: string | null;
  is_primary: boolean;
  created_at: string;
}

export interface ScoreHistoryRow {
  id: string;
  asset_symbol: string;
  score_type: "watchlist" | "opportunity" | "risk" | "market_health";
  score: number;
  previous_score: number | null;
  score_delta: number | null;
  reason: string | null;
  calculated_at: string;
  created_at: string;
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
      scan_runs: {
        Row: ScanRunRow;
        Insert: Partial<Omit<ScanRunRow, "id" | "created_at">>;
        Update: Partial<ScanRunRow>;
      };
      intelligence_sources: {
        Row: IntelligenceSourceRow;
        Insert: Partial<Omit<IntelligenceSourceRow, "id" | "created_at">>;
        Update: Partial<IntelligenceSourceRow>;
      };
      source_candidates: {
        Row: SourceCandidateRow;
        Insert: Partial<Omit<SourceCandidateRow, "id" | "created_at" | "updated_at">>;
        Update: Partial<SourceCandidateRow>;
      };
      intelligence_items: {
        Row: IntelligenceItemRow;
        Insert: Partial<Omit<IntelligenceItemRow, "id" | "created_at">>;
        Update: Partial<IntelligenceItemRow>;
      };
      raw_announcements: {
        Row: RawAnnouncementRow;
        Insert: Partial<Omit<RawAnnouncementRow, "id" | "created_at" | "updated_at">>;
        Update: Partial<RawAnnouncementRow>;
      };
      opportunity_alerts: {
        Row: OpportunityAlertRow;
        Insert: Partial<Omit<OpportunityAlertRow, "id" | "created_at">>;
        Update: Partial<OpportunityAlertRow>;
      };
      opportunity_evidence: {
        Row: OpportunityEvidenceRow;
        Insert: Partial<Omit<OpportunityEvidenceRow, "id" | "created_at">>;
        Update: Partial<OpportunityEvidenceRow>;
      };
      score_history: {
        Row: ScoreHistoryRow;
        Insert: Partial<Omit<ScoreHistoryRow, "id" | "created_at">>;
        Update: Partial<ScoreHistoryRow>;
      };
    };
  };
}
