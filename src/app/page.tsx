import { AppShell } from "@/components/app-shell";
import { getDashboardData } from "@/lib/data";

function StatusPill({ label }: { label: string }) {
  const tone =
    label === "Watch"
      ? "bg-cyan-300/15 text-cyan-100 ring-cyan-300/25"
      : label === "Wait"
        ? "bg-amber-300/15 text-amber-100 ring-amber-300/25"
        : "bg-rose-300/15 text-rose-100 ring-rose-300/25";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${tone}`}>
      {label}
    </span>
  );
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <AppShell
      title="Dashboard"
      subtitle="A mobile-first snapshot of portfolio health, watchlist quality, and review tasks. Decision support only."
    >
      <div className="space-y-6">
        <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-5 shadow-glow">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {data.summaryCards.map((card) => (
              <div
                key={card.label}
                className="rounded-3xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-sm text-slate-400">{card.label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
                  {card.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {card.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {data.quickActions.map((action) => (
              <div
                key={action}
                className="rounded-3xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm font-medium text-slate-200"
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
                <h2 className="text-xl font-semibold">What deserves review</h2>
              </div>
              <p className="text-sm text-slate-500">
                {data.disclaimer}
              </p>
            </div>

            <div className="space-y-3">
              {data.scores.map((item) => (
                <div
                  key={item.ticker}
                  className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-950/60 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="text-base font-semibold text-white">
                        {item.ticker}
                      </p>
                      <StatusPill label={item.status} />
                    </div>
                    <p className="mt-1 text-sm text-slate-400">{item.name}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-semibold text-white">
                        {item.score}
                      </p>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        /100
                      </p>
                    </div>
                    <div className="text-right text-sm text-slate-400">
                      <p>Review</p>
                      <p className="font-medium text-slate-200">{item.review}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-[32px] border border-white/10 bg-white/5 p-5">
            <div>
              <p className="text-sm text-slate-400">Journal reminders</p>
              <h2 className="text-xl font-semibold">Recent review notes</h2>
            </div>

            <div className="space-y-4">
              {data.journalHighlights.map((entry) => (
                <div
                  key={entry.title}
                  className="rounded-3xl border border-white/10 bg-slate-950/60 p-4"
                >
                  <p className="text-sm font-medium text-white">{entry.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {entry.body}
                  </p>
                </div>
              ))}
              <div className="rounded-3xl border border-amber-300/15 bg-amber-300/10 p-4">
                <p className="text-sm font-medium text-amber-50">
                  Review before action
                </p>
                <p className="mt-2 text-sm leading-6 text-amber-50/80">
                  No live broker connection, no auto-trading, and no certainty
                  language in the prototype.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
