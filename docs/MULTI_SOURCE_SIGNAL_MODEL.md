# Multi-Source Signal Model

## Purpose

Trader AI needs a disciplined way to handle many evidence and signal sources without treating them as equal.

The model separates:

- primary evidence
- confirming professional news
- aggregator context
- press-wire distribution
- social/forum discovery signals

The goal is to preserve evidence quality, source trust, and user safety while keeping the product decision-support only.

## Evidence Versus Signals

### Evidence

Evidence is the strongest form of source-backed information. It usually comes from:

- official filings
- regulator or company disclosure
- validated external source URLs

Evidence can materially affect scoring and can support review opportunities.

### Signals

Signals are weaker or more contextual source outputs that may help explain why something deserves review.

Examples:

- Reuters confirming a filing
- Yahoo Finance summarising a price move
- a GlobeNewswire press release
- a Reddit post pointing to market attention

Signals should inform context, not override primary evidence.

## Source Tiers

### Tier 1 Primary Evidence

Examples:

- RNS
- SEC filings
- company announcements

Rules:

- highest weighting
- can create review opportunities
- does not imply certainty
- still requires manual decision-making

### Tier 2 Professional Financial News

Examples:

- Reuters
- Bloomberg
- Financial Times
- Dow Jones

Rules:

- strong but licensed or paid access may apply
- can create alerts if credible and not rumour-only
- can support or confirm primary evidence
- should not be treated as a substitute for the filing itself

### Tier 3 Aggregators And Financial Sites

Examples:

- Yahoo Finance
- MarketWatch
- MarketBeat
- Investing.com

Rules:

- useful for context and confirmation
- lower weighting than primary evidence and professional news
- usually should not create a strong alert without primary confirmation

### Tier 4 Press Release Wires

Examples:

- GlobeNewswire
- PR Newswire
- Business Wire

Rules:

- useful for review and monitoring
- may be company-authored or promotional
- should be labelled clearly as press-wire content
- can create review alerts, but weighting should stay modest

### Tier 5 Forums And Social Sentiment

Examples:

- Reddit
- StockTwits
- X / Twitter
- LSE share chat
- ADVFN

Rules:

- discovery only unless verified elsewhere
- cannot create high-confidence opportunity alerts alone
- must not override primary evidence
- rumour or pump-risk language should reduce confidence

## Confidence Weighting By Tier

Suggested default weighting:

- Tier 1: `1.00`
- Tier 2: `0.80`
- Tier 3: `0.55`
- Tier 4: `0.35`
- Tier 5: `0.15`

Weighting should be reduced further when:

- the source is a rumour
- the source looks promotional
- the item is unconfirmed
- the source is paid or protected but not yet validated

## How Source Types Affect Scores

- Tier 1 can materially shape a score.
- Tier 2 can support or confirm a review opportunity.
- Tier 3 should usually contextualise rather than dominate.
- Tier 4 should stay review-only and never be treated as independent proof.
- Tier 5 should mostly identify what might need checking next.

## Social And Forum Data

Social and forum data are discovery-only unless primary evidence confirms them.

Rules:

- treat them as weak signals
- do not let rumours drive a strong score
- do not let pump-language boost confidence
- show a warning when a review card contains social/discovery signals

## Bloomberg / Reuters / FT Access

Professional news providers should be treated as paid or licensed sources unless the user has valid access.

Rules:

- do not scrape protected content aggressively
- do not assume access exists
- record licence status explicitly
- keep access methods and source tiers visible in the UI

## Banned Behaviour

- Forums alone must not create high-confidence buy-style alerts.
- Rumours must not raise opportunity confidence without primary evidence.
- No scraping of paid or protected content.
- No aggressive crawling.
- No hidden bypasses of site controls.
- No language implying guaranteed results.

## Examples

### RNS Trading Update

- Tier: 1
- Signal type: primary evidence
- Effect: high weighting, review-worthy

### Reuters Confirmation

- Tier: 2
- Signal type: confirming news
- Effect: supports the filing or market context

### Yahoo Summary

- Tier: 3
- Signal type: aggregator summary
- Effect: contextual only, lower weighting

### GlobeNewswire Press Release

- Tier: 4
- Signal type: press release
- Effect: monitor/review, not independent proof

### Reddit Ticker Spike

- Tier: 5
- Signal type: social attention
- Effect: discovery only until verified

### Guaranteed Multibagger Pump Risk Flag

- Tier: 5
- Signal type: pump risk warning
- Effect: reduce confidence and require primary evidence

## Implementation Notes

- Store source tiers and licence status in the database.
- Keep rumour and pump-risk flags explicit on intelligence items.
- Use source weighting to explain, not to replace, human review.
- Preserve mock/demo fallback so the app remains usable before live integration.
- Never treat mock URLs as verified evidence.
