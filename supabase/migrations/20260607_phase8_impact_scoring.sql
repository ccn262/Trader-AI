alter table public.intelligence_items
  add column if not exists classification text;

alter table public.intelligence_items
  add column if not exists impact_direction text;

alter table public.intelligence_items
  add column if not exists risk_level text;

alter table public.intelligence_items
  add column if not exists priority text;

alter table public.intelligence_items
  add column if not exists scoring_reason text;

alter table public.intelligence_items
  add column if not exists scored_at timestamptz;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'intelligence_items_impact_direction_check'
  ) then
    alter table public.intelligence_items
      add constraint intelligence_items_impact_direction_check
      check (
        impact_direction is null or
        impact_direction in (
          'positive',
          'negative',
          'neutral',
          'mixed',
          'unknown',
          'speculative'
        )
      );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'intelligence_items_risk_level_check'
  ) then
    alter table public.intelligence_items
      add constraint intelligence_items_risk_level_check
      check (
        risk_level is null or
        risk_level in (
          'low',
          'medium',
          'high',
          'speculative',
          'critical'
        )
      );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'intelligence_items_priority_check'
  ) then
    alter table public.intelligence_items
      add constraint intelligence_items_priority_check
      check (
        priority is null or
        priority in (
          'high_priority_review',
          'watch_today',
          'monitor_only',
          'speculative_review',
          'avoid_or_reassess'
        )
      );
  end if;
end $$;

create index if not exists idx_intelligence_items_scored_at
  on public.intelligence_items(scored_at desc);

create index if not exists idx_intelligence_items_priority
  on public.intelligence_items(priority);
