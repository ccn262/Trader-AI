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
4. Check for duplicates using external id, source URL, or headline plus timestamp.
5. Mark parsing failures explicitly rather than inventing structured fields.
6. Treat financing, going-concern, and speculative mining/resource announcements as higher-risk even when the source is official.
7. Do not turn a single official announcement into a recommendation.

## How Announcements Become `intelligence_items`

Recommended flow:

1. Ingest raw announcement into `raw_announcements`.
2. Store raw payload and ingestion status.
3. Normalize the announcement type from headline and category.
4. Map the normalized result into an `intelligence_items` row.
5. Assign base source confidence.
6. Assign a placeholder impact score.
7. Set verification status based on source quality and parse completeness.

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
