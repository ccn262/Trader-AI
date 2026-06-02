# Build Checklist - Trader AI

## Before coding

- Read `README.md`.
- Read `.codex/CODEX_BRIEF.md`.
- Read `docs/GUARDRAILS.md`.
- Confirm feature is decision-support only.

## Before each commit

- Run `npm run lint`.
- Run `npm run build`.
- Check mobile viewport.
- Check no auto-trading language or functionality was introduced.
- Update `logs/CHANGELOG.md` if behaviour changed.

## Before adding a new feature

Ask:

1. Does this help research, monitoring, journaling, or alerts?
2. Does this accidentally imply financial advice?
3. Does this encourage reckless risk?
4. Does this need a guardrail?
5. Is the mobile version usable?

## Manual QA checklist

- Dashboard loads on mobile.
- Bottom nav works.
- Watchlist cards are readable.
- Asset detail is not cluttered.
- Journal form blocks missing risk fields.
- Alert copy prompts review, not action.
- Settings shows disclaimer.
