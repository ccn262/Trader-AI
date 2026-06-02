import { AppShell } from "@/components/app-shell";
import { getWatchlists } from "@/lib/data";

const riskTone: Record<string, string> = {
  low: "border-emerald-300/20 bg-emerald-300/10 text-emerald-50",
  medium: "border-cyan-300/20 bg-cyan-300/10 text-cyan-50",
  high: "border-amber-300/20 bg-amber-300/10 text-amber-50",
  speculative: "border-rose-300/20 bg-rose-300/10 text-rose-50",
};

export default async function WatchlistsPage() {
  const watchlists = await getWatchlists();

  return (
    <AppShell
      title="Watchlists"
      subtitle="Organise ideas by intent and risk profile. The aim is to review, not rush."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {watchlists.map((watchlist) => (
          <article
            key={watchlist.name}
            className="rounded-[32px] border border-white/10 bg-white/5 p-5 shadow-glow"
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
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${riskTone[watchlist.riskProfile]}`}
              >
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
                {watchlist.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
