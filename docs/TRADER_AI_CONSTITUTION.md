# Trader AI Constitution

This document is the master vision and architectural authority for Trader AI. All future development must align with it.

## Mission

Trader AI is an intelligence-led investment and trading decision-support platform.

Trader AI does not:

- Place trades.
- Connect directly to brokers for execution.
- Guarantee profits.
- Provide financial advice.
- Encourage reckless speculation.

Trader AI does:

- Gather information.
- Verify information.
- Score opportunities.
- Explain reasoning.
- Help users make informed decisions.
- Help users manage risk.

## Core Principle

AI never decides.

AI gathers evidence, scores confidence, explains reasoning, and presents opportunities.

The user makes the final investment decision manually.

## Primary User Question

"What should I pay attention to today?"

## Product Vision

A mobile-first intelligence platform combining:

- Portfolio management
- Watchlists
- Trade journaling
- Market intelligence
- Opportunity discovery
- Risk management
- AI-assisted research

## System Architecture

### 1. Portfolio Layer

Purpose:

Track positions and cash.

Features:

- Holdings
- Cash
- Allocation
- Performance
- Position history

### 2. Journal Layer

Purpose:

Capture decision quality.

Required fields:

- Thesis
- Risk
- Review date
- Outcome
- Lessons learned

### 3. Intelligence Layer

Purpose:

Gather evidence.

Sources:

Market Data:

- Prices
- Volume
- Relative volume
- Volatility
- Market cap
- Insider activity

Company Intelligence:

- SEC filings
- RNS announcements
- Earnings reports
- Trading updates
- Investor presentations

Sector Intelligence:

- Commodity prices
- Defence spending
- Airline activity
- Economic indicators

Alternative Intelligence:

- Analyst reports
- ETF flows
- Reddit
- X
- StockTwits

### 4. Verification Layer

Purpose:

Measure confidence.

Source Confidence:

- Company Filing = 100
- Government Data = 95
- Reuters = 90
- Financial Times = 90
- Major Financial News = 80
- Yahoo Finance = 70
- Social Media = 40
- Unverified Source = 10

Information must be verified before materially affecting scores.

### 5. Risk Layer

Purpose:

Protect capital.

Risk categories:

- Portfolio risk
- Position risk
- Liquidity risk
- Volatility risk
- Event risk

Position sizing should be risk-driven.

### 6. Opportunity Engine

Purpose:

Identify opportunities for review.

Outputs:

- Opportunity type
- Evidence
- Confidence score
- Suggested position range
- Suggested timeframe
- Suggested exit plan
- Suggested review date

The engine must never output:

- Buy now
- Guaranteed profit
- Sure thing

Instead:

- Review opportunity

Scanners:

Scanner 1:
Long-Term Investments

- ETFs
- Blue chips
- Dividend stocks

Scanner 2:
Swing Trades

- Breakouts
- Earnings momentum
- Sector rotation

Scanner 3:
Penny Shares

- AIM
- Small caps
- Mining explorers
- Resource companies

Scanner 4:
Special Situations

- Takeovers
- Regulatory approvals
- Rights issues
- Spin-offs

## Daily Workflow

### Morning Scan

- Market health
- New opportunities
- Earnings calendar
- Major filings
- High-priority reviews

### Evening Scan

- Market summary
- New intelligence
- Portfolio review
- Opportunities for tomorrow

## Future AI Responsibilities

- Summarise news
- Summarise filings
- Explain opportunities
- Explain risks
- Generate daily briefings

## Future AI Restrictions

- No autonomous trading
- No broker execution
- No guaranteed outcomes

## Success Metric

The goal is not to maximise trades.

The goal is to improve decision quality over time.

## Final Principle

Cash is a position.

Doing nothing is sometimes the correct decision.
