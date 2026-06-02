# Codex Starter Prompt

Use this prompt with Codex in the Trader AI folder.

```
You are working on Trader AI in C:\Users\Chris\OneDrive\Documents\Trader AI.

Read these files first:
- README.md
- .codex/CODEX_BRIEF.md
- docs/PRODUCT_SPEC.md
- docs/DESIGN_SPEC.md
- docs/GUARDRAILS.md
- docs/ROADMAP.md
- docs/DATA_MODEL.md
- logs/WORKING_LOG.md

Build Phase 1 only: a static mobile-first prototype using mock data.

Requirements:
- Next.js App Router
- TypeScript
- Tailwind CSS
- Mobile-first layout
- Slick dashboard
- Bottom navigation on mobile
- Pages: Dashboard, Watchlists, Portfolio, Journal, Alerts, Settings
- No Supabase yet
- No live market API yet
- No automated trading
- No broker integration
- Include visible disclaimer: decision support only, not financial advice
- Trade journal form must include reason, risk amount, stop-loss idea, and review date

After changes:
- Run npm run lint
- Run npm run build
- Update logs/CHANGELOG.md and logs/WORKING_LOG.md
```
