# Opportunity Engine Spec

## Purpose

The Opportunity Engine turns verified intelligence into reviewable opportunities.

It does not tell the user to trade. It creates structured opportunities for human review.

## Authority

This spec must be read alongside [docs/TRADER_AI_CONSTITUTION.md](./TRADER_AI_CONSTITUTION.md). The constitution defines the product’s non-negotiable boundaries.

## Core Rule

AI never decides.

The engine gathers evidence, scores confidence, explains reasoning, and presents opportunities. The user makes the final decision manually.

## Opportunity Types

- Long-term investment
- Swing trade
- Penny share catalyst
- Mining/resource catalyst
- Earnings momentum
- Special situation
- ETF/sector rotation

## Opportunity Lifecycle

1. Ingest verified intelligence.
2. Group evidence into an opportunity candidate.
3. Score the candidate.
4. Generate an explanation and review card.
5. Attach a suggested timeframe and risk context.
6. Present as “Review opportunity”.
7. Allow the user to accept, ignore, monitor, or reassess.

## Scoring Model

Use a transparent score built from multiple dimensions.

Suggested components:

- Evidence strength
- Source confidence
- Recency
- Catalyst relevance
- Valuation or trend context
- Risk penalty
- Contradiction penalty
- Liquidity penalty

Suggested score output:

- 0 to 100 overall opportunity score
- Separate confidence score
- Separate risk score

Interpretation:

- High score means strong evidence for review, not a recommendation to buy.
- Low score means the item may still be worth monitoring.
- A high risk score should reduce the final opportunity score.

## Required Evidence Fields

Every opportunity card should include:

- Opportunity type
- Asset name
- Symbol
- Evidence summary
- Source list
- Confidence score
- Risk notes
- Suggested position range
- Suggested hold timeframe
- Suggested exit plan
- Suggested review date

Optional but useful:

- Catalyst date
- Last updated time
- Contradictions found
- Watchlist or portfolio status

## Suggested Position Range Logic

Position range should be expressed as a planning range, not an execution instruction.

Inputs:

- Confidence
- Risk category
- Portfolio size
- Cash available
- Liquidity
- Volatility
- Existing exposure

Guidelines:

- Higher confidence may allow a slightly wider planning range.
- Higher volatility should narrow the range.
- Small accounts should default to very small sizing.
- Concentration risk should reduce the allowed range.
- Cash must remain a position and should not be fully deployed by default.

## Suggested Hold Timeframe Logic

Hold timeframe should reflect the thesis, not the user’s emotions.

Guidelines:

- Long-term investment: weeks to months or longer
- Swing trade: days to weeks
- Catalyst-driven idea: tied to the event window
- Special situation: event-specific horizon
- Sector rotation: weeks to months

Rules:

- Timeframe must be linked to evidence.
- If the catalyst window is unclear, the opportunity should be downgraded to monitor status.

## Exit Plan Logic

Exit planning should be explicit even for review-only opportunities.

Suggested exit plan fields:

- Thesis invalidation trigger
- Time-based reassessment point
- Catalyst completion point
- Risk limit trigger
- Review date

Rules:

- Avoid language that implies certainty.
- Avoid “set and forget” thinking.
- Always explain what would cause the idea to be reconsidered.

## “Review Opportunity” Wording Rules

Use wording that invites analysis, not execution.

Allowed examples:

- Review opportunity
- Worth reviewing
- Monitor for confirmation
- Reassess after earnings
- Review if liquidity improves

Disallowed examples:

- Buy now
- Guaranteed profit
- Sure thing
- Must buy
- No-brainer trade

## Alert Card Examples

### Example 1: Long-Term Investment

- Type: Long-term investment
- Asset: VWRP
- Summary: Broad global equity exposure remains consistent with long-term allocation goals.
- Confidence: High
- Risk note: Market risk remains present; sizing should stay within portfolio rules.
- Action: Review opportunity

### Example 2: Earnings Momentum

- Type: Earnings momentum
- Asset: MSFT
- Summary: Earnings surprise and guidance revision may justify a fresh review.
- Confidence: Medium-high
- Risk note: Trend continuation can fail quickly after earnings.
- Action: Review opportunity

### Example 3: Special Situation

- Type: Special situation
- Asset: RR.L
- Summary: Corporate or sector-specific event could change the risk/reward profile.
- Confidence: Medium
- Risk note: Event risk and headline volatility are elevated.
- Action: Review opportunity

### Example 4: Penny Share Catalyst

- Type: Penny share catalyst
- Asset: PLTR
- Summary: Catalyst-driven move may be developing, but evidence quality must remain tight.
- Confidence: Medium
- Risk note: Volatility and narrative risk are elevated.
- Action: Review opportunity

## Non-Goals

- Autonomous ordering
- Language that mimics broker instructions
- Guaranteed return framing
- Overconfident recommendations without verified evidence

