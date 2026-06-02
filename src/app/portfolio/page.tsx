import { AppShell } from "@/components/app-shell";
import { formatCurrency } from "@/lib/mock-data";
import { getPortfolioPositions } from "@/lib/data";

export default async function PortfolioPage() {
  const portfolioPositions = await getPortfolioPositions();
  const totalValue = portfolioPositions.reduce(
    (sum, position) => sum + position.quantity * position.currentPrice,
    0,
  );

  return (
    <AppShell
      title="Portfolio"
      subtitle="Manual holdings tracking for Trading 212. Built to show allocation, not to execute trades."
    >
      <div className="space-y-6">
        <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">Estimated portfolio value</p>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-white">
                {formatCurrency(totalValue)}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Core strategy
                </p>
                <p className="mt-2 text-lg font-semibold text-white">72%</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Manual price
                </p>
                <p className="mt-2 text-lg font-semibold text-white">Updated today</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Risk mode
                </p>
                <p className="mt-2 text-lg font-semibold text-white">Beginner</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          {portfolioPositions.map((position) => {
            const marketValue = position.quantity * position.currentPrice;
            const costBasis = position.quantity * position.averageBuyPrice;
            const gain = marketValue - costBasis;
            const allocation = position.targetAllocation;

            return (
              <article
                key={position.ticker}
                className="rounded-[32px] border border-white/10 bg-white/5 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {position.ticker}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">{position.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-white">
                      {formatCurrency(marketValue)}
                    </p>
                    <p className="text-sm text-emerald-300">
                      {gain >= 0 ? "+" : ""}
                      {formatCurrency(gain)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      Quantity
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {position.quantity}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      Avg buy
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {formatCurrency(position.averageBuyPrice)}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      Current
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {formatCurrency(position.currentPrice)}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
                    <span>{position.accountType} / {position.strategy}</span>
                    <span>{allocation}% target allocation</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-teal-300 to-cyan-500"
                      style={{ width: `${allocation}%` }}
                    />
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-400">
                  {position.notes}
                </p>
              </article>
            );
          })}
        </section>
      </div>
    </AppShell>
  );
}
