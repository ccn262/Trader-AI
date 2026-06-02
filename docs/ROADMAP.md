# Roadmap - Trader AI

## Phase 0 - Project setup

- Initialise Next.js with TypeScript.
- Add Tailwind.
- Add basic layout and mobile navigation.
- Connect GitHub and Vercel.
- Create Supabase project.
- Add environment variable templates.

## Phase 1 - Static prototype

- Build Dashboard UI with mock data.
- Build Watchlists UI with mock data.
- Build Asset Detail UI with mock data.
- Build Portfolio UI with mock data.
- Build Journal UI with mock data.
- Build Alerts UI with mock data.

Goal: validate UX before backend complexity.

## Phase 2 - Supabase schema

- Create tables.
- Enable RLS.
- Add seed data.
- Connect app to Supabase.
- Replace mock data with real CRUD.

## Phase 3 - Core workflows

- Add/edit/delete watchlists.
- Add/edit/delete assets.
- Assign assets to watchlists.
- Add portfolio positions.
- Add trade journal entries with required guardrails.
- Add manual alerts.

## Phase 4 - AI scoring placeholder

- Add scorecard form.
- Manually enter component scores.
- Calculate total score.
- Generate status labels.
- Store explanation text.

## Phase 5 - Research assistant

- Add research note generation.
- Add prompt templates.
- Add source fields.
- Keep AI output framed as decision support.

## Phase 6 - Market data integration

Only after manual MVP is stable.

Possible data sources:

- Alpha Vantage
- Twelve Data
- Financial Modeling Prep
- Yahoo-style unofficial sources only if acceptable for personal project risk

Start with price lookup and daily refresh. Avoid intraday trading dependency at first.

## Phase 7 - Alerts engine

- Scheduled checks for manual thresholds.
- Email or in-app notifications.
- Review reminders.

## Phase 8 - Mobile polish

- Installable PWA.
- Fast load.
- Offline-friendly journal draft if possible.
- Touch-friendly forms.
