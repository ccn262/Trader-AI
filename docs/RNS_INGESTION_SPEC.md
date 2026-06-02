# RNS Ingestion Spec

## Purpose

RNS and official UK company announcements are a high-confidence evidence source for Trader AI.

They are not trade instructions. They are source material that can become structured intelligence for review.

This phase establishes the ingestion foundation only:

- Capture raw announcements
- Preserve provenance
- Normalize announcement types
- Map announcements into `intelligence_items`
- Keep the system mock-first and manually triggered

## Authority

This spec must align with [docs/TRADER_AI_CONSTITUTION.md](./TRADER_AI_CONSTITUTION.md). If there is a conflict, the constitution wins.

## Why RNS Matters

RNS and comparable UK company announcements are among the strongest evidence sources available for UK-listed names because they are official market disclosures.

They are useful for:

- Earnings and trading context
- Financing risk
- Board and insider activity
- Resource and drilling updates
- Contract wins
- Regulatory and permitting milestones
- Going concern and liquidity warnings
- M&A and special situations

## Announcement Types To Monitor

- Final results
- Interim results
- Trading updates
- Director dealings
- Holdings / TR-1
- Contract wins
- Placing / fundraising
- Resource / mineral exploration updates
- Drill results
- Feasibility studies
- Permitting / regulatory approvals
- M&A / takeover announcements
- Board changes
- Going concern warnings

## Source Confidence Assumptions

Base assumptions:

- Official RNS / company announcement source: 95
- Company filing or direct IR mirror of the same announcement: 95 to 100

Rules:

- Official announcements are high-confidence inputs.
- High confidence does not remove the need for interpretation.
- A formal announcement can still describe negative or high-risk developments.
- Official announcements from penny shares, micro caps, and mining/resource companies still require stricter risk framing.

## Verification Rules

RNS announcements should usually enter the system as high-confidence evidence, but not all items should be promoted equally.

Verification rules:

1. Confirm the item came from the configured RNS/company-announcement source.
2. Preserve the original headline, URL, timestamp, and raw payload.
3. Normalize the company name, symbol, and announcement type.
4. Check for duplicates using external id, source URL, or the fallback compound key `asset_symbol + headline + published_at`.
5. Mark parsing failures explicitly rather than inventing structured fields.
6. Treat financing, going-concern, and speculative mining/resource announcements as higher-risk even when the source is official.
7. Do not turn a single official announcement into a recommendation.

## Deduplication Rules

Deduplication should happen before inserting either `raw_announcements` or `intelligence_items`.

Deduplication order:

1. `external_id` when available
2. `source_url` when available
3. Fallback compound key:
   `asset_symbol + headline + published_at`

Implementation rules:

- Prefer reusing the oldest matching raw announcement instead of creating another row.
- Prefer reusing the oldest matching intelligence item instead of inserting another one.
- If a duplicate already exists in storage, skip insertion and count the announcement as skipped rather than failing the whole run.
- Do not auto-delete live rows during ingestion.

Database protection:

- Unique index on `source_id + external_id` when `external_id` is not null
- Unique index on `source_id + source_url` when `source_url` is not null
- Lookup index on `source_id + asset_symbol + headline + published_at` for fallback matching

## Duplicate Inspection SQL

Use these read-only queries to identify duplicate-looking RNS rows before any manual cleanup decision.

Raw announcements by external id:

```sql
select
  source_id,
  external_id,
  count(*) as duplicate_count
from public.raw_announcements
where external_id is not null
group by source_id, external_id
having count(*) > 1
order by duplicate_count desc, external_id;
```

Raw announcements by source URL:

```sql
select
  source_id,
  source_url,
  count(*) as duplicate_count
from public.raw_announcements
where source_url is not null
group by source_id, source_url
having count(*) > 1
order by duplicate_count desc, source_url;
```

Raw announcements by fallback compound key:

```sql
select
  source_id,
  asset_symbol,
  headline,
  published_at,
  count(*) as duplicate_count
from public.raw_announcements
where asset_symbol is not null
  and published_at is not null
group by source_id, asset_symbol, headline, published_at
having count(*) > 1
order by duplicate_count desc, published_at desc;
```

Intelligence items linked to more than one raw announcement pattern:

```sql
select
  source_id,
  asset_symbol,
  headline,
  published_at,
  count(*) as duplicate_count
from public.intelligence_items
where asset_symbol is not null
  and published_at is not null
group by source_id, asset_symbol, headline, published_at
having count(*) > 1
order by duplicate_count desc, published_at desc;
```

