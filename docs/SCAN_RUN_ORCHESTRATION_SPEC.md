# Scan Run Orchestration Spec

## Purpose

Scan orchestration turns the existing evidence pipeline into a repeatable Morning and Evening review loop.

It coordinates:

1. RNS/mock announcement ingestion
2. deterministic announcement scoring
3. review-only opportunity alert generation
4. scan-run logging and summary counts

It does not place trades, does not connect to brokers, and does not tell the user to buy.

## No Execution Boundary

The orchestration layer is decision support only.

It may:

- ingest evidence
- score intelligence
- generate review-only alerts
- summarize what changed

It must not:

- place orders
- create auto-trading rules
- imply guaranteed profit
- recommend buy or sell execution

## Morning Scan Workflow

Morning scans should run after fresh UK-market evidence is available.

Typical steps:

1. Create a `scan_runs` row with `status = running`
2. Trigger the mock/manual RNS ingestion path
3. Score any unscored or changed intelligence items
4. Generate review-only opportunity alerts from scored intelligence
5. Write counts and summary fields back to `scan_runs`
6. Mark the run completed or failed

The morning scan is primarily for:

- overnight announcements
- fresh guidance changes
- new review items before the trading day starts

## Evening Scan Workflow

Evening scans close the loop on the day’s evidence.

Typical steps:

1. Create a `scan_runs` row with `status = running`
2. Trigger the same mock/manual RNS ingestion path
3. Score intelligence that changed or arrived since the last run
4. Generate or repair evidence-driven opportunity alerts
5. Write counts and summary fields back to `scan_runs`
6. Mark the run completed or failed

The evening scan is primarily for:

- post-close announcements
- follow-up review items
- preparing the next day’s watch list

## Manual Trigger Workflow

Manual scans are safe admin/dev actions.

They can be triggered by:

- a local script
- a protected API route

Manual scans use the same orchestration path as cron scans, but the `trigger_source` is recorded as `manual` or `dev_script`.

## Vercel Cron Workflow

Vercel Cron should call the same scan route used by manual orchestration, but through dedicated cron endpoints.

Cron jobs should:

- use `GET`
- verify the `Authorization` header
- run only on production deployments
- use UTC schedules

Recommended schedule:

- Morning scan: `15 7 * * 1-5` UTC
- Evening scan: `15 16 * * 1-5` UTC

UK-local intent:

- Morning scan: around the UK market open window
- Evening scan: after the UK market close window

Optional future extension:

- a later US-market scan if the product needs it

## Idempotency Rules

Scan orchestration must be safe to rerun.

Rules:

- Re-running the same mock RNS ingestion must not create duplicate `raw_announcements`
- Re-running scoring must not create duplicate `score_history` for an unchanged scored state
- Re-running alert generation must not create duplicate `opportunity_alerts`
- Re-running alert generation must not create duplicate evidence rows for the same alert/item pair
- Existing alerts may be repaired if evidence is missing

## Failure Handling

If any stage fails:

- update the `scan_runs` row to `failed`
- store the error text in `error_message`
- keep the summary safe and readable
- do not expose secret values

Typical failure classes:

- missing environment variables
- missing database migration
- duplicate protection or constraint violations
- unexpected write failures

Failures should be obvious in logs and should not crash the app shell.

## Data Retention Approach

Scan runs are retained as an audit trail.

The system should keep:

- the scan-run record
- scored intelligence items
- generated alerts
- evidence links
- score history

This preserves decision context and avoids inventing new history during review.

## Guardrails

- No broker execution
- No auto-trading
- No AI API calls yet
- No live market APIs yet
- No guaranteed-profit wording
- No “buy now” wording
- No hidden mutation from GET requests except cron routes explicitly protected by secret headers

## Server Secret Boundaries

The scan runtime depends on server-only secrets and must never be pulled into client bundles.

Rules:

- `SUPABASE_SERVICE_ROLE_KEY` may only be read from server-side modules, API routes, route handlers, scripts, or server components.
- `TRADER_AI_ADMIN_SECRET` and `CRON_SECRET` may only be read by server-side auth helpers, API routes, cron routes, or local admin scripts.
- Files marked with `"use client"` must not import:
  - `src/lib/supabase/server.ts`
  - `src/lib/scanning/run-scan.ts`
  - `src/lib/scanning/auth.ts`
  - `src/lib/ingestion/rns.ts`
- Client components should consume read-only data only through server-rendered props or serialized data from safe data-layer calls.
- The repository includes a lightweight boundary check script to catch accidental client imports before they reach production.

## Summary Fields

Each scan run should capture:

- total intelligence items reviewed
- total alerts generated
- high-priority count
- speculative count
- avoid-or-reassess count
- scan status
- completion flag
- error message when applicable

## Source Mode

The current scan path keeps mock/demo RNS ingestion as the default source.

Rules:

- Morning and evening scans continue to use the mock adapter unless a real source is explicitly validated later.
- Real-source discovery can be exercised manually through the dedicated real-ingestion script.
- The scan summary may include a source-mode note when helpful, but it must not imply that unvalidated source output is verified evidence.
