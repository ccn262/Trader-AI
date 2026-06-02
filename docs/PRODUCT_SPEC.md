# Product Specification - Trader AI

## Vision

Trader AI is a personal decision-support platform for learning investing and trading discipline. It combines watchlists, AI-assisted research, scoring, alerts, portfolio tracking, and trade journaling.

The app supports the user in making better manual decisions. It does not place trades.

## Target user

A UK-based beginner investor/trader using Trading 212 with a small starting account. The user wants to learn the process, monitor ETFs and stocks, and eventually build a useful AI-driven platform.

## Core goals

1. Make market monitoring simple and visual.
2. Separate long-term ETF investing from higher-risk short-term ideas.
3. Create discipline through journaling and risk limits.
4. Build a repeatable scoring process.
5. Avoid emotional or impulsive trades.

## Non-goals

- No automated trading.
- No CFD execution.
- No options execution.
- No crypto gambling workflow in MVP.
- No guaranteed profit predictions.
- No broker connection in MVP.

## MVP modules

### 1. Dashboard

Purpose: quick daily snapshot.

Must show:

- Portfolio value entered manually
- Cash available
- ETF allocation
- Watchlist count
- Alerts due
- Top scored assets
- Recent trade journal entries

Mobile layout:

- Top summary card
- Horizontal quick action cards
- Watchlist score list
- Alerts list
- Journal reminders

### 2. Watchlists

Purpose: organise assets by intent.

Default watchlists:

- Core ETFs
- UK Stocks
- US Stocks
- AI & Technology
- High Risk / Learning Only

Fields:

- Name
- Description
- Risk profile
- Created date

### 3. Assets

Purpose: track individual ETFs/stocks.

Fields:

- Ticker
- Name
- Market
- Asset type: ETF, stock, fund, cash, other
- Currency
- Watchlist
- Risk level: low, medium, high, speculative
- Status: research, watch, buy zone, hold, avoid
- Notes

### 4. AI Scorecard

Purpose: score research quality and risk/reward, not predict certainty.

Score components:

- Trend score: 0-20
- News/sentiment score: 0-20
- Quality/fundamentals score: 0-20
- Valuation/risk score: 0-20
- Setup/timing score: 0-20

Total:

- 80-100: Strong watch / possible action after manual review
- 65-79: Watch
- 45-64: Wait
- 0-44: Avoid for now

Required disclaimer on score pages:

"This score is decision support only. It is not financial advice and does not guarantee returns."

### 5. Portfolio Tracker

Purpose: track holdings manually from Trading 212.

Fields:

- Asset
- Quantity
- Average buy price
- Current price, manual initially
- Currency
- Account type: ISA, Invest, other
- Strategy: core, swing, learning
- Target allocation
- Notes

### 6. Trade Journal

Purpose: enforce discipline and learning.

Required fields:

- Asset
- Direction: buy, sell, trim, add, paper trade
- Amount
- Entry price
- Reason for trade
- Risk amount
- Stop-loss idea
- Target or review trigger
- Review date
- Emotion before trade
- Result
- Lesson learned

Blocking rule:

A trade journal entry cannot be saved unless reason, risk amount, stop-loss idea, and review date are provided.

### 7. Alerts

Purpose: remind the user to review assets.

Alert types:

- Price above
- Price below
- Score above threshold
- Review due
- News catalyst
- Earnings date
- Manual reminder

MVP alerts can be manual. API-driven alerts come later.

## User flows

### Daily review

1. Open dashboard on phone.
2. See watchlist score changes.
3. Check alerts.
4. Open asset detail.
5. Read research notes.
6. Decide whether to do nothing, watch, or log a manual Trading 212 trade.

### Adding an asset

1. Tap Add Asset.
2. Enter ticker and name.
3. Assign watchlist and risk level.
4. Add initial research note.
5. Save.

### Logging a trade

1. Tap Log Trade.
2. Select asset.
3. Enter amount and price.
4. Enter trade reason.
5. Enter risk amount.
6. Enter stop-loss idea.
7. Enter review date.
8. Save.

## Success criteria

The MVP is successful when the user can manage a £50 manual portfolio and explain why every position exists.
