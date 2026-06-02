import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import {
  archiveAlertAction,
  markAlertReviewedAction,
  saveAlertAction,
} from "@/lib/supabase/actions";
import { getAssets, getAlerts } from "@/lib/data";
import { hasSupabaseConfig } from "@/lib/supabase/server";

export default async function AlertsPage() {
  const alerts = await getAlerts();
  const assets = await getAssets();
  const writable = hasSupabaseConfig();

  return (
    <AppShell
      title="Alerts"
      subtitle="Alerts prompt review, not action. Decision support only. Trades are placed manually outside this app."
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
              <p className="text-sm text-slate-400">Create alert</p>
              <h2 className="text-xl font-semibold text-white">
                Add a manual alert
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
              action={saveAlertAction}
              className="mt-5 grid gap-4 md:grid-cols-2"
            >
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-200">Asset</span>
                <select
                  name="asset_id"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                >
                  <option value="">Portfolio</option>
                  {assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.symbol} · {asset.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">Type</span>
                <select
                  name="alert_type"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                >
                  <option value="manual">Manual reminder</option>
                  <option value="review_due">Review due</option>
                  <option value="score_above">Score above threshold</option>
                  <option value="price_above">Price above</option>
                  <option value="price_below">Price below</option>
                  <option value="news">News catalyst</option>
                  <option value="earnings">Earnings date</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">
                  Threshold
                </span>
                <input
                  name="threshold_value"
                  type="number"
                  step="0.01"
                  placeholder="Optional"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">
                  Due date/time
                </span>
                <input
                  name="due_at"
                  type="datetime-local"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-200">
                  Message
                </span>
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Review the source before acting."
                  className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                />
              </label>
              <div className="md:col-span-2">
                <button className="rounded-2xl bg-teal-300 px-5 py-3 text-sm font-semibold text-slate-950">
                  Save alert
                </button>
              </div>
            </form>
          ) : (
            <p className="mt-4 rounded-3xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
              Connect Supabase to create and update alerts. Mock fallback
              remains available for reading.
            </p>
          )}
        </section>

        <section className="space-y-4 rounded-[32px] border border-white/10 bg-white/5 p-5">
          <div>
            <p className="text-sm text-slate-400">Alerts</p>
            <h2 className="text-xl font-semibold text-white">
              Review or archive
            </h2>
          </div>

          {alerts.length ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {alerts.map((alert) => (
                <article
                  key={alert.id}
                  className="rounded-3xl border border-white/10 bg-slate-950/60 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        {alert.type}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-white">
                        {alert.title}
                      </h3>
                      <p className="text-sm text-slate-400">{alert.asset}</p>
                    </div>
                    <Link
                      href={alert.asset !== "Portfolio" ? `/assets/${alert.asset}` : "/portfolio"}
                      className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200"
                    >
                      Open
                    </Link>
                  </div>
                  <p className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
                    {alert.action}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {writable ? (
                      <>
                        <form action={markAlertReviewedAction}>
                          <input type="hidden" name="id" value={alert.id} />
                          <button className="rounded-2xl bg-teal-300 px-4 py-2 text-sm font-semibold text-slate-950">
                            Mark reviewed
                          </button>
                        </form>
                        <form action={archiveAlertAction}>
                          <input type="hidden" name="id" value={alert.id} />
                          <button className="rounded-2xl border border-rose-300/30 bg-rose-300/10 px-4 py-2 text-sm font-semibold text-rose-100">
                            Archive alert
                          </button>
                        </form>
                      </>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-3xl border border-dashed border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
              No alerts yet. Create one above to track a review trigger.
            </p>
          )}
        </section>
      </div>
    </AppShell>
  );
}
