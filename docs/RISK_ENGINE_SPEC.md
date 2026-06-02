# Risk Engine Spec

## Purpose

The Risk Engine protects capital, limits overtrading, and keeps Trader AI aligned with decision support only.

## Authority

This spec must be read alongside [docs/TRADER_AI_CONSTITUTION.md](./TRADER_AI_CONSTITUTION.md). The constitution defines the product’s final principles.

## Core Objectives

- Preserve capital.
- Reduce avoidable mistakes.
- Keep position sizes appropriate for the account.
- Prevent narrative-driven overexposure.
- Make cash treatment explicit.

## Risk Categories

### Portfolio Risk

The risk of too much exposure to one idea, one sector, or one style.

Controls:

- Concentration checks
- Sector exposure limits
- Cash reserve checks
- Correlation awareness

### Position Risk

The risk attached to a single holding or idea.

Controls:

- Maximum position size
- Risk per idea
- Stop-loss planning
- Thesis invalidation trigger

### Liquidity Risk

The risk that a position is hard to enter or exit cleanly.

Controls:

- Average daily volume checks
- Spread checks
- Market cap and free-float awareness

### Volatility Risk

The risk that price movement is too wide for the account size or timeframe.

Controls:

- Volatility filters
- Wider stop awareness
- Smaller sizing for high-volatility names

### Event Risk

The risk that an upcoming event changes the thesis abruptly.

Controls:

- Earnings awareness
- RNS or SEC filing awareness
- Trial, approval, or regulatory dates
- Catalyst window tracking

### Penny Share Risk

The risk of rapid drawdowns, thin liquidity, and narrative spikes.

Controls:

- Smaller default sizing
- Stronger verification threshold
- Higher volatility penalty
- Wider skepticism on social-signal-only ideas

## Position Sizing Rules

Position sizing should be risk-driven, not excitement-driven.

Principles:

- Size from risk budget first.
- Reduce size when confidence is low.
- Reduce size when volatility is high.
- Reduce size when liquidity is poor.
- Reduce size when the account is small.
- Do not size based on “conviction” alone.

Suggested sizing inputs:

- Total portfolio size
- Cash available
- Risk per idea
- Stop distance
- Liquidity
- Existing exposure

## Cash Allocation Rules

Cash is a position.

Rules:

- Maintain explicit cash tracking.
- Do not assume full deployment is optimal.
- Preserve a reserve for flexibility.
- Small accounts should keep simple and disciplined cash buffers.

## Stop-Loss Planning

Stop-loss planning should be a risk planning exercise, not a guarantee of protection.

Outputs should include:

- Stop-loss idea
- Thesis invalidation level
- Event-aware adjustment
- Review trigger

Rules:

- A stop should reflect volatility and thesis structure.
- A stop should never be treated as a certainty of exit quality.
- The app should not imply guaranteed protection.

## Maximum Exposure Rules

Suggested controls:

- Maximum per-position exposure
- Maximum sector exposure
- Maximum event-driven exposure
- Maximum small-cap or penny-share exposure
- Maximum correlated-bet exposure

Portfolio-level guardrails should scale with account size.

## Small Account Rules For £50-£500 Portfolios

Small accounts need stricter simplicity.

Recommended approach:

- Use very small position sizes.
- Keep fewer holdings.
- Prioritise learning and discipline over activity.
- Keep a cash reserve.
- Avoid over-diversification into tiny allocations.
- Avoid illiquid names unless the thesis is strong and verified.
- Prefer higher-conviction, lower-complexity decisions.

Practical framing:

- £50 account: focus on observation, journaling, and extremely small exposure if any.
- £100-£250 account: keep sizing modest and avoid broad overextension.
- £250-£500 account: allow a small number of controlled positions with clear risk limits.

## Risk Outputs

The engine should produce:

- Portfolio risk summary
- Position risk summary
- Liquidity warning
- Volatility warning
- Event warning
- Suggested risk notes

## Non-Goals

- Automatic trade blocking in a broker
- Guaranteed loss prevention
- Pretending that stop-losses remove all risk
- Encouraging frequent trading

