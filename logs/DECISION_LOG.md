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
