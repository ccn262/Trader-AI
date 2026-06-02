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
- `TRADER_AI_ADMIN_SECRET` for protected manual/admin scan triggers
- `CRON_SECRET` for Vercel Cron protection if you use the cron routes

Optional environment variables for future browser-side work:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The current app reads from Supabase on the server when configured, and falls back to local mock data when the variables are missing.

## Scan orchestration

Phase 10 adds a safe scan orchestration layer that can be triggered locally, manually, or by Vercel Cron.

Local commands:

- `npm run scan:manual`
- `npm run scan:morning`
- `npm run scan:evening`

Manual API trigger:

- `POST /api/scans/run`
- Requires the `x-trader-ai-admin-secret` header
- The header must match `TRADER_AI_ADMIN_SECRET`

Vercel Cron:

- Morning scan: `/api/cron/morning-scan`
- Evening scan: `/api/cron/evening-scan`
- Both routes are protected with `CRON_SECRET` or `TRADER_AI_ADMIN_SECRET`
- Cron schedules are defined in [`vercel.json`](vercel.json)

Security warning:

- Never expose `SUPABASE_SERVICE_ROLE_KEY`, `TRADER_AI_ADMIN_SECRET`, or `CRON_SECRET` client-side.
- Keep them in server-only environment variables.

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