These queries are inspection-only. Cleanup should be a deliberate manual action.

## How Announcements Become `intelligence_items`

Recommended flow:

1. Ingest raw announcement into `raw_announcements`.
2. Store raw payload and ingestion status.
3. Normalize the announcement type from headline and category.
4. Map the normalized result into an `intelligence_items` row.
5. Assign base source confidence.
6. Assign a placeholder impact score.
7. Set verification status based on source quality and parse completeness.
8. Pass the normalized item through deterministic announcement-impact scoring before any later alert-generation workflow.

## Deterministic Scoring Handoff

RNS ingestion and announcement scoring are separate steps on purpose.

Flow:

1. Preserve the raw announcement.
2. Create or reuse the linked `intelligence_items` row.
3. Run deterministic scoring against the normalized announcement type, headline, category, and summary.
4. Write classification, impact direction, impact score, risk level, priority, scoring reason, and `scored_at`.
5. Record score-history changes only when the effective scored output changes.

Rules:

- Scoring remains evidence-based and review-only.
- Scoring must be idempotent when the same RNS item is processed more than once.
- `score_history` should not be polluted with duplicate entries for the same unchanged scored state.
- If scoring fields are unavailable in the database yet, apply the Phase 8 migration before running the scorer.

Expected mapping examples:

- Final results -> `result`
- Interim results -> `result`
- Trading update -> `trading_update`
- Director dealing -> `other`
- Contract win -> `other`
- Drill result -> `filing`
- Placing / fundraising -> `filing`
- Going concern warning -> `other`

## How Announcements May Later Create `opportunity_alerts`

This phase does not require automatic alert generation.

Later phases may create review-only alerts when:

- The announcement is high-confidence and material
- The impact score crosses a review threshold
- The item materially changes risk, timing, or catalyst relevance
- The item has been verified and classified cleanly

Any resulting alert must remain review-only. Allowed wording includes:

- Review opportunity
- Reassess
- Monitor for confirmation

Disallowed wording includes:

- Buy now
- Guaranteed profit
- Sure thing
- Risk free

## Evidence Link Handling

Stored source URLs must be treated carefully in the UI.

Rules:

- Real external announcement URLs may be opened externally and should be treated as the primary source reference.
- Mock or demo URLs such as `mock-`, `demo`, `example.com`, `placeholder`, `localhost`, or `test` must never be displayed as verified external evidence.
- Demo or mock evidence should route to the internal intelligence detail page when a safe internal reference exists.
- If no trustworthy source URL is available, the UI must show evidence as unavailable rather than inventing a link.
- The raw announcement record remains the audit trail even when the display link is unavailable.

## Guardrails For Penny Shares And Mining / Resource Companies

Official announcements from speculative companies can still be dangerous to interpret naively.

Rules:

- Label these items as speculative or high-risk where appropriate.
- Raise caution around liquidity, financing risk, and promotional framing.
- Do not let one drill result or exploration headline create aggressive conclusions.
- Treat placings, funding updates, and going-concern language as materially important risk evidence.
- Require stronger review discipline before any downstream scoring or alert promotion.

## Failure Handling

If ingestion is incomplete or the feed is unreliable:

- Keep the raw announcement
- Mark ingestion as `failed` or `ignored`
- Avoid manufacturing structured confidence
- Do not auto-create alerts
- Preserve the record for later manual inspection

## Manual-First Scope

This phase should remain manually triggered in development or admin-safe contexts.

Allowed:

- Mock ingestion scripts
- Dev-only manual ingestion actions
- Explicit local or admin-triggered test runs

Not allowed in this phase:

- Autonomous scheduling without review
- Push notifications
- Automated broker behavior
- AI-generated trade recommendations

## Source Adapter Path

The ingestion code now separates source discovery from storage.

Rules:

- Mock/demo announcements remain the default safe fallback.
- Real-source discovery must be opt-in and manual-first.
- A source adapter may fetch or validate source data, but it must not turn unvalidated output into trusted evidence.
- The adapter layer should stay thin so the parser and storage pipeline can be swapped without changing the product boundary.
- Real-source validation requires `RNS_SOURCE_MODE=real` and `RNS_REAL_FETCH_ENABLED=true`.
- Manual validation should use a small fetch limit, typically five announcements or fewer.
- Only real external evidence URLs should be stored as trusted source URLs; mock/demo, placeholder, localhost, or test URLs should be rejected from the real-source validation path.

See [docs/REAL_RNS_SOURCE_DISCOVERY.md](./REAL_RNS_SOURCE_DISCOVERY.md) for the real-source discovery plan.
