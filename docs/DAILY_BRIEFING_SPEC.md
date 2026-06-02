# Daily Briefing Spec

## Purpose

The daily briefing is the user-facing summary of what matters today.

It must answer:

> What should I pay attention to today?

It should never imply certainty or guarantee outcomes.

## Authority

This spec must align with [docs/TRADER_AI_CONSTITUTION.md](./TRADER_AI_CONSTITUTION.md).

## Briefing Modes

### Morning Briefing

The morning briefing should help the user start the day with focus.

Include:

- Market health score
- New intelligence
- High-priority reviews
- Overnight changes
- Watchlist changes
- Portfolio items requiring attention

### Evening Briefing

The evening briefing should help the user close the day with context.

Include:

- Market summary
- Portfolio review
- New intelligence
- Items to monitor tomorrow
- Reassessment points

## Market Health Score

The market health score is a simple summary, not a trading signal.

Suggested components:

- Breadth
- Volatility
- Risk appetite
- Sector rotation
- Event density

Output should be easy to scan on mobile and explained in plain language.

## Portfolio Review

The portfolio section should show:

- Current positions
- Cash
- Changes since last briefing
- Concentration notes
- Risk alerts

## Watchlist Changes

The briefing should highlight:

- New additions
- Removed or archived items
- Score changes
- New evidence
- Upcoming events

## New Intelligence

This section should summarise:

- Major filings
- News updates
- Sector developments
- Price or volume context
- High-confidence source changes

## High-Priority Reviews

Show the highest-value items first.

Prioritise:

- High confidence
- Material change
- Near-term event risk
- Position risk
- Liquidity risk

## Suggested Actions

Use only the following action labels:

- Review
- Monitor
- Ignore
- Reassess

Rules:

- “Review” means the item merits human attention.
- “Monitor” means keep it on the radar.
- “Ignore” means no meaningful change or insufficient evidence.
- “Reassess” means the evidence exists, but timing or confidence is not yet sufficient.

## Wording Rules

Allowed:

- Review opportunity
- Worth reviewing
- Monitor for confirmation
- Reassess after earnings
- High-priority review

Disallowed:

- Buy now
- Guaranteed
- Sure thing
- Risk-free

## Mobile Presentation Rules

- Keep cards short.
- Put the most important items first.
- Use clear labels.
- Avoid long paragraphs.
- Make actions obvious with large touch targets.

## Non-Goals

- Trading instructions
- Broker commands
- Overly verbose market commentary
- Language that overstates confidence

