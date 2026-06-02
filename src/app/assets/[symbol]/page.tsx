import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { getAssetDetail } from "@/lib/data";

export default async function AssetDetailPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  const asset = await getAssetDetail(symbol);

  if (!asset) {
    return (
      <AppShell
        title="Asset not found"
        subtitle="Decision support only. Trades are placed manually outside this app."
      >
        <section className="rounded-[32px] border border-white/10 bg-white/5 p-5">
          <p className="text-lg font-semibold text-white">
            No asset record found for {symbol.toUpperCase()}.
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Add the symbol to a watchlist or create the asset record in
            Supabase.
          </p>
          <Link
            href="/watchlists"
            className="mt-5 inline-flex rounded-2xl bg-teal-300 px-5 py-3 text-sm font-semibold text-slate-950"
          >
            Back to watchlists
          </Link>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={asset.symbol}
      subtitle="Decision support only. Trades are placed manually outside this app."
    >
      <div className="space-y-6">
        <section className="rounded-[32px] border border-amber-300/20 bg-amber-300/10 p-4 text-amber-50">
          <p className="font-semibold">Decision support only</p>
          <p className="mt-2 text-sm leading-6 text-amber-50/90">
            Trades are placed manually outside this app.
          </p>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">Asset detail</p>
              <h2 className="text-2xl font-semibold text-white">{asset.name}</h2>
              <p className="mt-2 text-sm uppercase tracking-[0.3em] text-slate-500">
                {asset.assetType} · {asset.market} · {asset.currency}
              </p>
            </div>
            <div className="grid gap-3 sm:text-right">
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  AI score
                </p>
                <p className="mt-2 text-3xl font-semibold text-white">
                  {asset.aiScore ?? "N/A"}
                </p>
                <p className="text-sm text-slate-400">{asset.aiLabel ?? "No score"}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Watchlist
              </p>
              <p className="mt-2 text-base font-semibold text-white">
                {asset.watchlistName}
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Watchlist status
              </p>
              <p className="mt-2 text-base font-semibold text-white">
                {asset.watchlistStatus}
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Position status
              </p>
              <p className="mt-2 text-base font-semibold text-white">
                {asset.positionStatus}
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Risk level
              </p>
              <p className="mt-2 text-base font-semibold text-white">
                {asset.riskLevel}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-3xl border border-white/10 bg-slate-950/60 p-4">
            <p className="text-sm font-semibold text-white">Notes</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {asset.notes || "No notes yet."}
            </p>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <div className="space-y-4 rounded-[32px] border border-white/10 bg-white/5 p-5">
            <div>
              <p className="text-sm text-slate-400">Journal entries</p>
              <h3 className="text-xl font-semibold text-white">
                Related notes
              </h3>
            </div>
            {asset.journalEntries.length ? (
              <div className="space-y-3">
                {asset.journalEntries.map((entry) => (
                  <article
                    key={entry.id}
                    className="rounded-3xl border border-white/10 bg-slate-950/60 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-base font-semibold text-white">
                          {entry.action} · {entry.amount}
                        </p>
                        <p className="text-sm text-slate-400">
                          Review {entry.reviewDate}
                        </p>
                      </div>
                      <Link
                        href={`/journal/${entry.id}`}
                        className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200"
                      >
                        Open
                      </Link>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {entry.thesisReason}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="rounded-3xl border border-dashed border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
                No journal entries linked yet.
              </p>
            )}
          </div>

          <div className="space-y-4 rounded-[32px] border border-white/10 bg-white/5 p-5">
            <div>
              <p className="text-sm text-slate-400">Alerts</p>
              <h3 className="text-xl font-semibold text-white">Review triggers</h3>
            </div>
            {asset.alerts.length ? (
              <div className="space-y-3">
                {asset.alerts.map((alert) => (
                  <article
                    key={alert.id}
                    className="rounded-3xl border border-white/10 bg-slate-950/60 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      {alert.type}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {alert.action}
                    </p>
                    <p className="mt-3 text-sm text-slate-400">{alert.due}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="rounded-3xl border border-dashed border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
                No alerts linked yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
