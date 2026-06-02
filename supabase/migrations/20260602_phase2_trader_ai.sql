create extension if not exists "pgcrypto";

create table if not exists watchlists (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  risk_profile text not null check (risk_profile in ('low', 'medium', 'high', 'speculative')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists assets (
  id uuid primary key default gen_random_uuid(),
  watchlist_id uuid references watchlists(id) on delete set null,
  ticker text not null unique,
  name text not null,
  market text,
  asset_type text not null check (asset_type in ('etf', 'stock', 'fund', 'cash', 'other')),
  currency text not null default 'GBP',
  risk_level text not null check (risk_level in ('low', 'medium', 'high', 'speculative')),
  status text not null default 'research' check (status in ('research', 'watch', 'buy_zone', 'hold', 'wait', 'avoid')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists assets_watchlist_id_idx on assets (watchlist_id);

create table if not exists portfolio_positions (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references assets(id) on delete cascade,
  quantity numeric not null default 0,
  average_buy_price numeric not null default 0,
  current_price numeric not null default 0,
  currency text not null default 'GBP',
  account_type text not null default 'invest' check (account_type in ('isa', 'invest', 'other')),
  strategy text not null default 'core' check (strategy in ('core', 'swing', 'learning')),
  target_allocation numeric not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists portfolio_positions_asset_id_idx on portfolio_positions (asset_id);

create table if not exists trade_journal (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references assets(id) on delete cascade,
  action text not null check (action in ('buy', 'sell', 'trim', 'add', 'paper_trade', 'avoid')),
  amount numeric not null default 0,
  entry_price numeric,
  thesis_reason text not null,
  risk_notes text not null,
  risk_amount numeric,
  stop_loss_idea text not null,
  review_date date not null,
  manual_execution_confirmed boolean not null default false,
  emotion_before text,
  result text,
  lesson_learned text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists trade_journal_asset_id_idx on trade_journal (asset_id);
create index if not exists trade_journal_review_date_idx on trade_journal (review_date);

create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid references assets(id) on delete set null,
  alert_type text not null check (alert_type in ('price_above', 'price_below', 'score_above', 'review_due', 'news', 'earnings', 'manual')),
  threshold_value numeric,
  message text not null,
  due_at timestamptz,
  is_active boolean not null default true,
  triggered_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists alerts_asset_id_idx on alerts (asset_id);
create index if not exists alerts_is_active_idx on alerts (is_active);

create table if not exists ai_scores (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references assets(id) on delete cascade,
  trend_score integer not null check (trend_score between 0 and 20),
  sentiment_score integer not null check (sentiment_score between 0 and 20),
  quality_score integer not null check (quality_score between 0 and 20),
  valuation_risk_score integer not null check (valuation_risk_score between 0 and 20),
  setup_score integer not null check (setup_score between 0 and 20),
  total_score integer not null check (total_score between 0 and 100),
  label text not null,
  summary text not null,
  bull_case text not null,
  bear_case text not null,
  what_would_change_view text not null,
  review_date date not null,
  risk_warning text not null,
  created_at timestamptz not null default now()
);

create index if not exists ai_scores_asset_id_idx on ai_scores (asset_id);
create index if not exists ai_scores_total_score_idx on ai_scores (total_score desc);

create table if not exists app_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  decision_support_only boolean not null default true,
  risk_mode text not null default 'beginner' check (risk_mode in ('beginner', 'standard', 'custom')),
  base_currency text not null default 'GBP',
  disclaimer text not null,
  updated_at timestamptz not null default now()
);

insert into watchlists (name, description, risk_profile)
values
  ('Core ETFs', 'Long-term global exposure with low drama and low upkeep.', 'low'),
  ('US Stocks', 'Higher conviction US names for manual review.', 'medium'),
  ('UK Stocks', 'Domestic names that need a reason before action.', 'medium'),
  ('AI & Technology', 'Higher momentum ideas with extra discipline required.', 'high'),
  ('Learning Only', 'Speculative ideas that stay in review mode.', 'speculative')
on conflict (name) do update set
  description = excluded.description,
  risk_profile = excluded.risk_profile,
  updated_at = now();

with watchlist_lookup as (
  select id, name from watchlists
),
asset_seed as (
  insert into assets (watchlist_id, ticker, name, market, asset_type, currency, risk_level, status, notes)
  select wl.id, seed.ticker, seed.name, seed.market, seed.asset_type, seed.currency, seed.risk_level, seed.status, seed.notes
  from (
    values
      ('Core ETFs', 'VWRP', 'Vanguard FTSE All-World UCITS ETF', 'London', 'etf', 'GBP', 'low', 'watch', 'Core ETF starter position.'),
      ('US Stocks', 'MSFT', 'Microsoft Corporation', 'NASDAQ', 'stock', 'USD', 'medium', 'watch', 'Starter US quality holding.'),
      ('AI & Technology', 'NVDA', 'NVIDIA Corporation', 'NASDAQ', 'stock', 'USD', 'high', 'watch', 'High momentum watchlist item.'),
      ('UK Stocks', 'RR.L', 'Rolls-Royce Holdings plc', 'London', 'stock', 'GBP', 'medium', 'watch', 'UK watchlist item.'),
      ('AI & Technology', 'PLTR', 'Palantir Technologies Inc.', 'NASDAQ', 'stock', 'USD', 'speculative', 'watch', 'Speculative learning-only idea.'),
      (null, 'CASH', 'Cash', null, 'cash', 'GBP', 'low', 'hold', 'Manual cash balance.')
  ) as seed(watchlist_name, ticker, name, market, asset_type, currency, risk_level, status, notes)
  left join watchlist_lookup wl on wl.name = seed.watchlist_name
  on conflict (ticker) do update set
    watchlist_id = excluded.watchlist_id,
    name = excluded.name,
    market = excluded.market,
    asset_type = excluded.asset_type,
    currency = excluded.currency,
    risk_level = excluded.risk_level,
    status = excluded.status,
    notes = excluded.notes,
    updated_at = now()
  returning *
)
insert into portfolio_positions (asset_id, quantity, average_buy_price, current_price, currency, account_type, strategy, target_allocation, notes)
select a.id, seed.quantity, seed.average_buy_price, seed.current_price, seed.currency, seed.account_type, seed.strategy, seed.target_allocation, seed.notes
from (
  values
    ('VWRP', 1::numeric, 30::numeric, 30::numeric, 'GBP', 'isa', 'core', 60::numeric, 'Core holding for the starter portfolio.'),
    ('MSFT', 1::numeric, 10::numeric, 10::numeric, 'USD', 'invest', 'swing', 20::numeric, 'Small starter position.'),
    ('CASH', 10::numeric, 1::numeric, 1::numeric, 'GBP', 'other', 'learning', 20::numeric, 'Manual cash reserve.')
) as seed(ticker, quantity, average_buy_price, current_price, currency, account_type, strategy, target_allocation, notes)
join assets a on a.ticker = seed.ticker
on conflict do nothing;

insert into trade_journal (
  asset_id,
  action,
  amount,
  entry_price,
  thesis_reason,
  risk_notes,
  risk_amount,
  stop_loss_idea,
  review_date,
  manual_execution_confirmed,
  emotion_before,
  result,
  lesson_learned
)
select a.id, seed.action, seed.amount, seed.entry_price, seed.thesis_reason, seed.risk_notes, seed.risk_amount, seed.stop_loss_idea, seed.review_date, seed.manual_execution_confirmed, seed.emotion_before, seed.result, seed.lesson_learned
from (
  values
    ('VWRP', 'add', 30::numeric, 30::numeric, 'Add to the core ETF allocation while beginner mode stays intact.', 'Keep risk small and avoid drift away from the core bucket.', 1::numeric, 'No hard stop; review if the thesis changes.', date '2026-06-06', true, 'Calm', null, 'Staying consistent matters more than timing the perfect entry.'),
    ('MSFT', 'paper_trade', 0::numeric, 10::numeric, 'Test the checklist against a quality US name before committing capital.', 'Small position size and manual review required.', 1::numeric, 'Only act if the review still supports it.', date '2026-06-04', true, 'Curious', null, 'A clean process is part of the edge.'),
    ('PLTR', 'avoid', 0::numeric, null, 'Keep speculative ideas in review only until the thesis is clearer.', 'Risk is elevated and the setup is noisy.', 1::numeric, 'Stay out until the structure improves.', date '2026-06-10', true, 'Cautious', null, 'Avoiding a trade is still a valid decision.')
) as seed(ticker, action, amount, entry_price, thesis_reason, risk_notes, risk_amount, stop_loss_idea, review_date, manual_execution_confirmed, emotion_before, result, lesson_learned)
join assets a on a.ticker = seed.ticker
on conflict do nothing;

insert into alerts (asset_id, alert_type, threshold_value, message, due_at, is_active)
select a.id, seed.alert_type, seed.threshold_value, seed.message, seed.due_at, seed.is_active
from (
  values
    ('VWRP', 'review_due', null::numeric, 'Review VWRP before making any change to the core allocation.', timestamptz '2026-06-02 17:00:00+00', true),
    ('MSFT', 'score_above', 75::numeric, 'MSFT score is in watch range. Recheck the thesis before action.', timestamptz '2026-06-02 17:00:00+00', true),
    ('NVDA', 'news', null::numeric, 'NVDA has a news catalyst. Review the source before acting.', timestamptz '2026-06-03 09:00:00+00', true)
) as seed(ticker, alert_type, threshold_value, message, due_at, is_active)
join assets a on a.ticker = seed.ticker
on conflict do nothing;

insert into ai_scores (
  asset_id,
  trend_score,
  sentiment_score,
  quality_score,
  valuation_risk_score,
  setup_score,
  total_score,
  label,
  summary,
  bull_case,
  bear_case,
  what_would_change_view,
  review_date,
  risk_warning
)
select a.id, seed.trend_score, seed.sentiment_score, seed.quality_score, seed.valuation_risk_score, seed.setup_score, seed.total_score, seed.label, seed.summary, seed.bull_case, seed.bear_case, seed.what_would_change_view, seed.review_date, seed.risk_warning
from (
  values
    ('VWRP', 17, 16, 17, 16, 16, 82, 'Watch', 'Broad market ETF with stable core characteristics.', 'Long-term diversification remains intact.', 'Thesis weakens if allocation drifts or macro risk changes.', 'Watch for allocation drift and broad market deterioration.', date '2026-06-06', 'Decision support only. Not financial advice.'),
    ('MSFT', 15, 15, 16, 15, 17, 78, 'Watch', 'Quality large-cap tech name with durable fundamentals.', 'Strong ecosystem and business quality.', 'Thesis weakens if growth or valuation deteriorates materially.', 'Recheck if price momentum fades or fundamentals soften.', date '2026-06-04', 'Decision support only. Not financial advice.'),
    ('NVDA', 14, 14, 15, 13, 15, 71, 'Wait', 'High quality but still elevated volatility and narrative risk.', 'AI demand could stay strong.', 'Setup improves if risk/reward becomes cleaner.', 'Wait for a clearer setup or better risk structure.', date '2026-06-05', 'Decision support only. Not financial advice.'),
    ('PLTR', 9, 10, 12, 7, 6, 44, 'Avoid', 'Speculative idea with too much noise for beginner mode.', 'Could benefit from continued execution.', 'Risk profile improves only after a clearer structure appears.', 'Avoid until there is more evidence and better timing.', date '2026-06-10', 'Decision support only. Not financial advice.')
) as seed(ticker, trend_score, sentiment_score, quality_score, valuation_risk_score, setup_score, total_score, label, summary, bull_case, bear_case, what_would_change_view, review_date, risk_warning)
join assets a on a.ticker = seed.ticker
on conflict do nothing;

insert into app_settings (setting_key, decision_support_only, risk_mode, base_currency, disclaimer)
values (
  'global',
  true,
  'beginner',
  'GBP',
  'Trader AI is a personal research and journaling tool. It is not financial advice. It does not place trades and does not guarantee returns.'
)
on conflict (setting_key) do update set
  decision_support_only = excluded.decision_support_only,
  risk_mode = excluded.risk_mode,
  base_currency = excluded.base_currency,
  disclaimer = excluded.disclaimer,
  updated_at = now();
