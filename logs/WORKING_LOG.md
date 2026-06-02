# Working Log - Trader AI

Use this file to keep Codex and future sessions aligned.

## Current status

- Folder created locally at `C:\Users\Chris\OneDrive\Documents\Trader AI`.
- GitHub repo intended: `https://github.com/ccn262/Trader-AI.git`.
- Product boundary agreed: decision support only.
- User will manually place trades in Trading 212.
- Phase 1 static prototype is implemented locally with mock data.
- Routes added: Dashboard, Watchlists, Portfolio, Journal, Alerts, and Settings.
- Validation completed: `npm run lint` and `npm run build` pass.
- Phase 2 Supabase wiring is implemented with server-side fallback to mock data when env vars are missing.
- Schema and seed migration added at `supabase/migrations/20260602_phase2_trader_ai.sql`.
- README now lists the required Supabase environment variables.

## Next recommended action

1. Provision Supabase and run the migration/seed locally or in the project database.
2. Add asset detail pages and CRUD mutations once reads are verified.
3. Decide whether auth is needed for later user-specific workflows.

## Codex starter instruction

Build Phase 1 only: a static mobile-first prototype using mock data. Do not connect Supabase yet. Do not add live market APIs yet. Do not add automated trading. Follow `.codex/CODEX_BRIEF.md`, `docs/PRODUCT_SPEC.md`, `docs/DESIGN_SPEC.md`, and `docs/GUARDRAILS.md`.
