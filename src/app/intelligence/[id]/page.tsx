import Link from "next/link";

import {
  AttentionPanel,
  PriorityBadge,
  RiskBadge,
  ScoreBadge,
} from "@/components/attention";
import { AppShell } from "@/components/app-shell";
import { getIntelligenceItemById } from "@/lib/data";
import {
  getEvidenceLinkMode,
  isMockEvidenceUrl,
  isValidExternalEvidenceUrl,
} from "@/lib/evidence-links";

function getIntelligenceTone(priority: string, riskLevel: string) {
  if (priority === "Avoid or reassess" || riskLevel === "Critical") {
    return "urgent" as const;
  }
  if (priority === "Speculative review" || riskLevel === "Speculative") {
    return "speculative" as const;
  }
  if (priority === "High-priority review" || priority === "Watch today") {
    return "watch" as const;
  }
  return "core" as const;
}

export default async function IntelligenceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getIntelligenceItemById(id);

  if (!item) {
    return (
      <AppShell
        title="Intelligence not found"
        subtitle="Decision support only. Trades are placed manually outside this app."
      >
        <section className="rounded-[32px] border border-white/10 bg-white/5 p-5">
          <p className="text-lg font-semibold text-white">
            No intelligence record found for {id}.
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            The link may point to a demo record that has not been seeded yet, or
            the item may have been archived.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/alerts"
              className="rounded-2xl bg-teal-300 px-5 py-3 text-sm font-semibold text-slate-950"
            >
              Back to alerts
            </Link>
            <Link
              href="/"
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100"
            >
              Back to dashboard
            </Link>
          </div>
        </section>
      </AppShell>
    );
  }

  const tone = getIntelligenceTone(item.priority, item.riskLevel);
  const sourceLinkMode = getEvidenceLinkMode({
    sourceUrl: item.sourceUrl,
    intelligenceItemId: item.id,
  });
  const hasExternalSource =
    sourceLinkMode === "external" && isValidExternalEvidenceUrl(item.sourceUrl);

  return (
    <AppShell
      title={`${item.assetSymbol} intelligence`}
      subtitle="Decision support only. Trades are placed manually outside this app."
    >
      <div className="space-y-6">
        <AttentionPanel
          tone={tone}
          eyebrow="Evidence review"
          title={item.headline}
          subtitle="Use this page to inspect the stored evidence, source trust, and deterministic scoring context before any manual decision."
        >
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-200/90">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 font-semibold text-white">
              {item.assetSymbol}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
              {item.companyName}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
              {item.sourceName}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <PriorityBadge tone={tone} label={item.signalType.replaceAll("_", " ")} />
            <PriorityBadge tone="core" label={item.sourceTierLabel} />
            <PriorityBadge tone="core" label={item.sourceLicenceStatus.replaceAll("_", " ")} />
            <PriorityBadge tone="core" label={`Weight ${item.weightingMultiplier.toFixed(2)}`} />
            <PriorityBadge
              tone={item.confirmedByPrimarySource ? "healthy" : tone}
              label={
                item.confirmedByPrimarySource
                  ? "Primary confirmation present"
                  : item.primaryConfirmationRequired
                    ? "Primary confirmation required"
                    : "Primary confirmation optional"
              }
            />
            {item.rumourFlag ? (
              <PriorityBadge tone="urgent" label="Rumour flag" />
            ) : null}
            {item.pumpRiskFlag ? (
              <PriorityBadge tone="urgent" label="Pump-risk flag" />
            ) : null}
          </div>
        </AttentionPanel>

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm text-slate-400">Headline</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                {item.headline}
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                {item.summary}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:w-[28rem]">
              <ScoreBadge score={item.impactScore} tone={tone} />
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
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
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <PriorityBadge tone={tone} label={item.classification} />
            <PriorityBadge tone={tone} label={item.priority} />
            <PriorityBadge tone="core" label={item.sourceName} />
            <RiskBadge risk={item.riskLevel} />
            <PriorityBadge tone={tone} label={item.verificationStatus} />
            {item.discoveryOnly ? (
              <PriorityBadge tone="speculative" label="Discovery only" />
            ) : null}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Impact direction
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {item.impactDirection}
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Risk level
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {item.riskLevel}
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Priority
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {item.priority}
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Published
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {item.publishedAt}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Signal type
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {item.signalType.replaceAll("_", " ")}
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Source tier / weighting
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {item.sourceTierLabel}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Weighting {item.weightingMultiplier.toFixed(2)}
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Primary confirmation
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {item.confirmedByPrimarySource ? "Confirmed" : "Not yet confirmed"}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {item.primaryConfirmationRequired
                  ? "Required for this source tier"
                  : "Not required for this source tier"}
              </p>
            </div>
          </div>

          {item.discoveryOnly ? (
            <div className="mt-5 rounded-3xl border border-violet-300/30 bg-violet-300/10 p-4 text-sm leading-6 text-violet-50">
              Discovery signal only — primary evidence required before acting.
            </div>
          ) : null}

          {item.rumourFlag || item.pumpRiskFlag ? (
            <div className="mt-5 rounded-3xl border border-rose-300/30 bg-rose-300/10 p-4 text-sm leading-6 text-rose-50">
              {item.pumpRiskFlag
                ? "Pump-risk language lowers confidence and should not increase conviction."
                : "Rumour language lowers confidence and should not override primary evidence."}
            </div>
          ) : null}

          <div className="mt-5 rounded-3xl border border-white/10 bg-slate-950/60 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Scoring reason
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {item.scoringReason}
            </p>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Source trust</p>
              <h3 className="text-xl font-semibold text-white">
                Source availability and confidence
              </h3>
            </div>
            <PriorityBadge tone={tone} label={item.sourceUrlLabel} />
          </div>

          <div className="mt-4 rounded-[28px] border border-white/10 bg-slate-950/60 p-4">
            {hasExternalSource && item.sourceUrl ? (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-white">Open source</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    This is a real external source URL and can be opened in a new
                    tab.
                  </p>
                </div>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-2xl border border-sky-300/30 bg-sky-300/10 px-4 py-3 text-sm font-semibold text-sky-100 transition hover:border-sky-300/50 hover:bg-sky-300/20"
                >
                  Open source
                </a>
              </div>
            ) : item.sourceUrl ? (
              <div>
                <p className="font-semibold text-amber-50">
                  Demo/sample evidence - not a live market source
                </p>
                <p className="mt-2 text-sm leading-6 text-amber-50/90">
                  The stored URL is a mock or placeholder record and should not
                  be treated as verified external evidence.
                </p>
                <div className="mt-4">
                  <Link
                    href="#raw-announcement"
                    className="inline-flex rounded-2xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm font-semibold text-amber-50 transition hover:border-amber-300/50 hover:bg-amber-300/20"
                  >
                    View raw announcement
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <p className="font-semibold text-slate-100">
                  External source unavailable
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  No real source URL is stored for this item. Use the raw
                  announcement details below and treat this as review-only
                  evidence.
                </p>
              </div>
            )}
          </div>
        </section>

        {item.rawAnnouncement ? (
          <section
            id="raw-announcement"
            className="rounded-[32px] border border-white/10 bg-white/5 p-5"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm text-slate-400">Raw announcement</p>
                <h3 className="text-xl font-semibold text-white">
                  Linked announcement details
                </h3>
              </div>
              <PriorityBadge
                tone={
                  item.sourceUrlMode === "external"
                    ? "healthy"
                    : item.sourceUrlMode === "internal"
                      ? "watch"
                      : "urgent"
                }
                label={
                  item.sourceUrlMode === "external"
                    ? "Verified source"
                    : item.sourceUrlMode === "internal"
                      ? "Demo/sample evidence"
                      : "External source unavailable"
                }
              />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Headline
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  {item.rawAnnouncement.headline}
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Category
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  {item.rawAnnouncement.announcementType}
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Published
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  {item.rawAnnouncement.publishedAt}
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Company
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  {item.rawAnnouncement.companyName}
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Verification
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  {item.verificationStatus}
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Raw payload
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  {item.rawAnnouncement.rawPayloadSummary}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Evidence trail</p>
              <h3 className="text-xl font-semibold text-white">
                Linked evidence items
              </h3>
            </div>
            <PriorityBadge
              tone={tone}
              label={`${item.evidenceItems.length} evidence item${item.evidenceItems.length === 1 ? "" : "s"}`}
            />
          </div>

          {item.evidenceItems.length ? (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {item.evidenceItems.map((evidence) => {
                const linkMode = getEvidenceLinkMode(evidence);
                const isExternal =
                  linkMode === "external" &&
                  isValidExternalEvidenceUrl(evidence.sourceUrl);
                const isDemo =
                  linkMode === "internal" && isMockEvidenceUrl(evidence.sourceUrl);
                const href =
                  linkMode === "internal" && evidence.intelligenceItemId
                    ? evidence.intelligenceItemId === item.id
                      ? "#raw-announcement"
                      : `/intelligence/${evidence.intelligenceItemId}`
                    : evidence.sourceUrl ?? null;
                const label =
                  linkMode === "external"
                    ? "Open source"
                    : linkMode === "internal"
                      ? isDemo
                        ? "View demo evidence"
                        : "View evidence"
                      : "Evidence unavailable";

                return (
                  <article
                    key={evidence.id}
                    className="rounded-[28px] border border-white/10 bg-slate-950/60 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <PriorityBadge
                        tone={evidence.isPrimary ? "watch" : tone}
                        label={evidence.isPrimary ? "Primary evidence" : "Evidence"}
                      />
                      <PriorityBadge
                        tone="core"
                        label={
                          evidence.evidenceType
                            ? evidence.evidenceType.replaceAll("_", " ")
                            : "Evidence"
                        }
                      />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-white">
                      {evidence.label}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {evidence.summary}
                    </p>
                    {linkMode === "external" && isExternal && href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex rounded-2xl border border-sky-300/30 bg-sky-300/10 px-4 py-3 text-sm font-semibold text-sky-100 transition hover:border-sky-300/50 hover:bg-sky-300/20"
                      >
                        {label}
                      </a>
                    ) : linkMode === "internal" && href ? (
                      <Link
                        href={href}
                        className="mt-3 inline-flex rounded-2xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm font-semibold text-amber-50 transition hover:border-amber-300/50 hover:bg-amber-300/20"
                      >
                        {label}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="mt-3 inline-flex cursor-not-allowed rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-400"
                      >
                        {label}
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
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-4 rounded-3xl border border-dashed border-white/15 bg-slate-950/60 p-4 text-sm text-slate-300">
              No linked evidence has been stored for this intelligence item yet.
            </div>
          )}
        </section>

        <AttentionPanel
          tone={tone}
          eyebrow="Decision support only"
          title="Manual review required"
          subtitle="This page explains the stored evidence. It does not place trades and it does not tell you to buy."
        >
          <p className="text-sm leading-6 text-slate-200/90">
            Use the evidence trail, source trust, and scoring reason to decide
            whether the item deserves a manual follow-up.
          </p>
        </AttentionPanel>
      </div>
    </AppShell>
  );
}
