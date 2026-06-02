# Data Source Strategy

## Purpose

This document defines the likely future data sources for Trader AI and how each source should be trusted.

## Authority

This strategy must align with [docs/TRADER_AI_CONSTITUTION.md](./TRADER_AI_CONSTITUTION.md). The constitution governs product boundaries and the role of verification.

## Source Classes

### UK RNS And Company Announcements

Use for official UK market disclosures.

Trust level:

- Very high

Typical use:

- Trading updates
- Director changes
- Financial results
- Corporate actions

### SEC Filings

Use for US official disclosures.

Trust level:

- Very high

Typical use:

- 10-K
- 10-Q
- 8-K
- S-1

### Earnings Calendars

Use for event timing, not as proof of outcome.

Trust level:

- Medium

Typical use:

- Earnings dates
- Guidance windows
- Analyst event timing

### Company Investor Relations Pages

Use for official presentations, transcripts, and updates.

Trust level:

- High

Typical use:

- Results decks
- Webcasts
- Strategic updates

### Market Data Providers

Use for price, volume, valuation, and market structure data.

Trust level:

- Depends on provider quality and latency

Typical use:

- OHLC data
- Relative volume
- Market cap
- Float

### Financial News Providers

Use for coverage and context, but not as sole truth.

Trust level:

- Medium to high depending on outlet

Typical use:

- Breaking news
- Market reaction
- Context on filings and events

### Commodity Data

Use for sector and macro context.

Trust level:

- High when sourced from recognised market data

Typical use:

- Oil
- Gas
- Metals
- Agricultural inputs

### Sector-Specific Data

Use where a sector has unique drivers.

Examples:

- Defence spending
- Airline activity
- Shipping rates
- Clinical trial calendars

### Social Media Sentiment

Use as weak context only.

Trust level:

- Low

Typical use:

- Emerging narratives
- Market attention signals

Rules:

- Never rely on social media alone for a material score.
- Always verify before promotion.

### Analyst Upgrades And Downgrades

Use as secondary context, not as definitive evidence.

Trust level:

- Medium

Typical use:

- Sentiment shift
- Coverage changes
- Relative expectations

## Verification Hierarchy

Suggested ordering from most trusted to least trusted:

1. Company filing or official announcement
2. Government or regulator source
3. Reputable primary market data
4. Major financial news
5. Company IR content
6. Analyst commentary
7. Social media
8. Unverified source

Rules:

- Higher-tier sources can override lower-tier claims.
- Lower-tier claims should be treated as prompts for verification.
- When sources disagree, the higher-tier source wins unless there is a strong reason not to.

## Source Confidence Scoring

The confidence score should reflect:

- Source authority
- Freshness
- Corroboration
- Historical reliability
- Data completeness

Suggested base scores:

- Company filing: 100
- Government data: 95
- Reuters: 90
- Financial Times: 90
- Major financial news: 80
- Yahoo Finance: 70
- Social media: 40
- Unverified source: 10

## Avoiding Over-Reliance On Rumours

Rules:

- Treat rumours as unverified until proven otherwise.
- Do not let one viral post drive an opportunity by itself.
- Do not escalate risk or opportunity scores without source corroboration.
- Flag rumours explicitly as low confidence.
- Prefer official filings, direct company statements, and high-quality reporting.

## Future Integration Guidance

Future implementation should:

- Use a source registry with trust metadata.
- Preserve source provenance in storage.
- Distinguish raw claims from verified summaries.
- Allow source-specific parsing without changing the scoring core.

