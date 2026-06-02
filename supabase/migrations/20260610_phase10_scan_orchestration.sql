alter table if exists public.scan_runs
  add column if not exists trigger_source text not null default 'dev_script' check (
    trigger_source in ('manual', 'cron', 'dev_script')
  );

alter table if exists public.scan_runs
  add column if not exists started_by text;

alter table if exists public.scan_runs
  add column if not exists total_intelligence_items integer not null default 0 check (
    total_intelligence_items >= 0
  );

alter table if exists public.scan_runs
  add column if not exists total_alerts_generated integer not null default 0 check (
    total_alerts_generated >= 0
  );

alter table if exists public.scan_runs
  add column if not exists high_priority_count integer not null default 0 check (
    high_priority_count >= 0
  );

alter table if exists public.scan_runs
  add column if not exists speculative_count integer not null default 0 check (
    speculative_count >= 0
  );

alter table if exists public.scan_runs
  add column if not exists avoid_or_reassess_count integer not null default 0 check (
    avoid_or_reassess_count >= 0
  );

alter table if exists public.scan_runs
  add column if not exists error_message text;

alter table if exists public.scan_runs
  add column if not exists completed_successfully boolean not null default false;

create index if not exists idx_scan_runs_trigger_source_created_at
  on public.scan_runs(trigger_source, created_at desc);

create index if not exists idx_scan_runs_status_created_at
  on public.scan_runs(status, created_at desc);
