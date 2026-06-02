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
- Added Phase 5 mock-first Opportunity Alerts UI on the alerts route with morning/evening scan cards, filters, empty states, and review-only alert cards.
- Added Phase 6 Supabase data-model support for scan runs, intelligence items, evidence, opportunity alerts, and score history in `supabase/migrations/20260604_phase6_opportunity_alerts_data_model.sql`.
- Added realistic review-only seed records for morning and evening scans, quality and speculative opportunity alerts, sector rotation, and score history.
- Updated Supabase TypeScript models and rewired `/alerts` to read opportunity alerts through a Supabase-first data layer with mock fallback and empty-table safety.
- Added `docs/RNS_INGESTION_SPEC.md` describing the RNS/company-announcement ingestion foundation, verification rules, and speculative-resource guardrails.
- Added Phase 7 Supabase support for `raw_announcements` and intelligence-item links in `supabase/migrations/20260605_phase7_rns_ingestion.sql`.
- Added a server-side RNS ingestion module and a manual mock ingestion script for development-safe announcement parsing, deduplication, and storage.
- Added a compact read-only recent-intelligence section on `/alerts` so RNS-derived evidence can be reviewed without creating execution flows.
