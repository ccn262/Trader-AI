alter table watchlists
  add column if not exists archived_at timestamptz;

alter table assets
  add column if not exists archived_at timestamptz;

alter table portfolio_positions
  add column if not exists archived_at timestamptz;

alter table trade_journal
  add column if not exists archived_at timestamptz;

alter table alerts
  add column if not exists reviewed_at timestamptz,
  add column if not exists archived_at timestamptz;

create index if not exists watchlists_archived_at_idx on watchlists (archived_at);
create index if not exists assets_archived_at_idx on assets (archived_at);
create index if not exists portfolio_positions_archived_at_idx on portfolio_positions (archived_at);
create index if not exists trade_journal_archived_at_idx on trade_journal (archived_at);
create index if not exists alerts_reviewed_at_idx on alerts (reviewed_at);
create index if not exists alerts_archived_at_idx on alerts (archived_at);
