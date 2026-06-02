# Impact Scoring Spec

## Purpose

Deterministic impact scoring gives Trader AI a transparent way to classify official announcements and highlight what deserves review before any AI API is introduced.

The scoring system is evidence-based. It is not predictive certainty.

## Authority

This spec must align with [docs/TRADER_AI_CONSTITUTION.md](./TRADER_AI_CONSTITUTION.md). If there is a conflict, the constitution wins.

## Why Deterministic Scoring Exists

Deterministic scoring helps the product:

- Apply consistent rules to official announcements
- Surface likely significance without hype
- Preserve an audit trail for why an item was flagged
- Avoid hidden or overconfident reasoning
- Stay usable before any language-model scoring exists

Rules-based scoring should suggest what to review, monitor, reassess, or avoid until clarified. It must never imply certainty or execution.

## Classification Categories

Announcements should be classified into one of these categories:

- `final_results`
- `interim_results`
- `trading_update`
- `director_dealings`
- `contract_win`
- `placing_fundraising`
- `drill_results`
- `resource_update`
- `feasibility_study`
- `permitting_approval`
- `m_and_a_takeover`
- `board_change`
- `going_concern_warning`
- `holdings_tr1`
- `other`

## Impact Direction Rules

Impact direction should be one of:

- `positive`
- `negative`
- `neutral`
- `mixed`
- `unknown`
- `speculative`

Meaning:

- `positive`: evidence suggests a constructive review catalyst
- `negative`: evidence raises concern or downside risk
- `neutral`: evidence is informational with little immediate change
- `mixed`: evidence contains both support and concern
- `unknown`: not enough structured evidence to classify confidently
- `speculative`: evidence is potentially catalytic but highly uncertain

## Deterministic Impact Rules

### Positive Catalyst Examples

- Final results with improved cash generation, upgraded guidance, or stronger outlook
- Trading update with upgraded guidance or stronger demand language
- Contract win with materiality language
- Director purchase
- Permitting or regulatory approval
- Friendly takeover or value-enhancing M&A wording

### Negative Catalyst Examples

- Going concern warning
- Trading update with downgrade language
- Fundraising or placing with dilution pressure
- Director sale
- Board resignation with warning language
- Final results below expectations or with weak outlook

### Neutral Or Mixed Examples

- Holdings / TR-1 changes without clear context
- Board changes without obvious warning language
- Results described as in line, stable, or mixed
- M&A language that raises both upside and execution risk

### Speculative Catalyst Examples

- Drill results
- Resource updates
- Feasibility studies
- Early-stage permitting or exploration milestones

These items may carry positive narrative momentum but should remain high-risk and review-only.

## Risk Scoring Rules

Risk level should be one of:

- `low`
- `medium`
- `high`
- `speculative`
- `critical`

Suggested rules:

- `critical`: going concern, solvency pressure, severe funding uncertainty
- `high`: dilutive fundraising, sharp downgrade, severe event risk, warning language
- `speculative`: mining/resource catalysts, penny-share exploration news, thin-liquidity setups
- `medium`: director dealings, mixed updates, neutral board changes
- `low`: stable official results, material contract wins, straightforward approvals

## Priority Mapping

Priority should be one of:

- `high_priority_review`
- `watch_today`
- `monitor_only`
- `speculative_review`
- `avoid_or_reassess`

Suggested mapping:

- `high_priority_review`: material official change with clear significance
- `watch_today`: meaningful but not urgent evidence
- `monitor_only`: informational or mild catalyst
- `speculative_review`: potentially important but uncertain and high-volatility
- `avoid_or_reassess`: severe negative or critical-risk evidence until clarified

## Example Deterministic Rules

### Going Concern Warning

- Classification: `going_concern_warning`
- Impact direction: `negative`
- Impact score: around `-40`
- Risk level: `critical`
- Priority: `avoid_or_reassess`

### Placing / Fundraising

- Classification: `placing_fundraising`
- Impact direction: `negative` or `mixed`
- Impact score: around `-15` to `-25`
- Risk level: `high`
- Priority: `high_priority_review`

### Drill Results

- Classification: `drill_results`
- Impact direction: `speculative`
- Impact score: around `+15` to `+30`
- Risk level: `speculative`
- Priority: `speculative_review`

### Director Dealings

- Director purchase:
  - Impact direction: `positive`
  - Impact score: around `+5` to `+12`
  - Risk level: `medium`
  - Priority: `monitor_only`

- Director sale:
  - Impact direction: `negative`
  - Impact score: around `-5` to `-12`
  - Risk level: `medium`
  - Priority: `watch_today`

### Trading Update

- Upgraded guidance:
  - Impact direction: `positive`
  - Impact score: around `+15` to `+25`

- Downgraded guidance:
  - Impact direction: `negative`
  - Impact score: around `-15` to `-30`

- Mixed or in-line language:
  - Impact direction: `mixed` or `neutral`

### Final Results

- Ahead or improved:
  - Impact direction: `positive`

- Below expectations or weak outlook:
  - Impact direction: `negative`

- Mixed:
  - Impact direction: `mixed`

## Penny Share And Mining Guardrails

Rules:

- Positive-looking exploration headlines must not be treated as low-risk.
- Score speculative mining/resource announcements as `speculative`, not simply `positive`.
- Keep financing, liquidity, and dilution risk explicit.
- For small-cap or penny-share issuers, do not let one headline override broader risk context.
- Use wording such as:
  - Review
  - Monitor
  - Reassess
  - Avoid until clarified

Disallowed wording:

- Buy now
- Guaranteed
- Risk free

## Scoring Reason

Every scored item should store a short deterministic explanation.

Examples:

- "Going concern language creates critical financing risk and requires reassessment."
- "Official drilling update may be catalytic, but remains speculative and high risk."
- "Director purchase is mildly constructive but not enough for urgent action."

## Examples

### Example 1: Final Results

- Headline: "Final Results for the year ended 31 December 2025"
- Classification: `final_results`
- Direction: `positive`
- Impact score: `+18`
- Risk level: `medium`
- Priority: `watch_today`

### Example 2: Trading Update

- Headline: "Trading Update and revised full-year expectations"
- Classification: `trading_update`
- Direction: `mixed`
- Impact score: `-8`
- Risk level: `high`
- Priority: `high_priority_review`

### Example 3: Drill Results

- Headline: "Cascabel drilling update reports additional mineralisation"
- Classification: `drill_results`
- Direction: `speculative`
- Impact score: `+22`
- Risk level: `speculative`
- Priority: `speculative_review`

### Example 4: Going Concern Warning

- Headline: "Going concern statement and financing update"
- Classification: `going_concern_warning`
- Direction: `negative`
- Impact score: `-40`
- Risk level: `critical`
- Priority: `avoid_or_reassess`
