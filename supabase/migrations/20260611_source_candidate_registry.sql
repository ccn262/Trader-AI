create table if not exists public.source_candidates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source_type text not null,
  url text,
  access_method text not null check (
    access_method in (
      'rss',
      'api',
      'html',
      'js_rendered',
      'manual',
      'paid_provider'
    )
  ),
  status text not null check (
    status in (
      'candidate',
      'validating',
      'validated',
      'rejected',
      'paid_required',
      'manual_only'
    )
  ),
  confidence_score integer not null default 0 check (
    confidence_score between 0 and 100
  ),
  diagnostic_status text,
  diagnostic_summary text,
  last_checked_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_source_candidates_status
  on public.source_candidates(status);

create index if not exists idx_source_candidates_source_type
  on public.source_candidates(source_type);

create index if not exists idx_source_candidates_access_method
  on public.source_candidates(access_method);

insert into public.source_candidates (
  id,
  name,
  source_type,
  url,
  access_method,
  status,
  confidence_score,
  diagnostic_status,
  diagnostic_summary,
  last_checked_at,
  notes,
  created_at,
  updated_at
) values
  (
    'e7d6fd05-4a22-4e32-b9e2-4c5e5a5c1f11',
    'London Stock Exchange News',
    'rns',
    'https://www.londonstockexchange.com/news',
    'js_rendered',
    'rejected',
    60,
    'not_suitable_for_simple_parser',
    'HTTP 200, title present, anchorCount 0, likelyRnsHrefCount 0, appearsJavaScriptRendered true',
    '2026-06-02T09:15:00Z',
    'Reachable but not suitable for simple server-side parsing. Keep as a diagnostic reference only.',
    '2026-06-11T00:00:00Z',
    '2026-06-11T00:00:00Z'
  ),
  (
    '58c7f2cf-7470-4f6f-b2da-42f5521f938d',
    'London Stock Exchange RNS/company announcements candidate',
    'rns',
    'https://www.londonstockexchange.com/news',
    'js_rendered',
    'validating',
    70,
    'diagnostic_required',
    'Candidate source tracked for future parser work; requires manual validation before any ingestion change.',
    null,
    'Keep manual-first. Do not force scraping or unattended crawling.',
    '2026-06-11T00:00:00Z',
    '2026-06-11T00:00:00Z'
  ),
  (
    'c3f4bffd-00ec-4ab0-8b22-1e9de3f3a7a1',
    'Company investor relations pages',
    'company_ir',
    null,
    'manual',
    'manual_only',
    85,
    'future_candidate_category',
    'Official issuer pages are useful for manual review and future validation, but coverage and formatting vary by company.',
    null,
    'Track as a future source category rather than a single parse target.',
    '2026-06-11T00:00:00Z',
    '2026-06-11T00:00:00Z'
  ),
  (
    'f5ed66ac-90de-4ee2-b42f-7b4ce7a0ce2c',
    'Paid structured provider',
    'provider',
    null,
    'paid_provider',
    'paid_required',
    90,
    'commercial_access_required',
    'A structured feed or API may be useful later, but access is commercial and should not be assumed available.',
    null,
    'Future option only; do not build around unavailable commercial access.',
    '2026-06-11T00:00:00Z',
    '2026-06-11T00:00:00Z'
  ),
  (
    'b3b0d3a1-7d59-4c6b-9a0b-06bfdf29c83a',
    'SEC filings',
    'sec',
    'https://www.sec.gov/edgar/search/',
    'api',
    'validated',
    95,
    'validated_future_source_type',
    'Validated future source type for US filings if a US source path is later required.',
    null,
    'High-confidence future source class for US disclosures.',
    '2026-06-11T00:00:00Z',
    '2026-06-11T00:00:00Z'
  )
on conflict (id) do update set
  name = excluded.name,
  source_type = excluded.source_type,
  url = excluded.url,
  access_method = excluded.access_method,
  status = excluded.status,
  confidence_score = excluded.confidence_score,
  diagnostic_status = excluded.diagnostic_status,
  diagnostic_summary = excluded.diagnostic_summary,
  last_checked_at = excluded.last_checked_at,
  notes = excluded.notes,
  updated_at = excluded.updated_at;

