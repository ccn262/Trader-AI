# Source Evaluation Workflow

## Purpose

Trader AI needs a consistent way to evaluate market and intelligence source candidates before wiring them into ingestion.

The goal is to determine whether a source is:

- suitable for automated parsing
- manual-only
- paid-required
- rejected for the current strategy

This workflow is evidence-source validation only. It is not an ingestion schedule and it is not a trading signal.

## Evaluation Lifecycle

1. `candidate`
2. `diagnostic run`
3. `validation review`
4. `validated` / `rejected` / `paid_required` / `manual_only`

Rules:

- `candidate` means the source has been discovered but not yet evaluated.
- `diagnostic run` means the source was inspected using a safe, read-only diagnostic path.
- `validation review` means the diagnostic output was reviewed by a human or a controlled review workflow.
- Final status should reflect the evidence and the access method, not hope that the source might work later.

## Evaluation Criteria

Use the following criteria when deciding the status of a source:

- accessibility
- structured content
- real source URLs
- rate-limit safety
- source confidence
- evidence quality
- legal and ethical suitability
- parsing reliability

## How Diagnostics Inform Status

Diagnostics should be used to decide whether a source can be parsed safely and repeatably.

Examples:

- A source with real anchors, likely announcement links, and stable HTML may remain a candidate or move to validating.
- A source that is reachable but JS-rendered and exposes no useful anchors for a simple parser should usually be rejected for that parser strategy.
- A source that clearly needs commercial access should become `paid_required`.
- A source that is useful only for manual review should become `manual_only`.

## Rules For Rejecting JS-Rendered Or Inaccessible Sources

Reject or downgrade a source when:

- it returns a JS-rendered shell with no parseable announcement links for the current strategy
- it is inaccessible without bypassing normal site controls
- it returns repeated failures, denial pages, or placeholder content
- it would require aggressive scraping to stay current

The London Stock Exchange `/news` page is a good example of a reachable but JS-rendered page that is not suitable for a simple server-side parser.

## Rules For Paid Providers

Use `paid_required` when:

- a commercial feed or API may solve the source problem
- access is likely to require a contract, key, or commercial onboarding
- the source should not be treated as available until the access path is confirmed

Do not assume paid access exists just because a vendor name is known.

## Rules For Not Forcing Scraping

Trader AI must not force a source into ingestion just because the page loads.

Rules:

- do not bypass controls
- do not hammer external sites
- do not crawl aggressively
- do not treat a reachable page as validated evidence
- do not convert a rejected source into a live parser target without a new validation pass

## Manual-First Validation Rule

Manual review comes before any scheduled ingestion or unattended automation.

Recommended order:

1. discover candidate
2. run diagnostic inspection
3. review the diagnostics
4. decide whether the source is candidate, manual-only, paid-required, validated, or rejected
5. only then consider parser work

## Registry And Diagnostics

The source candidate registry stores the current status and validation notes. Diagnostics should be stored separately so evaluation history is visible over time.

Use the registry to answer:

- what the source is
- how it was checked
- what the latest diagnostic showed
- why it was accepted or rejected

Use diagnostics to preserve:

- HTTP status
- content type
- response length
- page title
- anchor counts
- likely RNS/news href counts
- JavaScript-rendered indicators

