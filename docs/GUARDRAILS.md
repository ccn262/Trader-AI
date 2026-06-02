# Guardrails - Trader AI

## Primary rule

Trader AI is a decision-support app only. It must never place trades or claim certainty.

## Product guardrails

### Allowed

- Watchlists
- Manual portfolio tracking
- Research notes
- AI-generated summaries
- Scoring models
- Manual alerts
- Trade journal
- Education and process guidance

### Not allowed in MVP

- Automated trade execution
- Broker API order placement
- Copy trading
- Leveraged CFD workflows
- Options trading workflows
- "Guaranteed profit" language
- Pushy buy/sell instructions

## AI output rules

AI may say:

- "Watch"
- "Wait"
- "Avoid for now"
- "Possible buy zone after manual review"
- "Risk is elevated"
- "This needs more evidence"

AI must not say:

- "This will go up"
- "Guaranteed winner"
- "You should put all your money in"
- "Double your money today"
- "Risk-free"

## Risk management rules

Default beginner mode:

- No leverage.
- No CFDs.
- No trade idea without a written reason.
- Max risk per speculative trade: 2% of portfolio value.
- For a £50 account, max risk is £1.
- Core ETF allocation should remain the main holding until user changes strategy deliberately.

## Journal enforcement

A trade journal entry must include:

1. Reason for trade
2. Risk amount
3. Stop-loss idea
4. Review date

If missing, show:

"Risk check incomplete. Add a reason, risk amount, stop-loss idea, and review date before saving."

## Alerts guardrails

Alerts should prompt review, not action.

Good alert copy:

- "NVDA crossed your review level. Check research before acting."
- "Portfolio review due today."

Bad alert copy:

- "Buy NVDA now."
- "Sell immediately."

## App disclaimer

Display in Settings and AI Scorecard:

"Trader AI is a personal research and journaling tool. It is not financial advice. It does not place trades and does not guarantee returns. You are responsible for all decisions made in your Trading 212 account."

## Change control

Any future feature involving broker integration, auto-trading, leverage, CFDs, options, crypto, or signals must be explicitly approved by the user and documented in `logs/DECISION_LOG.md` before implementation.
