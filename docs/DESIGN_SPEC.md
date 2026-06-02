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

## Attention hierarchy

Trader AI should make the most important thing obvious within a second.

Priority colours:

- Red: urgent, high-risk, review now, avoid
- Amber: watch today, medium priority, review reminders
- Green: healthy, low-risk, on track, completed
- Blue: informational, core, long-term, calm
- Purple: speculative, penny share, high volatility

Usage rules:

- Red is reserved for urgent or high-risk states only.
- Amber is for items that deserve attention today but are not urgent.
- Green is for healthy or completed states, or stable cash/core tracking.
- Blue is for calm, core, long-term information that should not feel noisy.
- Purple is for speculative or high-volatility ideas that need extra caution.
- Every priority chip or card must include text and/or an icon, not colour alone.

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

### Evidence and intelligence detail screens

When surfacing evidence from alerts or announcements:

- Real external source URLs should be clearly labeled `Open source`.
- Mock, demo, placeholder, localhost, or test URLs must never look like verified live evidence.
- Demo/sample evidence should be routed internally to the intelligence detail screen and clearly labeled as not live market evidence.
- Missing evidence must be shown as `Evidence unavailable` or `External source unavailable`.
- Internal evidence pages should show the raw announcement, scoring context, and decision-support warning in a readable card layout.

### Source candidate and signal screens

The `/sources` and `/sources/[id]` screens should show:

- source tier
- licence status
- access method
- weighting multiplier
- whether the source can create alerts
- whether primary confirmation is required
- latest diagnostic summary and recommendation

The UI should make discovery-only social/forum sources visibly different from primary evidence sources without hiding them completely.

The `/intelligence/[id]` screen should surface signal type, tier, licence status, rumour/pump-risk flags, and primary confirmation state so users can judge source reliability before reading the summary.

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

- Review now: red
- Watch today: amber
- On track / healthy: green
- Core / long-term: blue
- Speculative / high volatility: purple
- Avoid: red

Card guidance:

- High-priority review cards should use red accents.
- Watch-today cards should use amber accents.
- Healthy or completed cards should use green accents.
- Core long-term cards should use blue accents.
- Speculative and penny-share cards should use purple accents.
- Do not use the same colour for every card state.

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

- Colour should never be the only status indicator.
- Include labels such as Review, Watch, Monitor, Reassess, Avoid, Core, and Healthy.
- Pair colour with icons, badges, and short explanatory text.
- Use sufficient contrast in both light and dark surfaces.
- Support keyboard navigation on desktop and readable touch targets on mobile.
- Evidence state labels must be textual as well as visual: `Open source`, `View evidence`, `View demo evidence`, and `Evidence unavailable`.
- Discovery-only signals must show a textual warning such as `Discovery signal only — primary evidence required before acting.`

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
