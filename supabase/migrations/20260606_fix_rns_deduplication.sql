create unique index if not exists idx_raw_announcements_source_external_unique
  on public.raw_announcements(source_id, external_id)
  where external_id is not null;

create unique index if not exists idx_raw_announcements_source_url_unique
  on public.raw_announcements(source_id, source_url)
  where source_url is not null;

create index if not exists idx_raw_announcements_source_asset_headline_published
  on public.raw_announcements(source_id, asset_symbol, headline, published_at);

create unique index if not exists idx_intelligence_items_raw_announcement_unique
  on public.intelligence_items(raw_announcement_id)
  where raw_announcement_id is not null;

create index if not exists idx_intelligence_items_source_asset_headline_published
  on public.intelligence_items(source_id, asset_symbol, headline, published_at);
