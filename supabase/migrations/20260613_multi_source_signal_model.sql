create extension if not exists "pgcrypto";

alter table if exists public.intelligence_sources
  add column if not exists tier integer;

alter table if exists public.intelligence_sources
  add column if not exists access_method text;

alter table if exists public.intelligence_sources
  add column if not exists licence_status text;

alter table if exists public.intelligence_sources
  add column if not exists weighting_multiplier numeric;

alter table if exists public.intelligence_sources
  add column if not exists can_create_alerts boolean not null default false;

alter table if exists public.intelligence_sources
  add column if not exists requires_primary_confirmation boolean not null default true;

alter table if exists public.intelligence_items
  add column if not exists signal_type text;

alter table if exists public.intelligence_items
  add column if not exists source_tier integer;

alter table if exists public.intelligence_items
  add column if not exists weighting_multiplier numeric;

alter table if exists public.intelligence_items
  add column if not exists primary_confirmation_required boolean not null default true;

alter table if exists public.intelligence_items
  add column if not exists confirmed_by_primary_source boolean not null default false;

alter table if exists public.intelligence_items
  add column if not exists confirmation_source_id uuid references public.intelligence_items(id) on delete set null;

alter table if exists public.intelligence_items
  add column if not exists rumour_flag boolean not null default false;

alter table if exists public.intelligence_items
  add column if not exists pump_risk_flag boolean not null default false;

alter table if exists public.intelligence_sources
  drop constraint if exists intelligence_sources_tier_check;

alter table if exists public.intelligence_sources
  add constraint intelligence_sources_tier_check
  check (tier is null or tier between 1 and 5);

alter table if exists public.intelligence_sources
  drop constraint if exists intelligence_sources_access_method_check;

alter table if exists public.intelligence_sources
  add constraint intelligence_sources_access_method_check
  check (
    access_method is null
    or access_method in (
      'api',
      'rss',
      'html',
      'js_rendered',
      'manual',
      'paid_provider',
      'app_connector',
      'other'
    )
  );

alter table if exists public.intelligence_sources
  drop constraint if exists intelligence_sources_licence_status_check;

alter table if exists public.intelligence_sources
  add constraint intelligence_sources_licence_status_check
  check (
    licence_status is null
    or licence_status in (
      'open',
      'paid_required',
      'licensed',
      'unknown',
      'not_allowed'
    )
  );

alter table if exists public.intelligence_sources
  drop constraint if exists intelligence_sources_weighting_multiplier_check;

alter table if exists public.intelligence_sources
  add constraint intelligence_sources_weighting_multiplier_check
  check (weighting_multiplier is null or weighting_multiplier between 0 and 2);

alter table if exists public.intelligence_items
  drop constraint if exists intelligence_items_signal_type_check;

alter table if exists public.intelligence_items
  add constraint intelligence_items_signal_type_check
  check (
    signal_type is null
    or signal_type in (
      'primary_evidence',
      'confirming_news',
      'market_movement',
      'social_attention',
      'rumour',
      'risk_warning',
      'pump_risk_warning',
      'press_release',
      'aggregator_summary',
      'analyst_signal',
      'other'
    )
  );

alter table if exists public.intelligence_items
  drop constraint if exists intelligence_items_source_tier_check;

alter table if exists public.intelligence_items
  add constraint intelligence_items_source_tier_check
  check (source_tier is null or source_tier between 1 and 5);

alter table if exists public.intelligence_items
  drop constraint if exists intelligence_items_weighting_multiplier_check;

alter table if exists public.intelligence_items
  add constraint intelligence_items_weighting_multiplier_check
  check (weighting_multiplier is null or weighting_multiplier between 0 and 2);

alter table if exists public.intelligence_items
  drop constraint if exists intelligence_items_primary_confirmation_required_check;

alter table if exists public.intelligence_items
  add constraint intelligence_items_primary_confirmation_required_check
  check (primary_confirmation_required in (true, false));

alter table if exists public.intelligence_items
  drop constraint if exists intelligence_items_confirmed_by_primary_source_check;

alter table if exists public.intelligence_items
  add constraint intelligence_items_confirmed_by_primary_source_check
  check (confirmed_by_primary_source in (true, false));

alter table if exists public.intelligence_items
  drop constraint if exists intelligence_items_rumour_flag_check;

alter table if exists public.intelligence_items
  add constraint intelligence_items_rumour_flag_check
  check (rumour_flag in (true, false));

alter table if exists public.intelligence_items
  drop constraint if exists intelligence_items_pump_risk_flag_check;

alter table if exists public.intelligence_items
  add constraint intelligence_items_pump_risk_flag_check
  check (pump_risk_flag in (true, false));

create index if not exists idx_intelligence_items_signal_type
  on public.intelligence_items(signal_type);

create index if not exists idx_intelligence_items_source_tier
  on public.intelligence_items(source_tier);

create index if not exists idx_intelligence_items_rumour_flag
  on public.intelligence_items(rumour_flag);

create index if not exists idx_intelligence_items_pump_risk_flag
  on public.intelligence_items(pump_risk_flag);

create index if not exists idx_intelligence_sources_tier
  on public.intelligence_sources(tier);

create index if not exists idx_intelligence_sources_licence_status
  on public.intelligence_sources(licence_status);

