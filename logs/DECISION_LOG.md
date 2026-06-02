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

Reason: Re-running mock ingestion must remain safe and must not create duplicate raw announcements or duplicate intelligence rows.

Impact:

- Raw announcement writes are idempotent.
- Intelligence-item writes are idempotent.
- Duplicate-looking RNS rows can be repaired without deleting live data.

## 2026-06-02 - Scan orchestration boundary

Decision: Add a shared scan-run orchestration layer with protected manual and cron entry points that reuses existing ingestion, scoring, and alert-generation logic.

Reason: Morning and evening review loops need a single safe path that can later be called by Vercel Cron without adding broker execution, live APIs, or AI calls.

Impact:

- `runScan` coordinates ingestion, scoring, alerts, and scan-run summary writes.
- Manual scans require `TRADER_AI_ADMIN_SECRET`.
- Cron scans require `CRON_SECRET` or `TRADER_AI_ADMIN_SECRET`.
- The dashboard and alerts pages can show latest scan summaries without exposing secrets or execution flows.

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

## 2026-06-02 - Evidence-driven alert generation

Decision: Generate review-only opportunity alerts from scored intelligence items using deterministic rules and linked evidence records.

Reason: The app now has scored evidence and needs a durable, idempotent way to convert that evidence into explicit human-review tasks without drifting into trade instructions.

Impact:

- `opportunity_alerts` now carry provenance fields for the source intelligence item, generation reason, and review-by date.
- `opportunity_evidence` now supports primary/evidence flags for clearer auditability.
- The alert generator should be idempotent and should never create duplicate alerts for the same scored intelligence item.
- Going-concern, placing, trading-update, director-dealing, and resource-catalyst evidence stays review-only and never turns into buy language.

## 2026-06-02 - Server secret boundary audit

Decision: Add an explicit repository check and documentation for server-secret scan boundaries instead of changing runtime scan behavior.

Reason: Phase 10 needs a durable guardrail so service-role Supabase access and scan orchestration stay out of client bundles without breaking Node scripts that reuse the same server runtime modules.

Impact:

- The repository now documents which modules are server-only boundaries and which env vars must never be exposed client-side.
- A lightweight check script can fail fast if a `"use client"` file imports server-secret scan or ingestion modules.
- Runtime scan behavior, cron timing, and public UI flows remain unchanged.

## 2026-06-02 - Evidence link trust

Decision: Treat mock, demo, placeholder, localhost, and test evidence URLs as non-verified and route them internally or show them as unavailable instead of opening them as fake external sources.

Reason: Evidence-led review only requires trustworthy link behavior. Fake source URLs undermine source trust and can mislead users into thinking mock data is live market evidence.

Impact:

- `/alerts` now distinguishes real external sources from demo/sample evidence and unavailable evidence.
- `/intelligence/[id]` provides a safe internal review page for announcement evidence and clearly labels mock/demo records.
- Missing source links are shown as unavailable rather than routed to a broken or misleading destination.

## 2026-06-02 - Real RNS source discovery

Decision: Add a manual-first source-adapter layer for real RNS discovery while keeping mock/demo ingestion as the default fallback.

Reason: The app needs a safe way to validate a real announcement source without converting unverified connectivity into unattended ingestion or fake evidence trust.

Impact:

- Mock/demo RNS ingestion remains the default scan path.
- Real-source discovery is opt-in via `RNS_SOURCE_MODE=real` and `RNS_SOURCE_BASE_URL`.
- The adapter boundary makes it possible to validate a source before adding a parser or scheduler.
- Unvalidated real-source output must not be treated as verified evidence or alert input.

## 2026-06-02 - Real RNS source validation

Decision: Add an explicit manual validation gate for the real RNS adapter using `RNS_REAL_FETCH_ENABLED=true` and a small fetch limit before any real evidence is allowed into storage.

Reason: Discovery is not enough; the product needs a controlled validation step that proves external URLs are trustworthy before they are written into the evidence trail.

Impact:

- Real-source manual runs remain opt-in and limited.
- The validation path rejects mock/demo, placeholder, localhost, and invalid URLs before storage.
- Validation summaries report how many URLs were accepted, rejected, and persisted.
- Cron scans remain on mock/demo ingestion until validation is complete.

## 2026-06-02 - RNS source diagnostics

Decision: Add a read-only diagnostic script for the raw source URL before expanding parser logic.

Reason: A successful fetch that yields no extractable announcements may still be a valid source, but the team needs to inspect the raw HTML structure before guessing at parser rules.

Impact:

- The diagnostic script fetches only the configured base URL and never writes to Supabase.
- It reports response metadata, title, anchor counts, href samples, and a JS-rendered heuristic.
- JS-rendered sources are explicitly called out as potentially unsuitable for simple server-side parsing.
- Diagnostics should run before parser changes and before any further validation or scheduler work.

## 2026-06-02 - Source candidate registry

Decision: Add a source candidate registry to track status, access method, confidence, and diagnostic outcomes for candidate intelligence sources.

Reason: The real-source path needs a durable way to distinguish validated sources from rejected, paid-only, or manual-only candidates without forcing scraping or confusing mock references with real evidence.

Impact:

- The registry provides a read-only summary of candidate sources on `/sources`.
- LSE `/news` remains tracked as JS-rendered and rejected for simple parsing.
- Manual-only and paid-required candidates stay clearly separated from validated sources.
- The registry is governance-only and does not enable live ingestion or cron changes.

## 2026-06-02 - Source evaluation workflow

Decision: Add a source evaluation workflow that stores diagnostics separately from registry rows and exposes candidate detail pages for review.

Reason: Candidate status alone is not enough; the team needs diagnostic history so it can understand why a source was rejected, manual-only, or validated before wiring it into ingestion.

Impact:

- Diagnostic runs can be stored without changing candidate status automatically.
- `/sources/[id]` provides a review page with the latest diagnostic and a timeline.
- The diagnostic script can optionally persist a read-only review record when explicitly configured.
- Real-source ingestion still stays manual-first and gated by validation rules.
