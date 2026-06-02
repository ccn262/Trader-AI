create table if not exists public.source_diagnostics (
  id uuid primary key default gen_random_uuid(),
  source_candidate_id uuid not null references public.source_candidates(id) on delete cascade,
  checked_url text not null,
  http_status integer not null default 0 check (http_status >= 0),
  content_type text not null default '',
  response_length integer not null default 0 check (response_length >= 0),
  page_title text,
  anchor_count integer not null default 0 check (anchor_count >= 0),
  likely_rns_href_count integer not null default 0 check (likely_rns_href_count >= 0),
  appears_javascript_rendered boolean not null default false,
  valid_external_urls_count integer not null default 0 check (valid_external_urls_count >= 0),
  rejected_urls_count integer not null default 0 check (rejected_urls_count >= 0),
  diagnostic_summary text not null,
  recommendation text not null,
  raw_sample jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_source_diagnostics_candidate_created_at
  on public.source_diagnostics(source_candidate_id, created_at desc);

create index if not exists idx_source_diagnostics_created_at
  on public.source_diagnostics(created_at desc);

alter table if exists public.source_candidates
  add column if not exists validation_owner text;

alter table if exists public.source_candidates
  add column if not exists validation_notes text;

alter table if exists public.source_candidates
  add column if not exists last_diagnostic_id uuid references public.source_diagnostics(id) on delete set null;

alter table if exists public.source_candidates
  add column if not exists validated_at timestamptz;

alter table if exists public.source_candidates
  add column if not exists rejected_at timestamptz;

insert into public.source_diagnostics (
  id,
  source_candidate_id,
  checked_url,
  http_status,
  content_type,
  response_length,
  page_title,
  anchor_count,
  likely_rns_href_count,
  appears_javascript_rendered,
  valid_external_urls_count,
  rejected_urls_count,
  diagnostic_summary,
  recommendation,
  raw_sample,
  created_at
) values
  (
    'f4d10a73-3f60-4cf6-bf0c-901f9a36f110',
    '58c7f2cf-7470-4f6f-b2da-42f5521f938d',
    'https://www.londonstockexchange.com/news',
    200,
    'text/html; charset=utf-8',
    54995,
    'London Stock Exchange | London Stock Exchange',
    0,
    0,
    true,
    0,
    0,
    'Reachable but JS-rendered; no extractable announcement links were exposed for a simple server fetch.',
    'manual_review_then_parser_rethink',
    '{"first20Hrefs":[],"note":"No hrefs surfaced in the fetched HTML."}'::jsonb,
    '2026-06-02T09:00:00Z'
  ),
  (
    '7cb9bb0f-94e8-4fa1-9b06-79cece6d21a1',
    'e7d6fd05-4a22-4e32-b9e2-4c5e5a5c1f11',
    'https://www.londonstockexchange.com/news',
    200,
    'text/html; charset=utf-8',
    54995,
    'London Stock Exchange | London Stock Exchange',
    0,
    0,
    true,
    0,
    0,
    'JS-rendered shell with no extractable announcement links; not suitable for a simple parser.',
    'unsuitable_for_simple_parser',
    '{"first20Hrefs":[],"note":"Diagnostic confirms the page should not be forced into scraping."}'::jsonb,
    '2026-06-02T09:15:00Z'
  ),
  (
    '74f4b8b2-1d89-45d0-8e11-2a4a8d3873d1',
    'c3f4bffd-00ec-4ab0-8b22-1e9de3f3a7a1',
    'https://example.com/investor-relations',
    200,
    'text/html; charset=utf-8',
    12842,
    'Investor Relations',
    12,
    2,
    false,
    2,
    0,
    'Manual-only issuer page with some announcement-style links, but coverage will vary by company.',
    'manual_only_future_candidate',
    '{"first20Hrefs":["/results.pdf","/webcast","/news"]}'::jsonb,
    '2026-06-02T09:10:00Z'
  ),
  (
    '7f3a3b3d-5f12-4d21-8c29-df7a4c6c2c10',
    'f5ed66ac-90de-4ee2-b42f-7b4ce7a0ce2c',
    'https://example.com/structured-feed',
    403,
    'text/html; charset=utf-8',
    2048,
    'Access denied',
    1,
    0,
    false,
    0,
    1,
    'Commercial provider candidate is gated and not available without a paid contract.',
    'paid_required',
    '{"first20Hrefs":["/pricing"],"note":"No accessible announcement feed is available in the mock example."}'::jsonb,
    '2026-06-02T09:12:00Z'
  ),
  (
    '6aa66f74-0e38-4e83-8d0a-7f4b80c4fb2e',
    'b3b0d3a1-7d59-4c6b-9a0b-06bfdf29c83a',
    'https://www.sec.gov/edgar/search/',
    200,
    'text/html; charset=utf-8',
    45210,
    'EDGAR Search',
    8,
    0,
    false,
    3,
    0,
    'Validated future source type for US filings with accessible structured search output.',
    'validated_future_source_type',
    '{"first20Hrefs":["/cgi-bin/browse-edgar?action=getcompany","/search"]}'::jsonb,
    '2026-06-02T09:20:00Z'
  )
on conflict (id) do nothing;

update public.source_candidates
set
  validation_owner = 'Manual review',
  validation_notes = 'The page is reachable but does not expose parseable anchors for a simple server fetch.',
  last_diagnostic_id = '7cb9bb0f-94e8-4fa1-9b06-79cece6d21a1',
  validated_at = null,
  rejected_at = '2026-06-02T09:15:00Z',
  last_checked_at = '2026-06-02T09:15:00Z'
where id = 'e7d6fd05-4a22-4e32-b9e2-4c5e5a5c1f11';

update public.source_candidates
set
  validation_owner = 'Manual review',
  validation_notes = 'Keep manual-first and re-evaluate after a parser strategy is defined.',
  last_diagnostic_id = 'f4d10a73-3f60-4cf6-bf0c-901f9a36f110',
  validated_at = null,
  rejected_at = null,
  last_checked_at = '2026-06-02T09:00:00Z'
where id = '58c7f2cf-7470-4f6f-b2da-42f5521f938d';

update public.source_candidates
set
  validation_owner = 'Manual review',
  validation_notes = 'Track as a manual-only candidate until issuer-by-issuer coverage is understood.',
  last_diagnostic_id = '74f4b8b2-1d89-45d0-8e11-2a4a8d3873d1',
  validated_at = null,
  rejected_at = null,
  last_checked_at = '2026-06-02T09:10:00Z'
where id = 'c3f4bffd-00ec-4ab0-8b22-1e9de3f3a7a1';

update public.source_candidates
set
  validation_owner = 'Research review',
  validation_notes = 'Paid provider candidate only. Do not assume commercial access until procurement is confirmed.',
  last_diagnostic_id = '7f3a3b3d-5f12-4d21-8c29-df7a4c6c2c10',
  validated_at = null,
  rejected_at = null,
  last_checked_at = '2026-06-02T09:12:00Z'
where id = 'f5ed66ac-90de-4ee2-b42f-7b4ce7a0ce2c';

update public.source_candidates
set
  validation_owner = 'Research review',
  validation_notes = 'Validated future source type for US disclosures; not part of the current ingestion scope.',
  last_diagnostic_id = '6aa66f74-0e38-4e83-8d0a-7f4b80c4fb2e',
  validated_at = '2026-06-02T09:20:00Z',
  rejected_at = null,
  last_checked_at = '2026-06-02T09:20:00Z'
where id = 'b3b0d3a1-7d59-4c6b-9a0b-06bfdf29c83a';

