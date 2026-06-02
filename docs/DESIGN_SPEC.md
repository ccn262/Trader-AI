# Design Specification - Trader AI

## Design direction

Slick, calm, mobile-first, and easy to read. The app should feel like a lightweight personal trading command centre, not a gambling app.

## Personality

- Confident but cautious
- Clean and modern
- Clear data hierarchy
- No casino-like colours or hype language

## Visual principles

1. Mobile-first cards.
2. Large numbers for portfolio and score data.
3. Clear colour-coded statuses.
4. Minimal clutter.
5. One primary action per screen.
6. Warnings should be visible but not frightening.

## Suggested UI structure

### Mobile navigation

Bottom tab bar:

- Home
- Watchlists
- Portfolio
- Journal
- Alerts

Secondary access:

- Settings via top-right icon
- Add button as floating action button or prominent header action

### Desktop navigation

Left sidebar:

- Dashboard
- Watchlists
- Assets
- Portfolio
- Journal
- Alerts
- Research
- Settings

## Core screens

### Dashboard

Cards:

1. Portfolio Summary
   - Total value
   - Cash
   - Day/manual change
   - Risk mode

2. AI Watchlist Scores
   - Asset ticker
   - Score
   - Status
   - Last reviewed

3. Alerts Due
   - Alert type
   - Asset
   - Action

4. Recent Journal Entries
   - Asset
   - Action
   - Lesson

### Watchlist screen

List cards:

- Watchlist name
- Number of assets
- Average score
- Risk profile
- Last reviewed

### Asset detail screen

Sections:

- Header: ticker, name, status, score
- Price snapshot
- Score breakdown
- Research notes
- Alerts
- Journal history
- Manual action buttons: Add note, Log trade, Create alert

### Trade journal screen

Emphasis:

- Show reason and lesson learned.
- Use filters: open, reviewed, winning, losing, paper trades.

## Colour system

Use semantic tokens rather than hard-coding colours everywhere.

Suggested tokens:

- Background: near-black or off-white depending theme
- Surface: card background
- Primary: cool blue or teal
- Success: green
- Warning: amber
- Danger: red
- Muted: grey

Status colours:

- Buy Zone: green, but never with hype wording
- Watch: blue
- Wait: amber
- Avoid: red
- Hold: neutral

## Typography

- Use a clean sans-serif.
- Large numeric display for scores and portfolio value.
- Avoid dense table layouts on mobile.

## Mobile UX details

- Minimum tap target: 44px.
- Sticky bottom navigation.
- Search assets from watchlist screen.
- Use slide-up sheets for Add Asset, Add Alert, Log Trade.
- Keep forms short and step-based where possible.

## Accessibility

- Colour should not be the only status indicator.
- Include labels: Buy Zone, Watch, Wait, Avoid.
- Use sufficient contrast.
- Support keyboard navigation on desktop.

## Tone of interface copy

Good:

- "Review before action"
- "Risk check required"
- "Decision support only"
- "What changed?"

Avoid:

- "Guaranteed winner"
- "Double your money"
- "No-brainer trade"
- "Risk-free"
