import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import {
  AttentionPanel,
  PriorityBadge,
  ScoreBadge,
  getAttentionToneFromStatus,
  getToneFromScore,
} from "@/components/attention";
import { getDashboardData } from "@/lib/data";

const attentionActionTone = {
  Review: "watch",
  Watch: "watch",
  Monitor: "core",
  Reassess: "speculative",
  Avoid: "urgent",
} as const;

function getDashboardCardTone(ticker: string, status: string, score: number) {
  if (ticker === "VWRP") return "core";
  if (ticker === "PLTR") return "urgent";
  if (ticker === "MSFT") return "watch";
  if (ticker === "NVDA") return getToneFromScore(score);
  return getAttentionToneFromStatus(status, "core");
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  const scoreMap = new Map(data.scores.map((item) => [item.ticker, item]));
  const attentionItems = [
    {
      ticker: "PLTR",
      tone: "urgent" as const,
      priority: "Avoid",
      action: "Avoid",
      reason:
        scoreMap.get("PLTR")?.score && scoreMap.get("PLTR")!.score < 45
          ? "Speculative risk remains high and the setup is still below review threshold."
          : "Speculative risk remains elevated and the setup is not clean enough for action.",
      review: scoreMap.get("PLTR")?.review ?? "Next week",
      name: scoreMap.get("PLTR")?.name ?? "Palantir Technologies",
    },
    {
      ticker: "MSFT",
      tone: "watch" as const,
      priority: "Watch today",
      action: "Watch",
      reason:
        "Earnings momentum is still active, so this one deserves a quick read before you do anything else.",
      review: scoreMap.get("MSFT")?.review ?? "Tomorrow",
      name: scoreMap.get("MSFT")?.name ?? "Microsoft Corporation",
    },
    {
      ticker: "VWRP",
      tone: "core" as const,
      priority: "Monitor only",
      action: "Monitor",
      reason:
        "Core allocation remains calm. Keep it on the radar and avoid overreacting to noise.",
      review: scoreMap.get("VWRP")?.review ?? "Today",
      name: scoreMap.get("VWRP")?.name ?? "Vanguard FTSE All-World UCITS ETF",
    },
  ];

  return (
    <AppShell
      title="Dashboard"
      subtitle="A mobile-first snapshot of portfolio health, watchlist quality, and review tasks. Decision support only."
    >
      <div className="space-y-6">
        <AttentionPanel
          tone="watch"
          eyebrow="Needs Attention Today"
          title="Top 3 items that deserve a look"
          subtitle="Start here. Review, watch, monitor, reassess, or avoid based on what the evidence is actually saying."
        >
          <div className="grid gap-4 xl:grid-cols-3">
            {attentionItems.map((item) => (
              <article
                key={item.ticker}
                className="rounded-[28px] border border-white/10 bg-slate-950/55 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <PriorityBadge tone={item.tone} label={item.priority} />
                    <h3 className="mt-3 text-lg font-semibold text-white">
                      {item.ticker}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">{item.name}</p>
                  </div>
                  <Link
                    href={`/assets/${item.ticker}`}
                    className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/10"
                  >
                    Open
                  </Link>
                </div>

                <p className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-200">
                  {item.reason}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <PriorityBadge tone={item.tone} label={`Action: ${item.action}`} />
                  <PriorityBadge
                    tone={attentionActionTone[item.action as keyof typeof attentionActionTone]}
                    label={`Review: ${item.review}`}
                  />
                </div>
              </article>
            ))}
          </div>
        </AttentionPanel>

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {data.summaryCards.map((card, index) => {
              const tone =
                index === 0
                  ? "core"
                  : index === 1
                    ? "healthy"
                    : index === 2
                      ? "watch"
                      : "urgent";

              return (
                <article
                  key={card.label}
                  className="rounded-[28px] border border-white/10 bg-slate-950/55 p-4"
                >
                  <PriorityBadge tone={tone} label={card.label} />
                  <p className="mt-4 text-3xl font-semibold tracking-tight text-white">
                    {card.value}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {card.detail}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {data.quickActions.map((action, index) => (
              <div
                key={action}
                className={[
                  "rounded-3xl border px-4 py-3 text-sm font-medium",
                  index === 0
                    ? "border-sky-300/20 bg-sky-300/10 text-sky-50"
                    : index === 1
                      ? "border-amber-300/20 bg-amber-300/10 text-amber-50"
                      : index === 2
                        ? "border-rose-300/20 bg-rose-300/10 text-rose-50"
                        : "border-emerald-300/20 bg-emerald-300/10 text-emerald-50",
                ].join(" ")}
              >
                {action}
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-4 rounded-[32px] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">AI watchlist scores</p>
                <h2 className="text-xl font-semibold text-white">
                  What deserves review
                </h2>
              </div>
              <p className="text-sm text-slate-500">{data.disclaimer}</p>
            </div>

            <div className="space-y-3">
              {data.scores.map((item) => {
                const tone = getDashboardCardTone(
                  item.ticker,
                  item.status,
                  item.score,
                );

                return (
                  <article
                    key={item.ticker}
                    className={[
                      "rounded-[28px] border p-4",
                      tone === "urgent"
                        ? "border-rose-300/30 bg-rose-300/10"
                        : tone === "watch"
                          ? "border-amber-300/30 bg-amber-300/10"
                          : tone === "healthy"
                            ? "border-emerald-300/30 bg-emerald-300/10"
                            : tone === "speculative"
                              ? "border-violet-300/30 bg-violet-300/10"
                              : "border-sky-300/30 bg-sky-300/10",
                    ].join(" ")}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-base font-semibold text-white">
                            {item.ticker}
                          </p>
                          <PriorityBadge tone={tone} label={item.status} />
                        </div>
                        <p className="max-w-xl text-sm leading-6 text-slate-200/90">
                          {item.name}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <PriorityBadge
                            tone={tone}
                            label={
                              item.status === "Avoid"
                                ? "Avoid"
                                : item.status === "Wait"
                                  ? "Watch"
                                  : "Monitor"
                            }
                          />
                          <PriorityBadge tone={tone} label={item.review} />
                        </div>
                      </div>
                      <ScoreBadge score={item.score} tone={tone} />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <AttentionPanel
            tone="healthy"
            eyebrow="Journal reminders"
            title="Recent review notes"
            subtitle="Keep the review loop calm: what was written, what was learned, and what still needs attention."
          >
            <div className="space-y-4">
              {data.journalHighlights.map((entry, index) => {
                const tone =
                  index === 0
                    ? "core"
                    : index === 1
                      ? "watch"
                      : "urgent";

                return (
                  <article
                    key={entry.title}
                    className="rounded-3xl border border-white/10 bg-slate-950/55 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <PriorityBadge tone={tone} label={entry.title} />
                        <p className="mt-3 text-sm leading-6 text-slate-300">
                          {entry.body}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}

              <div className="rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-4">
                <PriorityBadge tone="healthy" label="Healthy state" />
                <p className="mt-3 text-sm leading-6 text-emerald-50/90">
                  Review before action. No live broker connection, no auto-trading,
                  and no certainty language in the prototype.
                </p>
              </div>
            </div>
          </AttentionPanel>
        </section>
      </div>
    </AppShell>
  );
}