with derived_source_values as (
  select
    source.id,
    case
      when lower(source.name) like '%rns%'
        or lower(source.source_type) in ('company_filing', 'sec')
        then 1
      when lower(source.name) like '%reuters%'
        or lower(source.name) like '%bloomberg%'
        or lower(source.name) like '%financial times%'
        or lower(source.name) like '%dow jones%'
        or lower(source.source_type) = 'news'
        then 2
      when lower(source.name) like '%yahoo%'
        or lower(source.name) like '%marketwatch%'
        or lower(source.name) like '%marketbeat%'
        or lower(source.name) like '%investing.com%'
        or lower(source.source_type) = 'market_data'
        then 3
      when lower(source.name) like '%globenewswire%'
        or lower(source.name) like '%pr newswire%'
        or lower(source.name) like '%business wire%'
        then 4
      when lower(source.name) like '%reddit%'
        or lower(source.name) like '%stocktwits%'
        or lower(source.name) like '%share chat%'
        or lower(source.name) like '%advfn%'
        or lower(source.source_type) = 'social'
        then 5
      else 3
    end as derived_tier,
    case
      when lower(source.name) like '%reuters%'
        or lower(source.name) like '%bloomberg%'
        or lower(source.name) like '%financial times%'
        or lower(source.name) like '%dow jones%'
        then 'paid_provider'
      when lower(source.name) like '%yahoo%'
        or lower(source.name) like '%marketwatch%'
        or lower(source.name) like '%marketbeat%'
        or lower(source.name) like '%investing.com%'
        then 'html'
      when lower(source.name) like '%globenewswire%'
        or lower(source.name) like '%pr newswire%'
        or lower(source.name) like '%business wire%'
        then 'html'
      when lower(source.name) like '%reddit%'
        or lower(source.name) like '%stocktwits%'
        or lower(source.name) like '%share chat%'
        or lower(source.name) like '%advfn%'
        or lower(source.source_type) = 'social'
        then 'manual'
      when lower(source.name) like '%rns%'
        or lower(source.source_type) in ('company_filing', 'sec')
        then 'html'
      else 'other'
    end as derived_access_method,
    case
      when lower(source.name) like '%reuters%'
        or lower(source.name) like '%bloomberg%'
        or lower(source.name) like '%financial times%'
        or lower(source.name) like '%dow jones%'
        then 'paid_required'
      when lower(source.name) like '%reddit%'
        or lower(source.name) like '%stocktwits%'
        or lower(source.name) like '%share chat%'
        or lower(source.name) like '%advfn%'
        or lower(source.source_type) = 'social'
        then 'unknown'
      else 'open'
    end as derived_licence_status
  from public.intelligence_sources source
)
update public.intelligence_sources source
set
  tier = coalesce(source.tier, derived_source_values.derived_tier),
  access_method = coalesce(source.access_method, derived_source_values.derived_access_method),
  licence_status = coalesce(source.licence_status, derived_source_values.derived_licence_status),
  weighting_multiplier = case
    when source.weighting_multiplier is not null then source.weighting_multiplier
    when coalesce(source.tier, derived_source_values.derived_tier) = 1 then 1
    when coalesce(source.tier, derived_source_values.derived_tier) = 2 then 0.8
    when coalesce(source.tier, derived_source_values.derived_tier) = 3 then 0.55
    when coalesce(source.tier, derived_source_values.derived_tier) = 4 then 0.35
    when coalesce(source.tier, derived_source_values.derived_tier) = 5 then 0.15
    else 0.55
  end,
  can_create_alerts = case
    when coalesce(source.tier, derived_source_values.derived_tier) = 5 then false
    else true
  end,
  requires_primary_confirmation = case
    when coalesce(source.tier, derived_source_values.derived_tier) = 1 then false
    else true
  end
from derived_source_values
where source.id = derived_source_values.id;

update public.intelligence_items item
set
  source_tier = coalesce(item.source_tier, source.tier),
  weighting_multiplier = case
    when item.weighting_multiplier is not null then item.weighting_multiplier
    when source.tier = 1 then 1
    when source.tier = 2 then 0.8
    when source.tier = 3 then 0.55
    when source.tier = 4 then 0.35
    when source.tier = 5 then 0.15
    else 0.55
  end,
  signal_type = coalesce(
    item.signal_type,
    case
      when item.rumour_flag then 'rumour'
      when item.pump_risk_flag then 'pump_risk_warning'
      when source.tier = 1 then 'primary_evidence'
      when source.tier = 2 then 'confirming_news'
      when source.tier = 3 then 'aggregator_summary'
      when source.tier = 4 then 'press_release'
      when source.tier = 5 then 'social_attention'
      when item.classification = 'director_dealings' then 'primary_evidence'
      when item.classification = 'holdings_tr1' then 'confirming_news'
      when item.classification = 'trading_update' then 'confirming_news'
      when item.classification = 'final_results' then 'primary_evidence'
      else 'other'
    end
  ),
  primary_confirmation_required = case
    when source.tier = 1 then false
    else true
  end,
  confirmed_by_primary_source = case
    when source.tier = 1 then true
    else false
  end,
  rumour_flag = coalesce(item.rumour_flag, false),
  pump_risk_flag = coalesce(item.pump_risk_flag, false)
from public.intelligence_sources source
where source.id = item.source_id;

update public.intelligence_items
set
  signal_type = coalesce(signal_type, 'other'),
  source_tier = coalesce(source_tier, 3),
  weighting_multiplier = coalesce(weighting_multiplier, 0.55),
  primary_confirmation_required = coalesce(primary_confirmation_required, true),
  confirmed_by_primary_source = coalesce(confirmed_by_primary_source, false),
  rumour_flag = coalesce(rumour_flag, false),
  pump_risk_flag = coalesce(pump_risk_flag, false)
where signal_type is null
   or source_tier is null
   or weighting_multiplier is null;
