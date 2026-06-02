# Alert Generation Spec

## Purpose

Evidence-driven opportunity alerts convert scored intelligence into review-only prompts for human review.

They do not place trades, do not imply certainty, and do not tell the user to buy.

## Authority

This spec must align with [docs/TRADER_AI_CONSTITUTION.md](./TRADER_AI_CONSTITUTION.md). If there is a conflict, the constitution wins.

## How Intelligence Becomes An Alert

The generation layer should:

1. Read scored `intelligence_items`.
2. Check whether the item is already linked to an opportunity alert.
3. Apply deterministic generation rules.
4. Create a review-only `opportunity_alerts` row when appropriate.
5. Link supporting `opportunity_evidence` records back to the scored intelligence.

Alerts are derived from evidence, not invented as recommendations.

## Which Intelligence Should Generate Alerts

Usually alert-worthy:

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

Usually intelligence-only unless the wording is materially significant:

- `holdings_tr1`
- `other`

## Priority Mapping

Alerts should map the scored intelligence priority into one of these review states:

- `high_priority_review`
- `watch_today`
- `monitor_only`
- `speculative_review`
- `avoid_or_reassess`

Rules:

- Critical downside evidence should prefer `avoid_or_reassess`.
- Strong positive catalysts should usually become `watch_today` or `high_priority_review`.
- Speculative resource or penny-share catalysts should remain `speculative_review`.
- Informational items should remain `monitor_only` or not generate an alert at all.

## Risk Mapping

Risk should stay explicit and visible on the alert card.

Suggested mapping:

- `critical`: going-concern or solvency risk
- `high`: dilution, warning language, or material event risk
- `speculative`: mining/resource or penny-share catalysts
- `medium`: neutral board change, director activity, mixed update
- `low`: stable, lower-volatility, or broad-market context

## Suggested Position Range Rules

Position range is planning guidance only.

Rules:

- Critical or avoid cases should be `£0`.
- Speculative catalysts should stay very small.
- Positive quality catalysts should stay small and risk-based.
- Small accounts should stay especially conservative.
- Cash should remain a position.

Small-account guidance:

- `£50` portfolio:
  - critical/avoid: `£0`
  - speculative/penny share: `£1-£3`
  - higher-confidence swing or quality catalyst: `£5-£10`
- `£100-£500` portfolio:
  - speculative ideas: usually `1-5%`
  - higher-confidence review ideas: usually `1-5%`
  - never suggest overconcentration

## Suggested Hold Timeframe Rules

Match the timeframe to the catalyst window.

- `going_concern_warning`: avoid until clarified
- `placing_fundraising`: wait for dilution impact and market reaction
- `drill_results` / `resource_update`: same day to 5 trading days, or until follow-up confirmation
- `final_results` / `trading_update`: 1 to 10 trading days or after the market reaction
- `director_dealings`: monitor for confirmation
- `m_and_a_takeover`: event window
- `holdings_tr1`: monitor only unless material

## Exit And Invalidation Rules

The alert must explain what would cause a reassessment.

Examples:

- Funding or risk clarification changes the going-concern view.
- Dilution or cash runway changes the placing view.
- Follow-up assays or technical detail weaken the resource thesis.
- Earnings follow-through fades after the initial reaction.
- Insider or holdings context proves immaterial.

## Evidence Linking Rules

Every alert should include evidence lineage.

Rules:

- Link the source intelligence item that triggered the alert.
- Attach at least one primary evidence row.
- Preserve the source URL where available.
- Keep evidence review-only and traceable.
- Prefer deterministic evidence over narrative summaries.
- Real external evidence URLs should open externally and use `rel="noopener noreferrer"`.
- Mock, demo, placeholder, localhost, or test URLs must not be presented as verified external evidence.
- Mock/demo evidence should route internally to the intelligence detail page or be shown as unavailable if no safe internal reference exists.
- Missing evidence must be shown as unavailable instead of linking to a fake or broken source.

## Deduplication And Idempotency

Alert generation must be repeatable.

Rules:

- Do not create duplicate alerts for the same source intelligence item.
- Do not create duplicate evidence rows for the same alert and intelligence item.
- Re-running the generator should be safe.
- If an alert already exists, reuse it and only repair missing evidence if necessary.

## Guardrails And Banned Language

Allowed wording:

- Review opportunity
- Monitor
- Reassess
- Avoid until clarified

Disallowed wording:

- Buy now
- Guaranteed
- Risk free
- Sure thing
- Financial advice

## Wording Principle

The alert should explain why it needs attention, not tell the user what to do.
