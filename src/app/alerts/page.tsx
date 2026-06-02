import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import {
  opportunityAlerts,
  opportunityScans,
  type OpportunityAlert,
} from "@/lib/mock-data";

const filterOptions = [
  { label: "High-priority review", value: "High-priority review" },
  { label: "Watch today", value: "Watch today" },
  { label: "Monitor only", value: "Monitor only" },
  { label: "Penny shares", value: "Penny shares" },
  { label: "Long-term", value: "Long-term" },
  { label: "Swing trades", value: "Swing trades" },
] as const;

function formatFilterCount(filterValue: string) {
  return opportunityAlerts.filter((alert) =>
    alert.filterTags.includes(filterValue as OpportunityAlert["filterTags"][number]),
  ).length;
}

function getVisibleAlerts(selectedFilter: string) {
  if (!selectedFilter) {
    return opportunityAlerts;
  }

  return opportunityAlerts.filter((alert) =>
    alert.filterTags.includes(selectedFilter as OpportunityAlert["filterTags"][number]),
  );
}

export default function AlertsPage({
  searchParams,
}: {
  searchParams?: { filter?: string };
}) {
  const selectedFilter = searchParams?.filter ?? "";
  const visibleAlerts = getVisibleAlerts(selectedFilter);

  return (
    <AppShell
      title="Opportunity Alerts"
      subtitle="Review opportunity. Do not blindly buy. Trades are placed manually outside this app."
    >
      <div className="space-y-6">
        <section className="rounded-[32px] border border-amber-300/20 bg-amber-300/10 p-4 text-amber-50">
          <p className="font-semibold">Decision support only</p>
          <p className="mt-2 text-sm leading-6 text-amber-50/90">
            Review opportunity. Do not blindly buy. Trades are placed manually
            outside this app.
          </p>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {opportunityScans.map((scan) => (
            <article
              key={scan.label}
              className="rounded-[32px] border border-white/10 bg-white/5 p-5 shadow-glow"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">{scan.label}</p>
                  <h2 className="mt-1 text-xl font-semibold text-white">
                    {scan.title}
                  </h2>
                </div>
                <span className="rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-xs font-semibold text-teal-100">
                  Scan
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {scan.summary}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {scan.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-3"
                  >
                    <span className="mt-1 h-2 w-2 rounded-full bg-teal-300" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-5">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-slate-400">Filters</p>
              <h2 className="text-xl font-semibold text-white">
                Narrow what needs attention
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/alerts"
                className={[
                  "rounded-full border px-4 py-2 text-sm font-semibold transition",
                  selectedFilter === ""
                    ? "border-teal-300/40 bg-teal-300 text-slate-950"
                    : "border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/10",
                ].join(" ")}
              >
                All
              </Link>
              {filterOptions.map((filter) => {
                const active = selectedFilter === filter.value;
                return (
                  <Link
                    key={filter.value}
                    href={`/alerts?filter=${encodeURIComponent(filter.value)}`}
                    className={[
                      "rounded-full border px-4 py-2 text-sm font-semibold transition",
                      active
                        ? "border-teal-300/40 bg-teal-300 text-slate-950"
                        : "border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/10",
                    ].join(" ")}
                  >
                    {filter.label}
                    <span className="ml-2 text-xs opacity-80">
                      ({formatFilterCount(filter.value)})
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-[32px] border border-white/10 bg-white/5 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">Opportunity alerts</p>
              <h2 className="text-xl font-semibold text-white">
                Review cards with evidence placeholders
              </h2>
            </div>
            <p className="text-sm text-slate-400">
              {visibleAlerts.length} item{visibleAlerts.length === 1 ? "" : "s"}
            </p>
          </div>

          {visibleAlerts.length ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {visibleAlerts.map((alert) => (
                <article
                  key={`${alert.symbol}-${alert.opportunityType}`}
                  className="rounded-[28px] border border-white/10 bg-slate-950/70 p-4 shadow-glow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-lg font-semibold text-white">
                          {alert.symbol}
                        </p>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">
                          {alert.market}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-400">{alert.name}</p>
                    </div>
                    <Link
                      href={`/assets/${alert.symbol}`}
                      className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/10"
                    >
                      Open asset
                    </Link>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-cyan-300/15 px-3 py-1 text-xs font-semibold text-cyan-100">
                      {alert.opportunityType}
                    </span>
                    <span className="rounded-full bg-teal-300/15 px-3 py-1 text-xs font-semibold text-teal-100">
                      {alert.sourceConfidence} confidence
                    </span>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
                      {alert.scan} scan
                    </span>
                  </div>

                  <p className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
                    {alert.catalystSummary}
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        Score
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-white">
                        {alert.score}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        Review opportunity
                      </p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        Position range
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        {alert.suggestedPositionRange}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        Suggested hold: {alert.suggestedHoldTimeframe}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        Exit plan
                      </p>
                      <p className="mt-2 leading-6 text-slate-300">
                        {alert.exitPlan}
                      </p>
                    </div>
                    <div className="rounded-3xl border border-amber-300/15 bg-amber-300/10 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-amber-100/70">
                        Risk warning
                      </p>
                      <p className="mt-2 leading-6 text-amber-50/90">
                        {alert.riskWarning}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      Evidence placeholders
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {alert.evidencePlaceholders.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-2 text-xs text-slate-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 rounded-3xl border border-teal-300/20 bg-teal-300/10 p-4 text-sm leading-6 text-teal-50">
                    Review opportunity. Do not blindly buy. Trades are placed
                    manually outside this app.
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-white/15 bg-slate-950/60 p-5 text-sm leading-6 text-slate-300">
              <p className="font-semibold text-white">No matching alerts</p>
              <p className="mt-2 text-slate-400">
                This filter has no current mock opportunities. Switch back to
                All or pick a different filter to review today’s cards.
              </p>
            </div>
          )}
        </section>

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">Empty state</p>
              <h2 className="text-xl font-semibold text-white">
                When nothing new is ready
              </h2>
            </div>
            <p className="text-sm text-slate-400">
              Keep the app calm when evidence is thin.
            </p>
          </div>
          <div className="mt-4 rounded-[28px] border border-dashed border-white/15 bg-slate-950/60 p-5 text-sm leading-6 text-slate-300">
            If future scans return no strong opportunities, show a quiet state
            that reinforces patience, risk discipline, and the fact that doing
            nothing can be the correct decision.
          </div>
        </section>
      </div>
    </AppShell>
  );
}
