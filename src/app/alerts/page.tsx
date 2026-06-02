import Link from "next/link";

import {
  AlertPriorityCard,
  AttentionPanel,
  PriorityBadge,
  RiskBadge,
  ScoreBadge,
} from "@/components/attention";
import { AppShell } from "@/components/app-shell";
import {
  getOpportunityAlertFeed,
  type OpportunityAlertFilterTag,
  type OpportunityAlertViewModel,
  type RecentIntelligenceViewModel,
} from "@/lib/data";
import {
  getEvidenceLinkMode,
  isMockEvidenceUrl,
  isValidExternalEvidenceUrl,
} from "@/lib/evidence-links";

const filterOptions: Array<{
  label: OpportunityAlertFilterTag;
  value: OpportunityAlertFilterTag;
}> = [
  { label: "High-priority review", value: "High-priority review" },
  { label: "Watch today", value: "Watch today" },
  { label: "Monitor only", value: "Monitor only" },
  { label: "Penny shares", value: "Penny shares" },
  { label: "Long-term", value: "Long-term" },
  { label: "Swing trades", value: "Swing trades" },
];

function formatFilterCount(
  alerts: OpportunityAlertViewModel[],
  filterValue: OpportunityAlertFilterTag,
) {
  return alerts.filter((alert) => alert.filterTags.includes(filterValue)).length;
}

function getVisibleAlerts(
  alerts: OpportunityAlertViewModel[],
  selectedFilter: string,
) {
  if (!selectedFilter) {
    return alerts;
  }

  return alerts.filter((alert) =>
    alert.filterTags.includes(selectedFilter as OpportunityAlertFilterTag),
  );
}

function getAlertTone(alert: OpportunityAlertViewModel) {
  if (alert.priority === "High-priority review") return "urgent" as const;
  if (alert.priority === "Avoid or reassess") return "urgent" as const;
  if (alert.priority === "Watch today") return "watch" as const;
  if (alert.priority === "Monitor only") return "core" as const;
  if (alert.priority === "Speculative review") return "speculative" as const;
  return "watch" as const;
}

function getIntelligenceTone(item: RecentIntelligenceViewModel) {
  if (item.riskLabel === "Urgent") return "urgent" as const;
  if (item.riskLabel === "Speculative") return "speculative" as const;
  if (item.riskLabel === "Watch") return "watch" as const;
  return "core" as const;
}

