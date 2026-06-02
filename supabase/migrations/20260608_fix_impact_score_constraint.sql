do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'intelligence_items_impact_score_check'
  ) then
    alter table public.intelligence_items
      drop constraint intelligence_items_impact_score_check;
  end if;
end $$;

alter table public.intelligence_items
  add constraint intelligence_items_impact_score_check
  check (
    impact_score is null or (impact_score >= -100 and impact_score <= 100)
  );

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'score_history_score_check'
  ) then
    alter table public.score_history
      drop constraint score_history_score_check;
  end if;
end $$;

alter table public.score_history
  add constraint score_history_score_check
  check (
    score between -100 and 100
  );
