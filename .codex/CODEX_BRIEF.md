# Codex Brief - Trader AI

You are building Trader AI, a personal AI-assisted trading research and portfolio monitoring app.

## Hard constraints

1. Decision support only. No automated trading.
2. No broker API execution.
3. No promises of profit.
4. No language implying certainty, such as "guaranteed", "safe win", "will double", or "risk-free".
5. Every trade journal entry must include a reason, risk amount, stop-loss idea, and review date.
6. Mobile-first UX is required.
7. Keep the app simple, slick, fast, and easy to read on a phone.

## Product outcome

The user should be able to:

- Track a small real-money portfolio held in Trading 212.
- Maintain ETF and stock watchlists.
- See watchlist scores and alerts.
- Record trade rationale and lessons learned.
- Use AI-generated research as supporting evidence, not instructions.

## Suggested stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase client/server helpers
- shadcn/ui style components if useful
- Recharts for charts if needed
- Vercel deployment

## Build order

1. Project shell and navigation
2. Dashboard UI
3. Supabase schema
4. Watchlists CRUD
5. Assets CRUD
6. Portfolio positions
7. Trade journal
8. AI scoring model placeholder
9. Alerts engine placeholder
10. Mobile polish

## Definition of done for each PR

- `npm run lint` passes
- `npm run build` passes
- No auto-trading features added
- UI works on mobile viewport
- Sensitive API keys remain in environment variables
- README or logs updated if behaviour changed
