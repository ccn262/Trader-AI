create table if not exists public.raw_announcements (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.intelligence_sources(id) on delete set null,
  external_id text,
  asset_symbol text,
  company_name text,
  headline text not null,
  announcement_type text,
  raw_category text,
  source_url text,
  published_at timestamptz,
  raw_payload jsonb,
  ingestion_status text not null default 'new' check (
    ingestion_status in ('new', 'parsed', 'ignored', 'failed')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.intelligence_items
  add column if not exists raw_announcement_id uuid references public.raw_announcements(id) on delete set null;

create index if not exists idx_raw_announcements_asset_symbol
  on public.raw_announcements(asset_symbol);

create index if not exists idx_raw_announcements_published_at
  on public.raw_announcements(published_at desc);

create index if not exists idx_raw_announcements_announcement_type
  on public.raw_announcements(announcement_type);

create index if not exists idx_raw_announcements_source_id
  on public.raw_announcements(source_id);

create unique index if not exists idx_raw_announcements_source_external_unique
  on public.raw_announcements(source_id, external_id)
  where external_id is not null;

create index if not exists idx_intelligence_items_raw_announcement_id
  on public.intelligence_items(raw_announcement_id);

insert into public.intelligence_sources (
  id,
  name,
  source_type,
  base_url,
  confidence_score,
  is_active,
  notes,
  created_at
) values (
  '3dbfbf7f-ae35-48a4-a9fd-3d1de09a6fd9',
  'London Stock Exchange RNS',
  'rns',
  'https://www.londonstockexchange.com/news',
  95,
  true,
  'Primary official UK company announcement source used for RNS-style ingestion.',
  '2026-06-02T06:00:00Z'
)
on conflict (id) do update set
  name = excluded.name,
  source_type = excluded.source_type,
  base_url = excluded.base_url,
  confidence_score = excluded.confidence_score,
  is_active = excluded.is_active,
  notes = excluded.notes;

insert into public.raw_announcements (
  id,
  source_id,
  external_id,
  asset_symbol,
  company_name,
  headline,
  announcement_type,
  raw_category,
  source_url,
  published_at,
  raw_payload,
  ingestion_status,
  created_at,
  updated_at
) values
  (
    '228ea55e-c6db-4afb-9771-8749b40ca7ea',
    '3dbfbf7f-ae35-48a4-a9fd-3d1de09a6fd9',
    'RNS-20260602-RR-FINAL',
    'RR.L',
    'Rolls-Royce Holdings plc',
    'Final Results for the year ended 31 December 2025',
    'final_results',
    'Results',
    'https://www.londonstockexchange.com/news-article/RR./final-results/000001',
    '2026-06-02T07:05:00Z',
    '{"headline":"Final Results for the year ended 31 December 2025","category":"Results","summary":"Cash generation improved and guidance was reiterated."}'::jsonb,
    'parsed',
    '2026-06-02T07:05:00Z',
    '2026-06-02T07:05:00Z'
  ),
  (
    '9f176b49-b475-4e91-a61d-9645e193f444',
    '3dbfbf7f-ae35-48a4-a9fd-3d1de09a6fd9',
    'RNS-20260602-ITM-TRADING',
    'ITM.L',
    'ITM Power plc',
    'Trading Update and revised full-year expectations',
    'trading_update',
    'Trading Update',
    'https://www.londonstockexchange.com/news-article/ITM/trading-update/000002',
    '2026-06-02T07:12:00Z',
    '{"headline":"Trading Update and revised full-year expectations","category":"Trading Update","summary":"Conversion timing slipped and near-term expectations were reset."}'::jsonb,
    'parsed',
    '2026-06-02T07:12:00Z',
    '2026-06-02T07:12:00Z'
  ),
  (
    'f53f40ca-1500-4a08-a5bf-ef60c9050e8c',
    '3dbfbf7f-ae35-48a4-a9fd-3d1de09a6fd9',
    'RNS-20260602-BARC-DD',
    'BARC.L',
    'Barclays plc',
    'Director/PDMR Shareholding',
    'director_dealings',
    'Director Dealings',
    'https://www.londonstockexchange.com/news-article/BARC/director-pdmr-shareholding/000003',
    '2026-06-02T07:18:00Z',
    '{"headline":"Director/PDMR Shareholding","category":"Director Dealings","summary":"A director disclosed a modest open-market purchase."}'::jsonb,
    'parsed',
    '2026-06-02T07:18:00Z',
    '2026-06-02T07:18:00Z'
  ),
  (
    '82805cb9-6ec9-4444-940e-f2776567ed42',
    '3dbfbf7f-ae35-48a4-a9fd-3d1de09a6fd9',
    'RNS-20260602-SOLG-DRILL',
    'SOLG',
    'SolGold plc',
    'Cascabel drilling update reports additional mineralisation',
    'drill_results',
    'Exploration Update',
    'https://www.londonstockexchange.com/news-article/SOLG/drilling-update/000004',
    '2026-06-02T07:25:00Z',
    '{"headline":"Cascabel drilling update reports additional mineralisation","category":"Exploration Update","summary":"The announcement referenced follow-up drilling and extended mineralisation."}'::jsonb,
    'parsed',
    '2026-06-02T07:25:00Z',
    '2026-06-02T07:25:00Z'
  ),
  (
    '8b540b03-3be0-499e-8679-57ce6769198d',
    '3dbfbf7f-ae35-48a4-a9fd-3d1de09a6fd9',
    'RNS-20260602-AAL-PLACING',
    'AAL.L',
    'Anglesey Mining plc',
    'Placing and Subscription to support project funding',
    'placing_fundraising',
    'Fundraising',
    'https://www.londonstockexchange.com/news-article/AAL/placing-and-subscription/000005',
    '2026-06-02T07:31:00Z',
    '{"headline":"Placing and Subscription to support project funding","category":"Fundraising","summary":"The company announced a placing to extend project runway."}'::jsonb,
    'parsed',
    '2026-06-02T07:31:00Z',
    '2026-06-02T07:31:00Z'
  ),
  (
    '24a74cb5-3bdb-47fe-901d-46f0ce114784',
    '3dbfbf7f-ae35-48a4-a9fd-3d1de09a6fd9',
    'RNS-20260602-XYZ-GOINGCONCERN',
    'XYZ.L',
    'Example Resources plc',
    'Going concern statement and financing update',
    'going_concern_warning',
    'Financing Update',
    'https://www.londonstockexchange.com/news-article/XYZ/going-concern-statement/000006',
    '2026-06-02T07:42:00Z',
    '{"headline":"Going concern statement and financing update","category":"Financing Update","summary":"Management disclosed material uncertainty around future funding."}'::jsonb,
    'parsed',
    '2026-06-02T07:42:00Z',
    '2026-06-02T07:42:00Z'
  )
on conflict (id) do nothing;

insert into public.intelligence_items (
  id,
  scan_run_id,
  source_id,
  raw_announcement_id,
  asset_symbol,
  headline,
  summary,
  item_type,
  source_url,
  published_at,
  source_confidence,
  verification_status,
  impact_score,
  created_at
) values
  (
    '98501058-4084-43ce-b011-9318be92a92b',
    '1b7f5fb7-8e69-4ccd-a8e7-9d0242052601',
    '3dbfbf7f-ae35-48a4-a9fd-3d1de09a6fd9',
    '228ea55e-c6db-4afb-9771-8749b40ca7ea',
    'RR.L',
    'Final Results for the year ended 31 December 2025',
    'Official final results announcement with improving cash generation and reiterated guidance. Evidence only, not an instruction.',
    'result',
    'https://www.londonstockexchange.com/news-article/RR./final-results/000001',
    '2026-06-02T07:05:00Z',
    95,
    'verified',
    82,
    '2026-06-02T07:05:30Z'
  ),
  (
    '69441d55-38bc-4e41-9cb3-09b31a657454',
    '1b7f5fb7-8e69-4ccd-a8e7-9d0242052601',
    '3dbfbf7f-ae35-48a4-a9fd-3d1de09a6fd9',
    '9f176b49-b475-4e91-a61d-9645e193f444',
    'ITM.L',
    'Trading Update and revised full-year expectations',
    'Official trading update indicating softer near-term expectations. Evidence for review and risk reassessment only.',
    'trading_update',
    'https://www.londonstockexchange.com/news-article/ITM/trading-update/000002',
    '2026-06-02T07:12:00Z',
    95,
    'verified',
    74,
    '2026-06-02T07:12:30Z'
  ),
  (
    '95b1cbb7-ff1b-4b43-b031-f5e635377f75',
    '1b7f5fb7-8e69-4ccd-a8e7-9d0242052601',
    '3dbfbf7f-ae35-48a4-a9fd-3d1de09a6fd9',
    'f53f40ca-1500-4a08-a5bf-ef60c9050e8c',
    'BARC.L',
    'Director/PDMR Shareholding',
    'Official director dealing disclosure. Useful context, but not a decision trigger by itself.',
    'other',
    'https://www.londonstockexchange.com/news-article/BARC/director-pdmr-shareholding/000003',
    '2026-06-02T07:18:00Z',
    95,
    'verified',
    38,
    '2026-06-02T07:18:30Z'
  ),
  (
    '093f58f6-26c1-493a-a027-c4ff2b06656d',
    '1b7f5fb7-8e69-4ccd-a8e7-9d0242052601',
    '3dbfbf7f-ae35-48a4-a9fd-3d1de09a6fd9',
    '82805cb9-6ec9-4444-940e-f2776567ed42',
    'SOLG',
    'Cascabel drilling update reports additional mineralisation',
    'Official exploration update with speculative mining risk. Requires stricter review discipline for smaller accounts.',
    'filing',
    'https://www.londonstockexchange.com/news-article/SOLG/drilling-update/000004',
    '2026-06-02T07:25:00Z',
    95,
    'partially_verified',
    67,
    '2026-06-02T07:25:30Z'
  ),
  (
    'db08a3af-93b3-4497-b961-6b7e8d280887',
    '1b7f5fb7-8e69-4ccd-a8e7-9d0242052601',
    '3dbfbf7f-ae35-48a4-a9fd-3d1de09a6fd9',
    '8b540b03-3be0-499e-8679-57ce6769198d',
    'AAL.L',
    'Placing and Subscription to support project funding',
    'Official fundraising announcement that raises dilution and financing-risk considerations.',
    'filing',
    'https://www.londonstockexchange.com/news-article/AAL/placing-and-subscription/000005',
    '2026-06-02T07:31:00Z',
    95,
    'verified',
    71,
    '2026-06-02T07:31:30Z'
  ),
  (
    '49d1af70-2c77-4d33-b4dd-13f9bc834593',
    '1b7f5fb7-8e69-4ccd-a8e7-9d0242052601',
    '3dbfbf7f-ae35-48a4-a9fd-3d1de09a6fd9',
    '24a74cb5-3bdb-47fe-901d-46f0ce114784',
    'XYZ.L',
    'Going concern statement and financing update',
    'Official going-concern warning that materially raises financing and solvency risk. Evidence for risk review only.',
    'other',
    'https://www.londonstockexchange.com/news-article/XYZ/going-concern-statement/000006',
    '2026-06-02T07:42:00Z',
    95,
    'verified',
    92,
    '2026-06-02T07:42:30Z'
  )
on conflict (id) do nothing;
