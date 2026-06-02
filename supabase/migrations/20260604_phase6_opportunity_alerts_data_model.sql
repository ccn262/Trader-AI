create table if not exists public.scan_runs (
  id uuid primary key default gen_random_uuid(),
  scan_type text not null check (scan_type in ('morning', 'evening', 'manual')),
  status text not null check (status in ('pending', 'running', 'completed', 'failed')),
  started_at timestamptz,
  completed_at timestamptz,
  summary text,
  market_health_score numeric(5,2) check (market_health_score is null or (market_health_score >= 0 and market_health_score <= 100)),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.intelligence_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source_type text not null check (
    source_type in (
      'company_filing',
      'rns',
      'sec',
      'market_data',
      'news',
      'government',
      'analyst',
      'social',
      'other'
    )
  ),
  base_url text,
  confidence_score integer not null check (confidence_score >= 0 and confidence_score <= 100),
  is_active boolean not null default true,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.intelligence_items (
  id uuid primary key default gen_random_uuid(),
  scan_run_id uuid references public.scan_runs(id) on delete set null,
  source_id uuid references public.intelligence_sources(id) on delete set null,
  asset_symbol text,
  headline text not null,
  summary text,
  item_type text not null check (
    item_type in (
      'filing',
      'result',
      'trading_update',
      'earnings',
      'price_move',
      'volume_move',
      'sector_news',
      'social_signal',
      'other'
    )
  ),
  source_url text,
  published_at timestamptz,
  source_confidence integer check (source_confidence is null or (source_confidence >= 0 and source_confidence <= 100)),
  verification_status text not null default 'unverified' check (
    verification_status in ('unverified', 'partially_verified', 'verified', 'disputed')
  ),
  impact_score integer check (impact_score is null or (impact_score >= 0 and impact_score <= 100)),
  created_at timestamptz not null default now()
);

create table if not exists public.opportunity_alerts (
  id uuid primary key default gen_random_uuid(),
  scan_run_id uuid references public.scan_runs(id) on delete set null,
  asset_symbol text not null,
  asset_name text not null,
  market text,
  opportunity_type text not null check (
    opportunity_type in (
      'long_term_investment',
      'swing_trade',
      'penny_share_catalyst',
      'mining_resource_catalyst',
      'earnings_momentum',
      'special_situation',
      'etf_sector_rotation'
    )
  ),
  priority text not null check (
    priority in (
      'high_priority_review',
      'watch_today',
      'monitor_only',
      'speculative_review'
    )
  ),
  catalyst_summary text not null,
  score integer not null check (score >= 0 and score <= 100),
  source_confidence integer check (source_confidence is null or (source_confidence >= 0 and source_confidence <= 100)),
  risk_level text,
  suggested_position_min numeric(12,2),
  suggested_position_max numeric(12,2),
  suggested_hold_timeframe text,
  exit_plan text,
  risk_warning text,
  review_status text not null default 'new' check (
    review_status in ('new', 'reviewed', 'ignored', 'archived')
  ),
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists public.opportunity_evidence (
  id uuid primary key default gen_random_uuid(),
  opportunity_alert_id uuid not null references public.opportunity_alerts(id) on delete cascade,
  intelligence_item_id uuid references public.intelligence_items(id) on delete set null,
  evidence_label text not null,
  evidence_summary text,
  source_url text,
  confidence_score integer check (confidence_score is null or (confidence_score >= 0 and confidence_score <= 100)),
  created_at timestamptz not null default now()
);

create table if not exists public.score_history (
  id uuid primary key default gen_random_uuid(),
  asset_symbol text not null,
  score_type text not null check (
    score_type in ('watchlist', 'opportunity', 'risk', 'market_health')
  ),
  score numeric(6,2) not null,
  previous_score numeric(6,2),
  score_delta numeric(6,2),
  reason text,
  calculated_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_scan_runs_scan_type_created_at
  on public.scan_runs(scan_type, created_at desc);

create index if not exists idx_intelligence_items_scan_run_id
  on public.intelligence_items(scan_run_id);

create index if not exists idx_intelligence_items_asset_symbol
  on public.intelligence_items(asset_symbol);

create index if not exists idx_opportunity_alerts_scan_run_id
  on public.opportunity_alerts(scan_run_id);

create index if not exists idx_opportunity_alerts_asset_symbol
  on public.opportunity_alerts(asset_symbol);

create index if not exists idx_opportunity_alerts_priority_review_status
  on public.opportunity_alerts(priority, review_status, archived);

create index if not exists idx_opportunity_evidence_alert_id
  on public.opportunity_evidence(opportunity_alert_id);

create index if not exists idx_score_history_asset_symbol_type
  on public.score_history(asset_symbol, score_type, calculated_at desc);

insert into public.scan_runs (
  id,
  scan_type,
  status,
  started_at,
  completed_at,
  summary,
  market_health_score,
  notes,
  created_at
) values
  (
    '1b7f5fb7-8e69-4ccd-a8e7-9d0242052601',
    'morning',
    'completed',
    '2026-06-02T07:00:00Z',
    '2026-06-02T07:12:00Z',
    'Fresh filings, sector leadership, and a mining catalyst produced a focused review list for the morning.',
    68,
    'Review opportunities only. Manual decisions remain outside the app.',
    '2026-06-02T07:12:00Z'
  ),
  (
    '5bb1327b-3f89-4d19-aad8-3384d58f7c27',
    'evening',
    'completed',
    '2026-06-02T16:35:00Z',
    '2026-06-02T16:48:00Z',
    'The evening scan favored follow-up on momentum, sector rotation, and event-driven review items.',
    61,
    'Evening output remains review-only and should not be treated as execution guidance.',
    '2026-06-02T16:48:00Z'
  )
on conflict (id) do nothing;

insert into public.intelligence_sources (
  id,
  name,
  source_type,
  base_url,
  confidence_score,
  is_active,
  notes,
  created_at
) values
  (
    '3dbfbf7f-ae35-48a4-a9fd-3d1de09a6fd9',
    'London Stock Exchange RNS',
    'rns',
    'https://www.londonstockexchange.com/news',
    95,
    true,
    'Primary UK company announcement source.',
    '2026-06-02T06:00:00Z'
  ),
  (
    '264221f9-e8ba-493c-b65c-8ea9f8d85f0f',
    'Microsoft Investor Relations',
    'company_filing',
    'https://www.microsoft.com/en-us/Investor',
    100,
    true,
    'Official investor relations source for earnings and guidance.',
    '2026-06-02T06:00:00Z'
  ),
  (
    'cae3ee49-6d06-455a-bdcc-ecdf3dcb2bb2',
    'NASDAQ Market Data',
    'market_data',
    'https://www.nasdaq.com',
    82,
    true,
    'Reference market data source for price and volume context.',
    '2026-06-02T06:00:00Z'
  ),
  (
    'c77cf520-0711-4f61-a196-17d4e8cf8b47',
    'SPDR ETF Research',
    'company_filing',
    'https://www.ssga.com',
    88,
    true,
    'ETF provider material used for sector rotation context.',
    '2026-06-02T06:00:00Z'
  ),
  (
    '4bde8488-b4ee-4bf8-abed-62b5a56f6081',
    'Community Chatter',
    'social',
    'https://example.com/social',
    40,
    true,
    'Low-confidence social sentiment tracker. Needs corroboration.',
    '2026-06-02T06:00:00Z'
  )
on conflict (id) do nothing;

insert into public.intelligence_items (
  id,
  scan_run_id,
  source_id,
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
    '2517c89f-ce0b-4d2b-a8e2-e55f1a5603f2',
    '1b7f5fb7-8e69-4ccd-a8e7-9d0242052601',
    '264221f9-e8ba-493c-b65c-8ea9f8d85f0f',
    'MSFT',
    'Official guidance commentary supports a renewed review',
    'Investor relations material kept the evidence quality high enough for a review-only momentum card.',
    'earnings',
    'https://www.microsoft.com/en-us/Investor/earnings',
    '2026-06-02T06:45:00Z',
    100,
    'verified',
    84,
    '2026-06-02T06:45:00Z'
  ),
  (
    'd9e2d54c-c7fa-4165-9b65-6d18314a0943',
    '1b7f5fb7-8e69-4ccd-a8e7-9d0242052601',
    '3dbfbf7f-ae35-48a4-a9fd-3d1de09a6fd9',
    'SOLG',
    'RNS drilling commentary increased review interest',
    'The RNS raised a speculative catalyst worth reviewing, but financing risk and liquidity remain elevated.',
    'filing',
    'https://www.londonstockexchange.com/news-article/solg/update',
    '2026-06-02T07:02:00Z',
    95,
    'partially_verified',
    63,
    '2026-06-02T07:02:00Z'
  ),
  (
    'a8e50a1e-3d4b-4977-84db-35150a6481d8',
    '1b7f5fb7-8e69-4ccd-a8e7-9d0242052601',
    'cae3ee49-6d06-455a-bdcc-ecdf3dcb2bb2',
    'VWRP',
    'Broad market breadth remained constructive',
    'ETF breadth and allocation context remained stable enough to support a calm long-term review item.',
    'sector_news',
    'https://www.nasdaq.com/market-activity',
    '2026-06-02T06:30:00Z',
    82,
    'verified',
    71,
    '2026-06-02T06:30:00Z'
  ),
  (
    'bb207b98-52ef-40c5-bcb6-5247cf518ffb',
    '5bb1327b-3f89-4d19-aad8-3384d58f7c27',
    'c77cf520-0711-4f61-a196-17d4e8cf8b47',
    'XLK',
    'Sector leadership remained intact into the close',
    'ETF rotation evidence stayed constructive enough for a monitor-only sector review.',
    'sector_news',
    'https://www.ssga.com/us/en/intermediary/etfs/funds/xlk',
    '2026-06-02T16:20:00Z',
    88,
    'verified',
    69,
    '2026-06-02T16:20:00Z'
  ),
  (
    '4c0cd640-8871-478c-a806-e44d991cf00a',
    '5bb1327b-3f89-4d19-aad8-3384d58f7c27',
    'cae3ee49-6d06-455a-bdcc-ecdf3dcb2bb2',
    'NVDA',
    'Momentum and relative volume stayed elevated',
    'Price and volume context kept the setup on watch, but the signal remained review-only.',
    'volume_move',
    'https://www.nasdaq.com/market-activity/stocks/nvda',
    '2026-06-02T16:32:00Z',
    82,
    'verified',
    77,
    '2026-06-02T16:32:00Z'
  ),
  (
    '7bf2b9cb-e363-490c-b355-43356054f3c8',
    '1b7f5fb7-8e69-4ccd-a8e7-9d0242052601',
    '4bde8488-b4ee-4bf8-abed-62b5a56f6081',
    'PLTR',
    'Narrative attention increased without enough high-confidence confirmation',
    'Social chatter lifted interest but did not justify strong action language or aggressive scoring.',
    'social_signal',
    'https://example.com/social/pltr',
    '2026-06-02T06:50:00Z',
    40,
    'unverified',
    35,
    '2026-06-02T06:50:00Z'
  )
on conflict (id) do nothing;

insert into public.opportunity_alerts (
  id,
  scan_run_id,
  asset_symbol,
  asset_name,
  market,
  opportunity_type,
  priority,
  catalyst_summary,
  score,
  source_confidence,
  risk_level,
  suggested_position_min,
  suggested_position_max,
  suggested_hold_timeframe,
  exit_plan,
  risk_warning,
  review_status,
  archived,
  created_at,
  reviewed_at
) values
  (
    '4e75acd7-0c72-48a0-ab88-a97957035758',
    '1b7f5fb7-8e69-4ccd-a8e7-9d0242052601',
    'VWRP',
    'Vanguard FTSE All-World UCITS ETF',
    'LSE',
    'long_term_investment',
    'high_priority_review',
    'Core allocation evidence stayed stable, making this worth reviewing for long-term portfolio fit.',
    84,
    92,
    'low',
    10,
    20,
    'Weeks to months',
    'Reassess if allocation discipline slips or the long-term thesis changes materially.',
    'Market risk remains present even in a calmer core holding.',
    'new',
    false,
    '2026-06-02T07:13:00Z',
    null
  ),
  (
    'e9876f36-e0be-4855-a629-738f5f4d11d5',
    '1b7f5fb7-8e69-4ccd-a8e7-9d0242052601',
    'SOLG',
    'SolGold plc',
    'AIM',
    'mining_resource_catalyst',
    'speculative_review',
    'A fresh mining catalyst is worth reviewing, but only with strict skepticism about liquidity and funding.',
    49,
    44,
    'speculative',
    1,
    3,
    'Catalyst window only',
    'Reassess if follow-up RNS detail weakens or financing risk rises.',
    'Thin liquidity and financing risk make this unsuitable for oversized positions.',
    'new',
    false,
    '2026-06-02T07:14:00Z',
    null
  ),
  (
    'f72718fb-85cd-47df-bcd8-60cb6ef2530b',
    '5bb1327b-3f89-4d19-aad8-3384d58f7c27',
    'XLK',
    'Technology Select Sector SPDR Fund',
    'NYSE',
    'etf_sector_rotation',
    'monitor_only',
    'Sector rotation evidence suggests a monitor-only review for continued leadership.',
    71,
    81,
    'low',
    5,
    12,
    'Weeks to months',
    'Reassess if leadership fades or macro conditions rotate away from growth.',
    'Sector leadership can reverse quickly if risk appetite weakens.',
    'new',
    false,
    '2026-06-02T16:49:00Z',
    null
  ),
  (
    '9b29f217-f365-4e75-9fe9-4c8e19f7d2a3',
    '5bb1327b-3f89-4d19-aad8-3384d58f7c27',
    'NVDA',
    'NVIDIA Corporation',
    'NASDAQ',
    'swing_trade',
    'watch_today',
    'Momentum and relative volume kept the setup on the watch list for manual review.',
    74,
    76,
    'high',
    5,
    10,
    'Days to weeks',
    'Reassess if volume weakens or the trend structure breaks.',
    'Volatility is elevated and smaller accounts should stay disciplined.',
    'new',
    false,
    '2026-06-02T16:50:00Z',
    null
  ),
  (
    '0e3a1c05-6aae-4fb4-a7d4-25f53997ef7c',
    '1b7f5fb7-8e69-4ccd-a8e7-9d0242052601',
    'MSFT',
    'Microsoft Corporation',
    'NASDAQ',
    'earnings_momentum',
    'high_priority_review',
    'Official earnings context may justify a renewed review of the current setup.',
    79,
    88,
    'medium',
    5,
    15,
    'Days to weeks',
    'Reassess after earnings follow-through or if momentum fades.',
    'Post-earnings moves can reverse quickly if the market disagrees.',
    'new',
    false,
    '2026-06-02T07:15:00Z',
    null
  )
on conflict (id) do nothing;

insert into public.opportunity_evidence (
  id,
  opportunity_alert_id,
  intelligence_item_id,
  evidence_label,
  evidence_summary,
  source_url,
  confidence_score,
  created_at
) values
  (
    'f8dcedd8-2b77-4367-888d-4ce144f02544',
    '4e75acd7-0c72-48a0-ab88-a97957035758',
    'a8e50a1e-3d4b-4977-84db-35150a6481d8',
    'Allocation review',
    'Global allocation remained aligned with a low-drama core holding plan.',
    'https://www.nasdaq.com/market-activity',
    82,
    '2026-06-02T07:13:30Z'
  ),
  (
    '71d4896a-133a-47cf-86eb-f45227000c77',
    '0e3a1c05-6aae-4fb4-a7d4-25f53997ef7c',
    '2517c89f-ce0b-4d2b-a8e2-e55f1a5603f2',
    'Official earnings context',
    'Verified IR commentary raised review confidence without turning into execution language.',
    'https://www.microsoft.com/en-us/Investor/earnings',
    100,
    '2026-06-02T07:15:30Z'
  ),
  (
    'f53d1178-88fd-4111-a471-d4e2b77df6b8',
    '9b29f217-f365-4e75-9fe9-4c8e19f7d2a3',
    '4c0cd640-8871-478c-a806-e44d991cf00a',
    'Relative volume',
    'Volume expansion kept the setup on watch for manual review.',
    'https://www.nasdaq.com/market-activity/stocks/nvda',
    82,
    '2026-06-02T16:50:30Z'
  ),
  (
    'd6f00b92-fb94-4514-b5a8-46d2e264d5ca',
    'f72718fb-85cd-47df-bcd8-60cb6ef2530b',
    'bb207b98-52ef-40c5-bcb6-5247cf518ffb',
    'Sector leadership',
    'ETF relative strength remained constructive into the close.',
    'https://www.ssga.com/us/en/intermediary/etfs/funds/xlk',
    88,
    '2026-06-02T16:49:30Z'
  ),
  (
    '72c0a8a4-980d-4b6e-a366-fd9055e3b0cd',
    'e9876f36-e0be-4855-a629-738f5f4d11d5',
    'd9e2d54c-c7fa-4165-9b65-6d18314a0943',
    'RNS catalyst',
    'The RNS raised interest, but the follow-up still needs careful verification.',
    'https://www.londonstockexchange.com/news-article/solg/update',
    95,
    '2026-06-02T07:14:30Z'
  )
on conflict (id) do nothing;

insert into public.score_history (
  id,
  asset_symbol,
  score_type,
  score,
  previous_score,
  score_delta,
  reason,
  calculated_at,
  created_at
) values
  (
    '4f3dcfd8-79e8-4f53-9a39-ae2964af7bc0',
    'MORNING',
    'market_health',
    68,
    64,
    4,
    'Breadth and risk appetite improved modestly into the morning review.',
    '2026-06-02T07:12:00Z',
    '2026-06-02T07:12:00Z'
  ),
  (
    '4443393f-ed25-4a32-ba7f-b6c8f5f2d4c2',
    'EVENING',
    'market_health',
    61,
    68,
    -7,
    'Evening breadth softened and reduced the market health reading.',
    '2026-06-02T16:48:00Z',
    '2026-06-02T16:48:00Z'
  ),
  (
    'a950884f-531f-44c8-8022-e8c0d9104695',
    'MSFT',
    'opportunity',
    79,
    73,
    6,
    'Verified earnings context increased review confidence.',
    '2026-06-02T07:15:00Z',
    '2026-06-02T07:15:00Z'
  ),
  (
    '174e0302-8d09-41f8-8d0f-48436558f0e4',
    'SOLG',
    'risk',
    72,
    66,
    6,
    'Financing and liquidity risk remain elevated around the catalyst window.',
    '2026-06-02T07:14:00Z',
    '2026-06-02T07:14:00Z'
  ),
  (
    '826d68ed-7607-48f6-b1cf-b50411ec3efd',
    'XLK',
    'watchlist',
    71,
    67,
    4,
    'Sector leadership and ETF flow context improved the review case.',
    '2026-06-02T16:49:00Z',
    '2026-06-02T16:49:00Z'
  )
on conflict (id) do nothing;