export default async function AlertsPage({
  searchParams,
}: {
  searchParams?: Promise<{ filter?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const selectedFilter = params.filter ?? "";
  const feed = await getOpportunityAlertFeed();
  const visibleAlerts = getVisibleAlerts(feed.alerts, selectedFilter);

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
          {feed.scans.length ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {feed.scans.map((scan) => (
                <article
                  key={scan.id}
                  className="rounded-[28px] border border-white/10 bg-slate-950/55 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <PriorityBadge tone="core" label={scan.label} />
                      <h2 className="mt-3 text-xl font-semibold text-white">
                        {scan.title}
                      </h2>
                    </div>
                    <div className="text-right">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
                        {scan.status}
                      </span>
                      <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-500">
                        Market health {scan.marketHealthScore}
                      </p>
                    </div>
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

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                        Alerts
                      </p>
                      <p className="mt-2 text-xl font-semibold text-white">
                        {scan.totalAlertsGenerated}
                      </p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                        High priority
                      </p>
                      <p className="mt-2 text-xl font-semibold text-white">
                        {scan.highPriorityCount}
                      </p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                        Speculative
                      </p>
                      <p className="mt-2 text-xl font-semibold text-white">
                        {scan.speculativeCount}
                      </p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                        Avoid/reassess
                      </p>
                      <p className="mt-2 text-xl font-semibold text-white">
                        {scan.avoidOrReassessCount}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <PriorityBadge
                      tone="core"
                      label={`Trigger: ${scan.triggerSource.replaceAll("_", " ")}`}
                    />
                    <PriorityBadge tone="core" label={`Completed: ${scan.completedAt}`} />
                    <PriorityBadge tone="core" label={`Items: ${scan.totalIntelligenceItems}`} />
                    <PriorityBadge
                      tone={scan.completedSuccessfully ? "healthy" : "urgent"}
                      label={scan.completedSuccessfully ? "Completed successfully" : "Needs review"}
                    />
                  </div>

                  {scan.errorMessage ? (
                    <p className="mt-4 rounded-3xl border border-rose-300/20 bg-rose-300/10 p-4 text-sm leading-6 text-rose-50">
                      {scan.errorMessage}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-white/15 bg-slate-950/60 p-5 text-sm leading-6 text-slate-300">
              <p className="font-semibold text-white">No scan runs yet</p>
              <p className="mt-2 text-slate-400">
                Morning and evening scan cards will appear here once scan runs are
                stored. Until then, the app stays calm and avoids inventing urgency.
              </p>
            </div>
          )}
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
                const count = formatFilterCount(feed.alerts, filter.value);
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

                return (
                  <AlertPriorityCard
                    key={alert.id}
                    tone={tone}
                    title={alert.priority}
                    subtitle={`${alert.symbol} · ${alert.name}`}
                  >
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <PriorityBadge tone={tone} label={alert.market} />
                        <PriorityBadge tone={tone} label={alert.opportunityType} />
                        <PriorityBadge tone={tone} label={`${alert.scan} scan`} />
                        <RiskBadge risk={alert.riskLevel} />
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
                            Confidence score {alert.sourceConfidenceScore}. Evidence
                            should stay verified before it changes the score.
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-3 text-sm sm:grid-cols-2">
                        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                            Generated by
                          </p>
                          <p className="mt-2 text-lg font-semibold text-white">
                            {alert.generatedBy.replaceAll("_", " ")}
                          </p>
                          <p className="mt-2 leading-6 text-slate-300">
                            {alert.generationReason}
                          </p>
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                            Review by
                          </p>
                          <p className="mt-2 text-lg font-semibold text-white">
                            {alert.reviewBy}
                          </p>
                          <p className="mt-2 leading-6 text-slate-300">
                            Confidence label {alert.confidenceLabel}. Evidence is
                            review-only and should be checked before anything else.
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
                          Source / evidence
                        </p>
                        <div className="mt-3 space-y-3">
                          {alert.evidenceItems.length ? (
                            alert.evidenceItems.map((item) => {
                              const linkMode = getEvidenceLinkMode(item);
                              const isExternal =
                                linkMode === "external" &&
                                isValidExternalEvidenceUrl(item.sourceUrl);
                              const isDemo =
                                linkMode === "internal" &&
                                isMockEvidenceUrl(item.sourceUrl);
                              const href =
                                linkMode === "internal" && item.intelligenceItemId
                                  ? `/intelligence/${item.intelligenceItemId}`
                                  : item.sourceUrl ?? null;
                              const actionLabel =
                                linkMode === "external"
                                  ? "Open source"
                                  : linkMode === "internal"
                                    ? isDemo
                                      ? "View demo evidence"
                                      : "View evidence"
                                    : "Evidence unavailable";

                              return (
                                <div
                                  key={`${alert.id}-${item.label}`}
                                  className="rounded-3xl border border-white/10 bg-slate-950/60 p-4"
                                >
                                  <div className="flex flex-wrap items-center gap-2">
                                    <PriorityBadge
                                      tone={item.isPrimary ? "watch" : tone}
                                      label={
                                        item.isPrimary ? "Primary evidence" : "Evidence"
                                      }
                                    />
                                    <PriorityBadge
                                      tone="core"
                                      label={
                                        item.evidenceType
                                          ? item.evidenceType.replaceAll("_", " ")
                                          : "Evidence"
                                      }
                                    />
                                  </div>
                                  <p className="mt-3 text-sm font-semibold text-white">
                                    {item.label}
                                  </p>
                                  <p className="mt-2 text-sm leading-6 text-slate-300">
                                    {item.summary}
                                  </p>
                                  {linkMode === "external" && isExternal && href ? (
                                    <a
                                      href={href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="mt-3 inline-flex rounded-full border border-sky-300/30 bg-sky-300/10 px-3 py-2 text-xs font-semibold text-sky-100 transition hover:border-sky-300/50 hover:bg-sky-300/20"
                                    >
                                      {actionLabel}
                                    </a>
                                  ) : linkMode === "internal" && href ? (
                                    <Link
                                      href={href}
                                      className="mt-3 inline-flex rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-xs font-semibold text-amber-50 transition hover:border-amber-300/50 hover:bg-amber-300/20"
                                    >
                                      {actionLabel}
                                    </Link>
                                  ) : (
                                    <button
                                      type="button"
                                      disabled
                                      className="mt-3 inline-flex cursor-not-allowed rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-400"
                                    >
                                      {actionLabel}
                                    </button>
                                  )}
                                  {linkMode === "internal" ? (
                                    <p className="mt-3 text-xs uppercase tracking-[0.24em] text-amber-200/80">
                                      Demo/sample evidence - not a live market source
                                    </p>
                                  ) : linkMode === "unavailable" ? (
                                    <p className="mt-3 text-xs uppercase tracking-[0.24em] text-slate-500">
                                      Evidence unavailable
                                    </p>
                                  ) : null}
                                </div>
                              );
                            })
                          ) : (
                            <div className="rounded-3xl border border-dashed border-white/15 bg-slate-950/60 p-4 text-sm text-slate-300">
                              Evidence pending verification
                            </div>
                          )}
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
                This filter has no current review opportunities. Leave the app
                quiet rather than manufacturing urgency.
              </p>
            </div>
          )}
        </section>

        <section className="space-y-4 rounded-[32px] border border-white/10 bg-white/5 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">Recent intelligence</p>
              <h2 className="text-xl font-semibold text-white">
                Recent RNS-style evidence
              </h2>
            </div>
            <p className="text-sm text-slate-400">
              Evidence only, not trade instructions
            </p>
          </div>

          {feed.recentIntelligence.length ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {feed.recentIntelligence.map((item) => {
                const tone = getIntelligenceTone(item);

                return (
                  <article
                    key={item.id}
                    className="rounded-[28px] border border-white/10 bg-slate-950/55 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <PriorityBadge tone={tone} label={item.riskLabel} />
                        <h3 className="mt-3 text-lg font-semibold text-white">
                          {item.assetSymbol} · {item.companyName}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          {item.headline}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                          Impact
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-white">
                          {item.impactScore}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <PriorityBadge tone={tone} label={item.announcementType} />
                      <PriorityBadge tone={tone} label={item.classification} />
                      <PriorityBadge tone="core" label={item.source} />
                      <PriorityBadge
                        tone={tone}
                        label={item.verificationStatus}
                      />
                      <PriorityBadge tone={tone} label={item.priority} />
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                          Source confidence
                        </p>
                        <p className="mt-2 text-lg font-semibold text-white">
                          {item.sourceConfidence}
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          Confidence score {item.sourceConfidenceScore}
                        </p>
                      </div>
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                          Impact direction
                        </p>
                        <p className="mt-2 text-lg font-semibold text-white">
                          {item.impactDirection}
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          Risk level {item.riskLevel}
                        </p>
                      </div>
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                          Published
                        </p>
                        <p className="mt-2 text-lg font-semibold text-white">
                          {item.publishedAt}
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          Stored as review-only intelligence
                        </p>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        Scoring reason
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {item.scoringReason}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-white/15 bg-slate-950/60 p-5 text-sm leading-6 text-slate-300">
              <p className="font-semibold text-white">No recent intelligence</p>
              <p className="mt-2 text-slate-400">
                RNS-derived evidence will appear here once raw announcements are
                ingested and mapped into intelligence items.
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
