# Working Log - Trader AI

Use this file to keep Codex and future sessions aligned.

## Current status

- Folder created locally at `C:\Users\Chris\OneDrive\Documents\Trader AI`.
- GitHub repo intended: `https://github.com/ccn262/Trader-AI.git`.
- Product boundary agreed: decision support only.
- User will manually place trades in Trading 212.
- Phase 1 static prototype is implemented locally with mock data.
- Routes added: Dashboard, Watchlists, Portfolio, Journal, Alerts, and Settings.
- Validation completed: `npm run lint` and `npm run build` pass.
- Phase 2 Supabase wiring is implemented with server-side fallback to mock data when env vars are missing.
- Schema and seed migration added at `supabase/migrations/20260602_phase2_trader_ai.sql`.
- README now lists the required Supabase environment variables.
- Phase 3 CRUD mutations and dynamic detail pages are implemented.
- Routes added: `/assets/[symbol]` and `/journal/[id]`.
- Watchlists, portfolio, journal, and alerts now support create/edit/archive/review flows when Supabase is available.
- `docs/TRADER_AI_CONSTITUTION.md` now serves as the master authority for future work.
- Phase 4 planning docs are being added for intelligence, opportunity, risk, data source, scanner, and daily briefing architecture.
- Phase 5 mock-first Opportunity Alerts UI is being added on `/alerts` with scan cards, filters, and review-only alert cards.
- Phase 6 opportunity-alerts data model is being added with Supabase tables for scan runs, intelligence sources/items, opportunity alerts/evidence, and score history.
- `/alerts` now reads from a Supabase-first opportunity-alert feed with mock fallback when env vars are missing and safe empty states when the tables contain no rows.
- Phase 7 RNS/company-announcement ingestion foundation is being added with raw announcement storage, RNS source seeding, a server-side ingestion module, and a manual mock ingestion script.
- `/alerts` now has a small read-only recent-intelligence section for RNS-derived evidence, including source confidence, verification status, and impact placeholders.
- RNS mock ingestion deduplication has been tightened so repeated runs reuse existing rows using `external_id`, `source_url`, or `asset_symbol + headline + published_at`.
- A follow-up migration now adds stronger raw-announcement duplicate protection and lookup indexes without deleting existing live data automatically.
- Phase 8 deterministic announcement scoring is being added so RNS-derived intelligence can be classified, risk-labelled, prioritized, and explained without any AI API calls.
- A manual scoring script is being added for idempotent server-side updates to `intelligence_items` and controlled `score_history` entries.
- A follow-up constraint fix is being added so adverse announcements can store negative impact scores and negative score-history values cleanly.
- The scoring script now exits nonzero if negative-score rows still hit an old database constraint, which makes the migration dependency obvious during verification.

## Next recommended action

1. Apply `supabase/migrations/20260608_fix_impact_score_constraint.sql` after the Phase 8 migration in the connected Supabase project.
2. Run `npm run score:rns:impact` twice in a configured environment and confirm the second run skips unchanged scored rows without duplicating `score_history`.
3. Use the deterministic scoring output to review high-priority, speculative, and avoid-or-reassess RNS evidence before any later alert automation work.

## Codex starter instruction

Before any future work, read `docs/TRADER_AI_CONSTITUTION.md` and follow `.codex/CODEX_BRIEF.md`. Keep the app decision support only. Do not add live market APIs, AI API calls, or broker execution.
