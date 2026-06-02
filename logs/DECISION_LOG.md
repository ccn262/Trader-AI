# Decision Log - Trader AI

## 2026-06-01 - Product boundary

Decision: Trader AI is decision support only.

Reason: The user will manually place trades in Trading 212. This reduces risk and keeps the product focused on research, monitoring, journaling, and alerts.

Impact:

- No automated trading.
- No broker order placement.
- No buy/sell certainty language.

## 2026-06-01 - Mobile-first direction

Decision: The app should be slick, easy to see, and mobile-friendly.

Reason: The user wants quick monitoring of stocks, watchlists, and alerts.

Impact:

- Bottom navigation on mobile.
- Card-based screens.
- Short forms and clear action buttons.

## 2026-06-01 - Manual-first data

Decision: Start manual-first before live market APIs.

Reason: The core behaviour and discipline should work before adding data complexity.

Impact:

- Manual portfolio values initially.
- Manual alerts initially.
- AI score can start with manual inputs/mock data.

## 2026-06-02 - Supabase wiring scope

Decision: Add Supabase for database access and server-side reads only, while keeping a mock fallback when env vars are missing.

Reason: Phase 2 should prepare the app structure for persisted data without breaking the static prototype or introducing auth overhead too early.

Impact:

- No broker integration or auto-trading.
- No auth required yet.
- App remains usable offline or before Supabase is provisioned.
- Supabase env vars are documented in `README.md`.
