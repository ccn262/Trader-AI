# Trader AI

Trader AI is a personal decision-support platform for monitoring ETFs, stocks, watchlists, alerts, research notes, and trade journals.

It does not place trades. The user manually executes trades in Trading 212.

## Master authority

The product constitution is the master vision and architecture authority for all future work:

- [docs/TRADER_AI_CONSTITUTION.md](docs/TRADER_AI_CONSTITUTION.md)

## Core principle

Trader AI helps answer: "Should I research, watch, wait, or avoid this asset?"

It must not answer: "Guarantee this trade will make money."

## Stack

- Next.js app
- Supabase for database access and optional server-side access
- GitHub for source control
- Vercel for deployment
- Codex for coding support
- ChatGPT for research, UX, product design, and scoring logic

## Supabase setup

Phase 2 adds database wiring but keeps the app decision-support only.

Required environment variables:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Optional environment variables for future browser-side work:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The current app reads from Supabase on the server when configured, and falls back to local mock data when the variables are missing.

## First milestone

Build a slick mobile-first app with:

1. Dashboard
2. Watchlists
3. Asset detail pages
4. Manual portfolio tracker
5. Trade journal
6. AI scorecard
7. Alerts
8. Guardrails and risk warnings
