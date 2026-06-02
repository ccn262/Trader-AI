import Link from "next/link";

import {
  AttentionPanel,
  PriorityBadge,
} from "@/components/attention";
import { AppShell } from "@/components/app-shell";
import {
  archivePortfolioPositionAction,
  savePortfolioPositionAction,
} from "@/lib/supabase/actions";
import { formatCurrency } from "@/lib/mock-data";
import { getAssets, getPortfolioPositions } from "@/lib/data";
import { hasSupabaseConfig } from "@/lib/supabase/server";

function getPositionTone(ticker: string, strategy: string, pnl: number) {
  if (ticker === "VWRP") return "core" as const;
  if (ticker === "CASH") return "healthy" as const;
  if (ticker === "PLTR") return "speculative" as const;
  if (pnl < 0) return "urgent" as const;
  if (strategy === "swing") return "watch" as const;
  if (strategy === "learning") return "speculative" as const;
  return "healthy" as const;
}

export default async function PortfolioPage() {
  const portfolioPositions = await getPortfolioPositions();
  const assets = await getAssets();
  const writable = hasSupabaseConfig();
  const totalValue = portfolioPositions.reduce(
    (sum, position) => sum + position.quantity * position.currentPrice,
    0,
  );

  return (
    <AppShell
      title="Portfolio"
      subtitle="Manual positions only. Decision support only. Trades are placed manually outside this app."
    >
      <div className="space-y-6">
        <AttentionPanel
          tone="core"
          eyebrow="Decision support only"
          title="Portfolio overview"
          subtitle="Keep the core allocation calm, treat cash as a position, and make manual records easy to scan on mobile."
        >
          <p className="text-sm leading-6 text-slate-200/90">
            Trades are placed manually outside this app.
          </p>
        </AttentionPanel>

        <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">Estimated portfolio value</p>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-white">
                {formatCurrency(totalValue)}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-sky-300/20 bg-sky-300/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.3em] text-sky-100/70">
                  Core strategy
                </p>
                <p className="mt-2 text-lg font-semibold text-sky-50">Manual</p>
              </div>
              <div className="rounded-3xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">
                  Current mode
                </p>
                <p className="mt-2 text-lg font-semibold text-emerald-50">
                  Beginner
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Record status
                </p>
                <p className="mt-2 text-lg font-semibold text-white">Editable</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Record position</p>
              <h2 className="text-xl font-semibold text-white">
                Add a manual position
              </h2>
            </div>
            {!writable ? (
              <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs font-semibold text-slate-300">
                Supabase fallback
              </span>
            ) : null}
          </div>

          {writable ? (
            <form
              action={savePortfolioPositionAction}
              className="mt-5 grid gap-4 md:grid-cols-2"
            >
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-200">Asset</span>
                <select
                  name="asset_id"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                >
                  {assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.symbol} · {asset.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">Quantity</span>
                <input
                  name="quantity"
                  type="number"
                  step="0.01"
                  placeholder="1"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">
                  Average buy price
                </span>
                <input
                  name="average_buy_price"
                  type="number"
                  step="0.01"
                  placeholder="30"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">
                  Current price
                </span>
                <input
                  name="current_price"
                  type="number"
                  step="0.01"
                  placeholder="30"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">Currency</span>
                <input
                  name="currency"
                  defaultValue="GBP"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">
                  Account type
                </span>
                <select
                  name="account_type"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                >
                  <option value="isa">ISA</option>
                  <option value="invest">Invest</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">Strategy</span>
                <select
                  name="strategy"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                >
                  <option value="core">Core</option>
                  <option value="swing">Swing</option>
                  <option value="learning">Learning</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">
                  Target allocation
                </span>
                <input
                  name="target_allocation"
                  type="number"
                  step="0.1"
                  placeholder="20"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-200">Notes</span>
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="Add context for this manual position."
                  className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                />
              </label>
              <div className="md:col-span-2">
                <button className="rounded-2xl bg-teal-300 px-5 py-3 text-sm font-semibold text-slate-950">
                  Record position
                </button>
              </div>
            </form>
          ) : (
            <AttentionPanel
              tone="watch"
              title="Supabase fallback"
              subtitle="Connect Supabase to record or update positions. The current portfolio view still works in mock mode."
              className="mt-4"
            />
          )}
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          {portfolioPositions.length ? (
            portfolioPositions.map((position) => {
              const marketValue = position.quantity * position.currentPrice;
              const gain = marketValue - position.quantity * position.averageBuyPrice;
              const tone = getPositionTone(
                position.ticker,
                position.strategy,
                gain,
              );

              return (
                <article
                  key={position.id}
                  className={[
                    "rounded-[32px] border p-5",
                    tone === "urgent"
                      ? "border-rose-300/30 bg-rose-300/10"
                      : tone === "watch"
                        ? "border-amber-300/30 bg-amber-300/10"
                        : tone === "speculative"
                          ? "border-violet-300/30 bg-violet-300/10"
                          : tone === "healthy"
                            ? "border-emerald-300/30 bg-emerald-300/10"
                            : "border-sky-300/30 bg-sky-300/10",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-lg font-semibold text-white">
                          {position.ticker}
                        </p>
                        <PriorityBadge
                          tone={tone}
                          label={
                            position.ticker === "CASH"
                              ? "Healthy"
                              : position.strategy === "core"
                                ? "Core"
                                : position.strategy === "swing"
                                  ? "Watch"
                                  : "Speculative"
                          }
                        />
                      </div>
                      <p className="mt-1 text-sm text-slate-100/80">{position.name}</p>
                    </div>
                    <Link
                      href={`/assets/${position.ticker}`}
                      className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200"
                    >
                      View
                    </Link>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        Quantity
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        {position.quantity}
                      </p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        Market value
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        {formatCurrency(marketValue)}
                      </p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        P/L
                      </p>
                      <p
                        className={[
                          "mt-2 text-lg font-semibold",
                          gain >= 0 ? "text-emerald-50" : "text-rose-50",
                        ].join(" ")}
                      >
                        {gain >= 0 ? "+" : ""}
                        {formatCurrency(gain)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <PriorityBadge
                      tone={tone}
                      label={
                        position.ticker === "CASH"
                          ? "On track"
                          : gain >= 0
                            ? "Healthy"
                            : "Needs review"
                      }
                    />
                    <PriorityBadge
                      tone={tone}
                      label={`Target ${position.targetAllocation}%`}
                    />
                  </div>

                  {writable ? (
                    <div className="mt-4 space-y-3">
                      <form action={savePortfolioPositionAction} className="space-y-3">
                        <input type="hidden" name="id" value={position.id} />
                        <input type="hidden" name="asset_id" value={position.assetId} />
                        <input type="hidden" name="currency" value="GBP" />
                        <label className="space-y-2">
                          <span className="text-sm font-medium text-slate-200">
                            Notes
                          </span>
                          <textarea
                            name="notes"
                            defaultValue={position.notes}
                            rows={3}
                            className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                          />
                        </label>
                        <div className="grid gap-3 sm:grid-cols-3">
                          <input
                            type="number"
                            name="quantity"
                            step="0.01"
                            defaultValue={position.quantity}
                            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                          />
                          <input
                            type="number"
                            name="average_buy_price"
                            step="0.01"
                            defaultValue={position.averageBuyPrice}
                            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                          />
                          <input
                            type="number"
                            name="current_price"
                            step="0.01"
                            defaultValue={position.currentPrice}
                            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                          />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                          <select
                            name="account_type"
                            defaultValue={
                              position.accountType === "ISA"
                                ? "isa"
                                : position.accountType === "Invest"
                                  ? "invest"
                                  : "other"
                            }
                            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                          >
                            <option value="isa">ISA</option>
                            <option value="invest">Invest</option>
                            <option value="other">Other</option>
                          </select>
                          <select
                            name="strategy"
                            defaultValue={position.strategy}
                            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                          >
                            <option value="core">Core</option>
                            <option value="swing">Swing</option>
                            <option value="learning">Learning</option>
                          </select>
                          <input
                            type="number"
                            name="target_allocation"
                            step="0.1"
                            defaultValue={position.targetAllocation}
                            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                          />
                        </div>
                        <button className="rounded-2xl bg-teal-300 px-4 py-2 text-sm font-semibold text-slate-950">
                          Update record
                        </button>
                      </form>
                      <form action={archivePortfolioPositionAction}>
                        <input type="hidden" name="id" value={position.id} />
                        <button className="rounded-2xl border border-rose-300/30 bg-rose-300/10 px-4 py-2 text-sm font-semibold text-rose-100">
                          Close record
                        </button>
                      </form>
                    </div>
                  ) : (
                    <AttentionPanel
                      tone="watch"
                      title="Supabase required"
                      subtitle="Update or close records once Supabase is configured."
                      className="mt-4"
                    />
                  )}
                </article>
              );
            })
          ) : (
            <AttentionPanel
              tone="healthy"
              title="No manual positions recorded yet"
              subtitle="Add one above to track a record."
            />
          )}
        </section>
      </div>
    </AppShell>
  );
}
