alter table public.opportunity_alerts
  add column if not exists source_intelligence_item_id uuid references public.intelligence_items(id) on delete set null;

alter table public.opportunity_alerts
  add column if not exists generated_by text not null default 'deterministic_rules';

alter table public.opportunity_alerts
  add column if not exists generation_reason text;

alter table public.opportunity_alerts
  add column if not exists invalidation_notes text;

alter table public.opportunity_alerts
  add column if not exists review_by date;

alter table public.opportunity_alerts
  add column if not exists confidence_label text;

alter table public.opportunity_alerts
  drop constraint if exists opportunity_alerts_priority_check;

alter table public.opportunity_alerts
  add constraint opportunity_alerts_priority_check
  check (
    priority in (
      'high_priority_review',
      'watch_today',
      'monitor_only',
      'speculative_review',
      'avoid_or_reassess'
    )
  );

alter table public.opportunity_evidence
  add column if not exists evidence_type text;

alter table public.opportunity_evidence
  add column if not exists is_primary boolean not null default false;

create unique index if not exists idx_opportunity_alerts_source_intelligence_item_id_unique
  on public.opportunity_alerts(source_intelligence_item_id);

create index if not exists idx_opportunity_alerts_source_intelligence_item_id
  on public.opportunity_alerts(source_intelligence_item_id);

create index if not exists idx_opportunity_alerts_review_status
  on public.opportunity_alerts(review_status);

create index if not exists idx_opportunity_alerts_priority
  on public.opportunity_alerts(priority);

create index if not exists idx_opportunity_evidence_opportunity_alert_id
  on public.opportunity_evidence(opportunity_alert_id);

create unique index if not exists idx_opportunity_evidence_alert_item_unique
  on public.opportunity_evidence(opportunity_alert_id, intelligence_item_id);
