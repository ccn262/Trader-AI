# Source Candidate Registry

## Purpose

Trader AI needs a structured registry for market and intelligence sources so it can track where evidence comes from, how each source was validated, and whether a source is suitable for future ingestion.

This registry is a governance tool, not an evidence store. It helps the app decide which sources can be trusted, which need more validation, and which should be rejected or handled manually.

## Source Statuses

- `candidate`
- `validating`
- `validated`
- `rejected`
- `paid_required`
- `manual_only`

Rules:

- `candidate` means the source has been identified but not yet validated.
- `validating` means the source is being inspected manually or with a controlled diagnostic workflow.
- `validated` means the source is suitable for the current ingestion strategy.
- `rejected` means the source is not suitable for the current parser or validation path.
- `paid_required` means the source may be valuable, but access is commercial or gated.
- `manual_only` means the source is useful for manual review but not for automated parsing yet.

## Access Methods

- `rss`
- `api`
- `html`
- `js_rendered`
- `manual`
- `paid_provider`

Rules:

- `rss` and `api` are preferred when they are stable and documented.
- `html` is acceptable when the page exposes real, parseable announcement links.
- `js_rendered` means the page may be reachable, but the content is produced client-side and may not be suitable for a simple server fetch parser.
- `manual` means the source is reviewed by hand or entered from a controlled workflow.
- `paid_provider` means a commercial feed or API may be used later.

## Confidence Scoring

Confidence scores should describe how trustworthy the source is as a source of evidence, not whether the announcements are positive or negative.

Suggested guidance:

- `95-100`: official filing, direct regulator feed, or validated authoritative source
- `80-94`: high-quality official or structured source that still needs operational validation
- `60-79`: reachable and plausible, but parsing or validation is still incomplete
- `30-59`: useful for manual tracking only, or too brittle for simple parsing
- `0-29`: rejected, placeholder, or not suitable for trusted ingestion

## Diagnostic Workflow

Use diagnostics before writing parser logic.

Workflow:

1. Confirm the source URL is real and not a mock/demo placeholder.
2. Run the read-only diagnostic inspection script.
3. Inspect HTTP status, response length, title, anchor count, and likely RNS/news href patterns.
4. Decide whether the source is RSS, plain HTML, JS-rendered, or manual only.
5. Record the outcome in the registry.
6. Only move to validation or parsing after the source shape is understood.

## Rules For Rejecting Sources

Reject or downgrade a source when:

- It returns a JS-rendered shell with no useful anchor discovery for a simple server parser.
- It exposes only placeholder, mock, demo, or test URLs.
- It requires aggressive scraping or repeated polling to be useful.
- It is inconsistent, incomplete, or too brittle for safe manual validation.
- It violates site terms or acceptable-use expectations for the intended access method.

## Do Not Force Scraping

Trader AI should not force a source into automated ingestion just because the homepage is reachable.

Rules:

- Do not follow hidden paths or bypass controls.
- Do not use aggressive crawling.
- Do not treat a reachable page as validated evidence unless the link extraction and trust checks succeed.
- Do not turn a rejected source into a live source until the adapter strategy changes and the source is revalidated.

## Example Entry: London Stock Exchange `/news`

- `name`: London Stock Exchange News
- `access_method`: `js_rendered`
- `status`: `rejected`
- `confidence_score`: `60`
- `diagnostic_status`: `not_suitable_for_simple_parser`
- `diagnostic_summary`: `HTTP 200, title present, anchorCount 0, likelyRnsHrefCount 0, appearsJavaScriptRendered true`
- `notes`: `Reachable but not suitable for simple HTML parsing; keep as a diagnostic reference, not verified evidence.`

## Registry Use In Trader AI

The registry should be used to:

- track candidate sources and validation outcomes
- separate official evidence from mock/demo references
- decide whether a source can feed `raw_announcements`
- document why a source was rejected, paid, or left manual-only
- help future parser work start from a known source shape instead of guesswork

