# Changelog - Trader AI

## Unreleased

- Initial project pack created.
- Added product spec, design spec, data model, AI scoring spec, guardrails, roadmap, and build checklist.
- Built Phase 1 static mobile-first prototype in Next.js App Router with TypeScript and Tailwind CSS.
- Added dashboard, watchlists, portfolio, journal, alerts, and settings routes with mock data.
- Added visible decision-support disclaimer and a mock journal form that requires reason, risk amount, stop-loss idea, and review date.
- Verified `npm run lint` and `npm run build` both pass.
- Added Supabase server wiring with mock fallback, typed database models, and a schema/seed migration under `supabase/migrations/20260602_phase2_trader_ai.sql`.
- Updated the journal guardrail to require thesis/reason, risk notes, review date, and manual execution confirmation.
- Documented required Supabase environment variables in `README.md`.
- Updated the mock seed dataset to match the current starter portfolio and watchlist focus.
- Added CRUD mutation actions for assets, portfolio positions, journal entries, and alerts with Supabase-backed writes and mock fallback reads.
- Added asset detail pages at `/assets/[symbol]` and journal detail pages at `/journal/[id]`.
- Added archive/review flows and empty-state handling for watchlists, portfolio, journal, and alerts.
- Added phase 3 Supabase migration for archived/reviewed columns.
- Added `docs/TRADER_AI_CONSTITUTION.md` as the master product authority.
- Added Phase 4 planning docs for intelligence, opportunity, risk, data source, scanner, and daily briefing architecture.
- Updated the README and Codex brief to point future work at the constitution first.
