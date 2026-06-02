# AI Scoring Specification - Trader AI

## Purpose

The AI score is a structured research summary. It is not a prediction engine and not financial advice.

## Score components

Each component is scored 0-20.

### 1. Trend score

Looks at price trend and market direction.

Inputs:

- Price versus moving averages
- Recent higher highs/lows
- Market index trend
- Sector trend

### 2. News/sentiment score

Looks at recent news and sentiment.

Inputs:

- Positive catalysts
- Negative catalysts
- Earnings news
- Regulatory or legal risk
- Analyst tone if available

### 3. Quality/fundamentals score

Looks at business or ETF quality.

Inputs for stocks:

- Revenue growth
- Profitability
- Balance sheet
- Competitive position

Inputs for ETFs:

- Diversification
- Ongoing cost
- Fund size
- Tracking quality

### 4. Valuation/risk score

Looks at whether risk is elevated.

Inputs:

- Valuation versus history/peers
- Volatility
- Concentration risk
- Drawdown risk

### 5. Setup/timing score

Looks at whether the timing is sensible.

Inputs:

- Support/resistance
- Pullback or breakout
- Earnings date proximity
- Risk/reward setup

## Total score interpretation

- 80-100: Strong watch / possible action after manual review
- 65-79: Watch
- 45-64: Wait
- 0-44: Avoid for now

## Required output fields

- Total score
- Label
- Summary
- Bull case
- Bear case
- What would change the view
- Suggested review date

## Required disclaimer

"This score is decision support only. It is not financial advice and does not guarantee returns."

## Prompt template

Use this template when integrating AI later:

```
You are an investment research assistant inside Trader AI.
Your role is to provide decision support only. You must not give guaranteed predictions or direct trade instructions.

Asset: {{ticker}} - {{name}}
Asset type: {{asset_type}}
User strategy: {{strategy}}
Risk mode: beginner
Available research notes: {{notes}}
Recent price data: {{price_data}}
Recent news data: {{news_data}}

Score the asset from 0-100 using:
- Trend 0-20
- News/sentiment 0-20
- Quality/fundamentals 0-20
- Valuation/risk 0-20
- Setup/timing 0-20

Return JSON with:
- trend_score
- sentiment_score
- quality_score
- valuation_risk_score
- setup_score
- total_score
- label
- summary
- bull_case
- bear_case
- what_would_change_view
- review_date
- risk_warning

Do not use hype language. Do not guarantee returns. Do not instruct the user to trade.
```
