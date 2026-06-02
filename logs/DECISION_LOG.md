# Decision Log - Trader AI

## 2026-06-01 - Product boundary

Decision: Trader AI is decision support only.

Reason: The user will manually place trades in Trading 212. This reduces risk and keeps the product focused on research, monitoring, journaling, and alerts.

Impact:

- No automated trading.
- No broker order placement.
- No buy/sell certainty language.

## 2026-06-01 - Mobile-first direction

Decision: The app should be slick, easy to see, and mobile-friendly.

Reason: The user wants quick monitoring of stocks, watchlists, and alerts.

Impact:

- Bottom navigation on mobile.
- Card-based screens.
- Short forms and clear action buttons.

## 2026-06-01 - Manual-first data

Decision: Start manual-first before live market APIs.

Reason: The core behaviour and discipline should work before adding data complexity.

Impact:

- Manual portfolio values initially.
- Manual alerts initially.
- AI score can start with manual inputs/mock data.

## 2026-06-02 - Supabase wiring scope

Decision: Add Supabase for database access and server-side reads only, while keeping a mock fallback when env vars are missing.

Reason: Phase 2 should prepare the app structure for persisted data without breaking the static prototype or introducing auth overhead too early.

Impact:

- No broker integration or auto-trading.
- No auth required yet.
- App remains usable offline or before Supabase is provisioned.
- Supabase env vars are documented in `README.md`.

## 2026-06-02 - CRUD scope

Decision: Use Supabase-backed CRUD for assets, portfolio positions, journal entries, and alerts, with archive/review semantics instead of destructive delete flows.

Reason: The product needs editable records while staying decision-support only and preserving an audit trail.

Impact:

- Watchlist items can be edited and archived.
- Manual positions can be recorded, updated, and closed as records.
- Journal entries can be created, edited, viewed, and archived.
- Alerts can be created, marked reviewed, and archived.
- The app continues to fall back to mock data if Supabase is not configured.

## 2026-06-02 - Constitution authority

Decision: Make `docs/TRADER_AI_CONSTITUTION.md` the master authority for all future Trader AI work.

Reason: The product needs a stable architectural reference that governs scope, language, risk posture, and AI behavior before the intelligence and opportunity layers are implemented.

Impact:

- Future work must align to the constitution first.
- Planning documents can define implementation detail, but not override the constitution.
- README and Codex brief should point contributors to the constitution before any new work starts.

## 2026-06-02 - Opportunity alerts UI scope

Decision: Build Phase 5 as a mock-first Opportunity Alerts UI on the existing alerts route, using alert cards, scan cards, filters, and empty states.

Reason: The user asked for a review-oriented alert experience that supports morning and evening scans without introducing live feeds, broker actions, or AI API calls.

Impact:

- The UI remains decision support only.
- Alert cards must use “Review opportunity” wording and avoid buy language.
- Filters and empty states improve scan usability on mobile.
- Mock data remains the only source for this phase.

## 2026-06-02 - Opportunity alerts data model scope

Decision: Add Phase 6 Supabase tables for scan runs, intelligence sources/items, opportunity alerts/evidence, and score history, and route `/alerts` through a Supabase-first feed with mock fallback.

Reason: The alerts UI now needs a durable schema that can store scan provenance, evidence, and score changes before any live market or AI integrations are added.

Impact:

- Opportunity alerts remain review opportunities, not execution prompts.
- The app can preserve scan context, evidence lineage, and score-change history.
- `/alerts` keeps working without Supabase env vars by falling back to mock data.
- Empty tables no longer break the page and instead render the existing calm empty states.

## 2026-06-02 - RNS ingestion foundation scope

Decision: Add a manual-first RNS/company-announcement ingestion foundation with raw announcement storage, source seeding, server-side parsing/mapping helpers, and a safe mock ingestion script.

Reason: Official UK company announcements are a high-confidence evidence source and need a durable ingestion path before any live feed, AI summarisation, or automated scan scheduling is considered.

Impact:

- RNS items enter the system as evidence, not trade instructions.
- Raw announcements are stored separately from normalized `intelligence_items`.
- Deduplication is based on external id, source URL, or headline plus timestamp.
- Speculative mining/resource and fundraising announcements keep explicit higher-risk framing.
- No automated scheduler, broker behavior, or AI calls are introduced in this phase.

## 2026-06-02 - RNS deduplication hygiene

Decision: Tighten RNS ingestion deduplication so both the manual mock script and the server-side ingestion helper reuse existing rows by `external_id`, `source_url`, or `asset_symbol + headline + published_at`.

Reason: Re-running mock ingestion in a seeded environment can create duplicate-looking evidence if deduplication relies on only one identifier or assumes a single matching row already exists.

Impact:

- Re-running `npm run ingest:rns:mock` should be idempotent.
- The ingestion path now handles existing duplicate rows more safely by reusing the oldest match.
- Database-level protection is extended for raw-announcement source URLs and supporting lookup indexes.
- Duplicate inspection remains manual and non-destructive.

## 2026-06-02 - Deterministic announcement impact scoring

Decision: Score RNS-derived announcement intelligence with deterministic rules before introducing any AI API summarisation or market-data enrichment.

Reason: The platform needs explainable, review-only classification and priority signals based on stored evidence, without pretending to predictive certainty or handing decision authority to AI.

Impact:

- Announcement scoring remains evidence-based and manually reviewable.
- `intelligence_items` now carry classification, impact direction, impact score, risk level, priority, scoring reason, and scoring timestamp fields.
- Re-running the scoring pass should be idempotent and should only add `score_history` rows when the effective scored state changes.
- Speculative mining/resource updates and going-concern style warnings keep explicit higher-risk framing.

## 2026-06-02 - Negative impact score support

Decision: Allow negative `impact_score` and `score_history.score` values for adverse announcements.

Reason: Deterministic scoring needs to represent downside, dilution, and going-concern events without flattening them into a nonnegative scale.

Impact:

- The `intelligence_items.impact_score` constraint now supports `-100` to `+100`.
- Negative values can be recorded for adverse announcements and risk-heavy events.
- `score_history` remains compatible with negative scores so scoring deltas still make sense.
