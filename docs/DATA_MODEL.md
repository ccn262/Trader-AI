# Supabase Data Model - Trader AI

## Tables

### profiles

Stores user profile data.

Columns:

- id uuid primary key references auth.users(id)
- display_name text
- base_currency text default 'GBP'
- beginner_mode boolean default true
- created_at timestamptz default now()

### watchlists

Columns:

- id uuid primary key default gen_random_uuid()
- user_id uuid references profiles(id)
- name text not null
- description text
- risk_profile text check in ('low','medium','high','speculative')
- created_at timestamptz default now()
- updated_at timestamptz default now()

### assets

Columns:

- id uuid primary key default gen_random_uuid()
- user_id uuid references profiles(id)
- ticker text not null
- name text not null
- market text
- asset_type text check in ('etf','stock','fund','cash','other')
- currency text default 'GBP'
- risk_level text check in ('low','medium','high','speculative')
- status text check in ('research','watch','buy_zone','hold','wait','avoid') default 'research'
- notes text
- created_at timestamptz default now()
- updated_at timestamptz default now()

### watchlist_assets

Many-to-many link between watchlists and assets.

Columns:

- id uuid primary key default gen_random_uuid()
- watchlist_id uuid references watchlists(id) on delete cascade
- asset_id uuid references assets(id) on delete cascade
- added_at timestamptz default now()

### ai_scores

Columns:

- id uuid primary key default gen_random_uuid()
- asset_id uuid references assets(id) on delete cascade
- user_id uuid references profiles(id)
- trend_score int check 0-20
- sentiment_score int check 0-20
- quality_score int check 0-20
- valuation_risk_score int check 0-20
- setup_score int check 0-20
- total_score int generated or calculated in app
- status_label text
- explanation text
- sources jsonb
- created_at timestamptz default now()

### portfolio_positions

Columns:

- id uuid primary key default gen_random_uuid()
- user_id uuid references profiles(id)
- asset_id uuid references assets(id)
- quantity numeric
- average_buy_price numeric
- current_price numeric
- currency text default 'GBP'
- account_type text check in ('isa','invest','other') default 'isa'
- strategy text check in ('core','swing','learning') default 'core'
- target_allocation numeric
- notes text
- created_at timestamptz default now()
- updated_at timestamptz default now()

### trade_journal

Columns:

- id uuid primary key default gen_random_uuid()
- user_id uuid references profiles(id)
- asset_id uuid references assets(id)
- action text check in ('buy','sell','trim','add','paper_trade')
- amount numeric not null
- entry_price numeric
- reason text not null
- risk_amount numeric not null
- stop_loss_idea text not null
- target_or_review_trigger text
- review_date date not null
- emotion_before text
- result text
- lesson_learned text
- created_at timestamptz default now()
- updated_at timestamptz default now()

### alerts

Columns:

- id uuid primary key default gen_random_uuid()
- user_id uuid references profiles(id)
- asset_id uuid references assets(id)
- alert_type text check in ('price_above','price_below','score_above','review_due','news','earnings','manual')
- threshold_value numeric
- message text
- due_at timestamptz
- is_active boolean default true
- triggered_at timestamptz
- created_at timestamptz default now()

### research_notes

Columns:

- id uuid primary key default gen_random_uuid()
- user_id uuid references profiles(id)
- asset_id uuid references assets(id)
- title text
- body text not null
- source_type text check in ('manual','ai','news','filing','other') default 'manual'
- confidence text check in ('low','medium','high') default 'medium'
- created_at timestamptz default now()

## Row level security

Enable RLS on all user-owned tables.

Basic policy:

- Users can select, insert, update, and delete rows where `user_id = auth.uid()`.

## MVP data approach

Start manual-first. Do not integrate live market APIs until the UI, journal, and scoring workflow are stable.
