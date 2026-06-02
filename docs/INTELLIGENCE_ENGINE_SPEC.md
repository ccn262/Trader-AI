# Intelligence Engine Spec

## Purpose

The Intelligence Engine gathers, stores, verifies, and classifies evidence that may matter to the user’s investing and trading research workflow.

Trader AI remains decision support only. It does not place trades, connect to broker execution, or make autonomous investment decisions.

## Authority

This spec must be read alongside [docs/TRADER_AI_CONSTITUTION.md](./TRADER_AI_CONSTITUTION.md). If there is any conflict, the constitution wins.

## Design Goals

- Collect useful evidence without overwhelming the user.
- Separate raw claims from verified facts.
- Preserve source provenance and freshness.
- Prefer traceability over speed.
- Stay mock-first until real integrations are intentionally added.

## Intelligence Categories

### Market Data Intelligence

Used to understand price action, liquidity, and market context.

Examples:

- Price
- Volume
- Relative volume
- Volatility
- Market cap
- Bid/ask spread
- Gap size
- Trend context

### Company Intelligence

Used to understand the company’s own disclosures and events.

Examples:

- SEC filings
- UK RNS announcements
- Earnings releases
- Trading updates
- Investor presentations
- Results slides
- Guidance updates

### Sector Intelligence

Used to understand macro or theme-driven context.

Examples:

- Commodity prices
- Defence spending
- Airline activity
- Economic indicators
- Rate expectations
- Sector rotation signals

### Alternative Intelligence

Used as supporting context only, never as the sole basis for a material score change.

Examples:

- Analyst reports
- ETF flows
- Reddit
- X
- StockTwits

## Evidence Model

Every evidence item should store:

- Source name
- Source type
- Source URL or reference
- Timestamp captured
- Asset or sector scope
- Claim summary
- Raw text excerpt or structured payload
- Verification status
- Confidence score
- Freshness score
- Contradiction flags
- Corroboration links

## Source Confidence Rules

Base confidence should be assigned by source class before additional verification steps are applied.

Suggested hierarchy:

- Company filing: 100
- Government data: 95
- Reuters: 90
- Financial Times: 90
- Major financial news: 80
- Yahoo Finance: 70
- Social media: 40
- Unverified source: 10

Rules:

- Higher-confidence sources can materially influence scores sooner.
- Lower-confidence sources may raise review priority, but should not materially change an opportunity without corroboration.
- A single low-confidence source should not trigger a strong score change.
- A claim affecting opportunity or risk should be corroborated before promotion.

## Evidence Verification Workflow

1. Capture raw evidence.
2. Normalize the source and asset mapping.
3. Classify the claim type.
4. Assign initial confidence based on source class.
5. Check freshness.
6. Compare against prior evidence and current state.
7. Look for corroboration from independent sources.
8. Flag contradictions or stale items.
9. Promote to verified, partially verified, or unverified.
10. Store both the raw claim and the verified conclusion.

Verification rules:

- Material claims require independent support where practical.
- Official company or government disclosures outrank commentary.
- If evidence conflicts, retain both sides and lower confidence until resolved.
- A confidence score must reflect both source quality and evidence agreement.

## Morning And Evening Scan Workflow

### Morning Scan

The morning scan should prioritize:

- Market health
- Overnight changes
- New opportunities
- Earnings calendar
- Major filings
- High-priority reviews

Output should highlight what changed since the previous scan, not repeat everything known.

### Evening Scan

The evening scan should prioritize:

- Market summary
- New intelligence
- Portfolio review
- Watchlist changes
- Opportunities for tomorrow

Output should focus on end-of-day reflection and what deserves follow-up.

## Data Retention Approach

The engine should separate raw evidence from derived assessments.

Recommended layers:

- Raw evidence: immutable or append-only records
- Normalized facts: deduplicated, structured, linked to source
- Derived scores: recomputable assessments
- User-visible summaries: concise, editable presentation layer

Retention principles:

- Keep source lineage for every derived item.
- Preserve the most recent state plus enough history to explain score changes.
- Archive stale signals rather than deleting them.
- Allow historical review of what the engine knew at the time.

## Failure Handling

The engine should fail safely.

Common failure modes:

- Source unavailable
- Partial response
- Duplicate source record
- Stale data
- Conflicting claims
- Parsing failure
- Incomplete metadata

Handling rules:

- Degrade confidence instead of inventing certainty.
- Preserve the last known valid state when fresh data is unavailable.
- Mark outputs as stale or partial when needed.
- Never promote an unverified claim to high confidence.
- Surface operational errors as internal status, not user hype.

## Mock-First Implementation Approach

Phase 4 remains planning only. Future implementation should start with mock data and deterministic fixtures.

Recommended approach:

- Use local fixtures to represent source feeds.
- Simulate morning and evening scans on a schedule or manual trigger.
- Store mocked evidence records using the same schema intended for real data.
- Keep adapters thin so real integrations can replace them later.
- Avoid live market APIs until the data contract is stable.
- Avoid AI API calls until the evidence and scoring model are stable.

## Non-Goals

- Broker execution
- Automated trading
- Guaranteed outcomes
- Real-time market feed dependency for the initial implementation
- Social-signal driven decision making without verification

