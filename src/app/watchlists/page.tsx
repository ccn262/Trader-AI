import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import {
  archiveAssetAction,
  saveAssetAction,
} from "@/lib/supabase/actions";
import { getAssets, getWatchlists } from "@/lib/data";
import { hasSupabaseConfig } from "@/lib/supabase/server";

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
        <section className="rounded-[32px] border border-amber-300/20 bg-amber-300/10 p-4 text-amber-50">
          <p className="font-semibold">Decision support only</p>
          <p className="mt-2 text-sm leading-6 text-amber-50/90">
            Trades are placed manually outside this app.
          </p>
        </section>

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
            <form action={saveAssetAction} className="mt-5 grid gap-4 md:grid-cols-2">
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
            <p className="mt-4 rounded-3xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
              Connect Supabase to add or update watchlist items. The current
              screen continues to work in mock mode.
            </p>
          )}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {watchlists.map((watchlist) => (
            <article
              key={watchlist.id}
              className="rounded-[32px] border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-white">
                    {watchlist.name}
                  </p>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                    {watchlist.description}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
                  {watchlist.riskProfile}
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Assets
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {watchlist.assetCount}
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Avg score
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {watchlist.averageScore}
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Last review
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-100">
                    {watchlist.lastReviewed}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-sm font-medium text-slate-300">Highlights</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {watchlist.highlights.length ? (
                    watchlist.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200"
                      >
                        {highlight}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full border border-dashed border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-400">
                      No assets linked
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
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
              {assets.map((asset) => (
                <article
                  key={asset.id}
                  className="rounded-3xl border border-white/10 bg-slate-950/60 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold text-white">
                        {asset.symbol}
                      </p>
                      <p className="text-sm text-slate-400">{asset.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-500">
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
                    <p className="mt-4 rounded-3xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
                      Edit and archive actions become available once Supabase is
                      configured.
                    </p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-3xl border border-dashed border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
              No watchlist items yet. Add an asset above to start tracking.
            </p>
          )}
        </section>
      </div>
    </AppShell>
  );
}
