# Real RNS Source Discovery

## Purpose

Trader AI treats official company announcements as high-confidence evidence. This document describes the safe foundation for discovering a real UK company-announcement source without turning discovery into aggressive scraping or unattended ingestion.

The goal is adapter-first, manual-fetch-first, scheduler later.

## Candidate Source Options

### London Stock Exchange RNS Pages

Pros:

- Official market-announcement context
- High-confidence source for UK-listed names
- Closest fit to the current RNS-style ingestion model

Cons:

- HTML structure can change
- Scraping policies and rate limits may apply
- Some content may require careful parsing or validation

### Company Investor Relations Pages

Pros:

- Official issuer-controlled source
- Often contains PDFs, results decks, and webcasts
- Useful fallback when a direct announcement mirror is available

Cons:

- Coverage varies by company
- Announcement formatting is not uniform
- May not provide the same timing or metadata as the primary feed

### Regulatory Or Market Announcement Services

Pros:

- Can offer structured feeds or APIs
- May reduce parsing complexity
- Sometimes more stable than raw HTML pages

Cons:

- Access may be commercial or restricted
- Terms of use can be stricter
- Feed structure varies by provider

### Paid Data APIs

Pros:

- Potentially the cleanest long-term path
- Often includes normalized metadata and rate controls

Cons:

- Cost
- Vendor lock-in
- Requires extra trust and provenance checks

## Confidence Assumptions

Official company-announcement sources remain very high confidence, but confidence does not mean certainty or profitability.

Rules:

- Source trust is high because the issuer is the originator.
- The announcement may still describe bad news, dilution, or risk.
- Speculative small-cap and mining announcements still need stronger risk framing.
- A real source URL must not be treated as verified if it is a placeholder or demo link.

## Legal And Ethical Scraping Caution

The real source path must respect site terms, rate limits, robots guidance, and acceptable-use expectations.

Rules:

- Do not hammer external sites.
- Prefer manual validation first.
- Do not enable unattended recurring scraping until the source behaviour is confirmed.
- Do not bypass controls or hidden endpoints.
- Do not store or display unvalidated source output as if it were verified evidence.

## Rate-Limiting Expectations

Real-source discovery should be conservative.

Suggested expectations:

- One manual validation request at a time
- Short timeouts
- No aggressive pagination
- No repeated polling during development
- No cron until the source is stable and validated

## Manual Validation Workflow

Recommended workflow:

1. Configure a real source mode explicitly.
2. Set `RNS_REAL_FETCH_ENABLED=true`.
3. Run the manual real-ingestion script with a small limit, usually 5 or fewer announcements.
4. Confirm the script only stores URLs that pass the external-evidence check.
5. Review the stored evidence in Trader AI before adding any parser beyond the controlled validation path.
6. Move to scheduled runs only after manual validation succeeds repeatedly and the source format is understood.

## Diagnostic Workflow

If the fetch returns real HTTP content but no valid announcement links are extracted, run the diagnostic-only inspection script before changing the parser.

Diagnostic steps:

1. Set `RNS_SOURCE_BASE_URL` to the exact page or feed you want to inspect.
2. Run `npm run diagnose:rns-source`.
3. Review the raw diagnostics:
   - HTTP status
   - content type
   - response length
   - page title
   - anchor count
   - first 20 hrefs
   - likely RNS/news link count
   - whether the page appears JavaScript-rendered
4. Decide whether the source exposes plain HTML, RSS-like markup, or a JS-rendered shell.
5. Only add parser logic after the diagnostic output shows the source shape clearly.

## JavaScript-Rendered Sources

Some announcement sources may return a page that looks empty or low-value to a simple server fetch because the content is loaded client-side.

Rules:

- A JS-rendered page may still be a valid source, but it is not suitable for simple HTML parsing until the rendering path is understood.
- Diagnostics should be treated as read-only evidence of the source shape, not as ingestion output.
- Do not enable unattended ingestion just because a page fetch succeeds.
- If the source looks JS-rendered, the next step is to inspect the page structure and decide whether a different adapter strategy is needed.

## Source Candidate Registry

Trader AI keeps a source candidate registry so validation outcomes are visible and reproducible.

Rules:

- Candidate sources should be tracked with a status, access method, confidence score, and diagnostic summary.
- A JS-rendered source may be useful for manual review, but it should not be treated as validated simple-parser evidence.
- The London Stock Exchange `/news` page is currently tracked as JS-rendered and rejected for simple parsing because the diagnostics showed anchorCount 0 and likelyRnsHrefCount 0.
- Rejection does not mean the source is useless; it means the current adapter strategy should not force scraping or pretend the source is already parse-ready.
- See [docs/SOURCE_CANDIDATE_REGISTRY.md](./SOURCE_CANDIDATE_REGISTRY.md) for the registry schema and validation rules.

## Validation Gate

The real-source adapter must remain disabled unless all of the following are true:

- `RNS_SOURCE_MODE=real`
- `RNS_REAL_FETCH_ENABLED=true`
- `RNS_SOURCE_BASE_URL` is set to a configured real source

Optional tuning:

- `RNS_REAL_FETCH_LIMIT` can cap the number of announcements fetched during manual validation
- Default fetch limit should remain small, typically `5`

## Real Versus Mock Evidence URLs

Rules:

- Real evidence URLs should be genuine, external, and trustworthy.
- Mock/demo URLs containing `mock-`, `demo`, `example.com`, `placeholder`, `localhost`, or `test` must not be shown as verified external evidence.
- Mock/demo evidence should route internally to a detail page when possible.
- If a trustworthy source URL is not available, show evidence as unavailable.

## Flow Into Storage

When the real source is later trusted, its announcements should flow through the same storage model as mock/demo data:

1. Fetch announcement metadata from the source adapter.
2. Validate and normalize the payload.
3. Reject mock/demo, placeholder, or invalid URLs before storage.
4. Insert or reuse `raw_announcements` only for validated external URLs.
5. Map to `intelligence_items`.
6. Preserve source provenance, timestamps, and raw payload.
7. Run deterministic scoring before any alert generation.

## Recommendation

Use:

- adapter-first design
- manual fetch first
- mock fallback always available
- scheduler later only after validation

This keeps Trader AI evidence-led, review-only, and safe to extend.
