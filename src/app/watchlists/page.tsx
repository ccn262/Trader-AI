import Link from "next/link";

import {
  AttentionPanel,
  PriorityBadge,
  RiskBadge,
  ScoreBadge,
  getAttentionToneFromStatus,
  getToneFromRiskLevel,
} from "@/components/attention";
import { AppShell } from "@/components/app-shell";
import {
  archiveAssetAction,
  saveAssetAction,
} from "@/lib/supabase/actions";
import { getAssets, getWatchlists } from "@/lib/data";
import { hasSupabaseConfig } from "@/lib/supabase/server";

function getWatchlistTone(riskProfile: string) {
  return getToneFromRiskLevel(riskProfile);
}

function getAssetTone(symbol: string, status: string) {
  if (symbol === "VWRP") return "core";
  if (symbol === "CASH") return "healthy";
  if (symbol === "PLTR") return "speculative";
  if (symbol === "NVDA") return "watch";
  return getAttentionToneFromStatus(status, "core");
}

export default async function WatchlistsPage() {
  const watchlists = await getWatchlists();
  const assets = await getAssets();
  const writable = hasSupabaseConfig();

  return (
    <AppShell
      title="Watchlists"
      subtitle="Organise ideas by intent and risk profile. Decision support only. Trades are placed manually outside this app."
    >
      <div className="space-y-6">
        <AttentionPanel
          tone="watch"
          eyebrow="Decision support only"
          title="Watchlists"
          subtitle="Keep core ETFs calm, make watch items obvious, and let speculative ideas look and feel risky."
        >
          <p className="text-sm leading-6 text-slate-200/90">
            Trades are placed manually outside this app.
          </p>
        </AttentionPanel>

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Add item</p>
              <h2 className="text-xl font-semibold text-white">
                Add asset to watchlist
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
              action={saveAssetAction}
              className="mt-5 grid gap-4 md:grid-cols-2"
            >
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">Watchlist</span>
                <select
                  name="watchlist_id"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                >
                  <option value="">Unassigned</option>
                  {watchlists.map((watchlist) => (
                    <option key={watchlist.id} value={watchlist.id}>
                      {watchlist.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">Symbol</span>
                <input
                  name="symbol"
                  placeholder="VWRP"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">Name</span>
                <input
                  name="name"
                  placeholder="Vanguard FTSE All-World UCITS ETF"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">
                  Asset type
                </span>
                <select
                  name="asset_type"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                >
                  <option value="etf">ETF</option>
                  <option value="stock">Stock</option>
                  <option value="fund">Fund</option>
                  <option value="cash">Cash</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">Risk level</span>
                <select
                  name="risk_level"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="speculative">Speculative</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">Status</span>
                <select
                  name="status"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                >
                  <option value="research">Research</option>
                  <option value="watch">Watch</option>
                  <option value="buy_zone">Buy zone</option>
                  <option value="hold">Hold</option>
                  <option value="wait">Wait</option>
                  <option value="avoid">Avoid</option>
                </select>
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-200">Notes</span>
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="Add context for the watchlist item."
                  className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                />
              </label>
              <div className="md:col-span-2">
                <button className="rounded-2xl bg-teal-300 px-5 py-3 text-sm font-semibold text-slate-950">
                  Save watchlist item
                </button>
              </div>
            </form>
          ) : (
            <AttentionPanel
              tone="watch"
              title="Supabase fallback"
              subtitle="Connect Supabase to add or update watchlist items. The current screen continues to work in mock mode."
              className="mt-4"
            />
          )}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {watchlists.map((watchlist) => {
            const tone = getWatchlistTone(watchlist.riskProfile);

            return (
              <article
                key={watchlist.id}
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
                    <p className="text-lg font-semibold text-white">
                      {watchlist.name}
                    </p>
                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-100/85">
                      {watchlist.description}
                    </p>
                  </div>
                  <RiskBadge risk={watchlist.riskProfile} />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      Assets
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      {watchlist.assetCount}
                    </p>
                  </div>
                  <ScoreBadge score={watchlist.averageScore} tone={tone} />
                  <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      Last review
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-100">
                      {watchlist.lastReviewed}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-medium text-slate-100/90">Highlights</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {watchlist.highlights.length ? (
                      watchlist.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="rounded-full border border-white/10 bg-slate-950/55 px-3 py-1 text-sm text-slate-100"
                        >
                          {highlight}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-full border border-dashed border-white/10 bg-slate-950/55 px-3 py-1 text-sm text-slate-300">
                        No assets linked
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="space-y-4 rounded-[32px] border border-white/10 bg-white/5 p-5">
          <div>
            <p className="text-sm text-slate-400">Watchlist items</p>
            <h2 className="text-xl font-semibold text-white">
              Edit notes or archive an item
            </h2>
          </div>

          {assets.length ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {assets.map((asset) => {
                const tone = getAssetTone(asset.symbol, asset.status);

                return (
                  <article
                    key={asset.id}
                    className={[
                      "rounded-[28px] border p-4",
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
                            {asset.symbol}
                          </p>
                          <PriorityBadge tone={tone} label={asset.status} />
                        </div>
                        <p className="mt-1 text-sm text-slate-100/80">{asset.name}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-200/70">
                          {asset.watchlistName} · {asset.assetType}
                        </p>
                      </div>
                      <Link
                        href={`/assets/${asset.symbol}`}
                        className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200"
                      >
                        View
                      </Link>
                    </div>

                    {writable ? (
                      <div className="mt-4 space-y-3">
                        <form action={saveAssetAction} className="space-y-3">
                          <input type="hidden" name="id" value={asset.id} />
                          <input type="hidden" name="symbol" value={asset.symbol} />
                          <input type="hidden" name="name" value={asset.name} />
                          <input
                            type="hidden"
                            name="asset_type"
                            value={asset.assetType}
                          />
                          <input type="hidden" name="status" value={asset.status} />
                          <input type="hidden" name="risk_level" value="medium" />
                          <input type="hidden" name="currency" value="GBP" />
                          <input
                            type="hidden"
                            name="watchlist_id"
                            value={asset.watchlistId ?? ""}
                          />
                          <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-200">
                              Notes
                            </span>
                            <textarea
                              name="notes"
                              defaultValue={asset.notes}
                              rows={3}
                              className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                            />
                          </label>
                          <button className="rounded-2xl bg-teal-300 px-4 py-2 text-sm font-semibold text-slate-950">
                            Save notes
                          </button>
                        </form>
                        <form action={archiveAssetAction}>
                          <input type="hidden" name="id" value={asset.id} />
                          <input type="hidden" name="symbol" value={asset.symbol} />
                          <button className="rounded-2xl border border-rose-300/30 bg-rose-300/10 px-4 py-2 text-sm font-semibold text-rose-100">
                            Archive item
                          </button>
                        </form>
                      </div>
                    ) : (
                      <AttentionPanel
                        tone="watch"
                        title="Supabase required"
                        subtitle="Edit and archive actions become available once Supabase is configured."
                        className="mt-4"
                      />
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <AttentionPanel
              tone="healthy"
              title="No watchlist items yet"
              subtitle="Add an asset above to start tracking."
            />
          )}
        </section>
      </div>
    </AppShell>
  );
}
