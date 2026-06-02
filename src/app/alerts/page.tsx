import Link from "next/link";

import {
  AlertPriorityCard,
  AttentionPanel,
  PriorityBadge,
  ScoreBadge,
} from "@/components/attention";
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

function getAlertTone(alert: OpportunityAlert) {
  if (alert.filterTags.includes("High-priority review")) return "urgent" as const;
  if (alert.filterTags.includes("Watch today")) return "watch" as const;
  if (alert.filterTags.includes("Monitor only")) return "core" as const;
  if (alert.filterTags.includes("Penny shares")) return "speculative" as const;
  return "watch" as const;
}

function getAlertPriorityLabel(alert: OpportunityAlert) {
  if (alert.filterTags.includes("High-priority review")) return "High-priority review";
  if (alert.filterTags.includes("Watch today")) return "Watch today";
  if (alert.filterTags.includes("Monitor only")) return "Monitor only";
  if (alert.filterTags.includes("Penny shares")) return "Speculative review";
  return "Watch today";
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
        <AttentionPanel
          tone="watch"
          eyebrow="Decision support only"
          title="Opportunity alerts"
          subtitle="Review opportunity. Do not blindly buy. Trades are placed manually outside this app."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            {opportunityScans.map((scan) => (
              <article
                key={scan.label}
                className="rounded-[28px] border border-white/10 bg-slate-950/55 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <PriorityBadge
                      tone="core"
                      label={scan.label}
                    />
                    <h2 className="mt-3 text-xl font-semibold text-white">
                      {scan.title}
                    </h2>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
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
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3"
                    >
                      <span className="mt-1 h-2 w-2 rounded-full bg-teal-300" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </AttentionPanel>

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
                    ? "border-sky-300/40 bg-sky-300 text-slate-950"
                    : "border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/10",
                ].join(" ")}
              >
                All
              </Link>
              {filterOptions.map((filter) => {
                const active = selectedFilter === filter.value;
                const count = formatFilterCount(filter.value);
                return (
                  <Link
                    key={filter.value}
                    href={`/alerts?filter=${encodeURIComponent(filter.value)}`}
                    className={[
                      "rounded-full border px-4 py-2 text-sm font-semibold transition",
                      active
                        ? "border-sky-300/40 bg-sky-300 text-slate-950"
                        : "border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/10",
                    ].join(" ")}
                  >
                    {filter.label}
                    <span className="ml-2 text-xs opacity-80">({count})</span>
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
                Review cards with scan context
              </h2>
            </div>
            <p className="text-sm text-slate-400">
              {visibleAlerts.length} item{visibleAlerts.length === 1 ? "" : "s"}
            </p>
          </div>

          {visibleAlerts.length ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {visibleAlerts.map((alert) => {
                const tone = getAlertTone(alert);
                const priorityLabel = getAlertPriorityLabel(alert);

                return (
                  <AlertPriorityCard
                    key={`${alert.symbol}-${alert.opportunityType}`}
                    tone={tone}
                    title={priorityLabel}
                    subtitle={`${alert.symbol} · ${alert.name}`}
                  >
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <PriorityBadge tone={tone} label={alert.market} />
                        <PriorityBadge tone={tone} label={alert.opportunityType} />
                        <PriorityBadge tone={tone} label={`${alert.scan} scan`} />
                      </div>

                      <p className="rounded-3xl border border-white/10 bg-slate-950/55 p-4 text-sm leading-6 text-slate-200">
                        {alert.catalystSummary}
                      </p>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <ScoreBadge score={alert.score} tone={tone} />
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                            Source confidence
                          </p>
                          <p className="mt-2 text-lg font-semibold text-white">
                            {alert.sourceConfidence}
                          </p>
                          <p className="mt-1 text-sm text-slate-400">
                            Evidence should stay verified before it changes the score.
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-3 text-sm sm:grid-cols-2">
                        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                            Position range
                          </p>
                          <p className="mt-2 text-lg font-semibold text-white">
                            {alert.suggestedPositionRange}
                          </p>
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                            Hold timeframe
                          </p>
                          <p className="mt-2 text-lg font-semibold text-white">
                            {alert.suggestedHoldTimeframe}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-3 text-sm sm:grid-cols-2">
                        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                            Exit plan
                          </p>
                          <p className="mt-2 leading-6 text-slate-300">
                            {alert.exitPlan}
                          </p>
                        </div>
                        <div
                          className={[
                            "rounded-3xl border p-4",
                            tone === "urgent"
                              ? "border-rose-300/30 bg-rose-300/10"
                              : tone === "speculative"
                                ? "border-violet-300/30 bg-violet-300/10"
                                : "border-amber-300/20 bg-amber-300/10",
                          ].join(" ")}
                        >
                          <p
                            className={[
                              "text-xs uppercase tracking-[0.3em]",
                              tone === "urgent"
                                ? "text-rose-100/80"
                                : tone === "speculative"
                                  ? "text-violet-100/80"
                                  : "text-amber-100/80",
                            ].join(" ")}
                          >
                            Risk warning
                          </p>
                          <p
                            className={[
                              "mt-2 leading-6",
                              tone === "urgent"
                                ? "text-rose-50"
                                : tone === "speculative"
                                  ? "text-violet-50"
                                  : "text-amber-50/90",
                            ].join(" ")}
                          >
                            {alert.riskWarning}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
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

                      <div
                        className={[
                          "rounded-3xl border p-4 text-sm leading-6",
                          tone === "urgent"
                            ? "border-rose-300/30 bg-rose-300/10 text-rose-50"
                            : tone === "speculative"
                              ? "border-violet-300/30 bg-violet-300/10 text-violet-50"
                              : tone === "watch"
                                ? "border-amber-300/30 bg-amber-300/10 text-amber-50"
                                : "border-sky-300/30 bg-sky-300/10 text-sky-50",
                        ].join(" ")}
                      >
                        Review opportunity. Do not blindly buy. Trades are placed
                        manually outside this app.
                      </div>
                    </div>
                  </AlertPriorityCard>
                );
              })}
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

        <AttentionPanel
          tone="healthy"
          eyebrow="Empty state"
          title="When nothing new is ready"
          subtitle="Keep the app calm when evidence is thin and the right answer is to wait."
        >
          <div className="rounded-[28px] border border-dashed border-white/15 bg-slate-950/60 p-5 text-sm leading-6 text-slate-300">
            If future scans return no strong opportunities, show a quiet state
            that reinforces patience, risk discipline, and the fact that doing
            nothing can be the correct decision.
          </div>
        </AttentionPanel>
      </div>
    </AppShell>
  );
}
