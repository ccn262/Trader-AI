import Link from "next/link";

import { AttentionPanel, PriorityBadge } from "@/components/attention";
import { AppShell } from "@/components/app-shell";
import {
  getSourceCandidateById,
  getSourceDiagnosticsForCandidate,
} from "@/lib/data";

function formatLabel(value: string | null | undefined) {
  if (!value) return "Not set";
  return value
    .replaceAll("_", " ")
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getCandidateTone(status: string) {
  if (status === "validated") return "healthy" as const;
  if (status === "rejected") return "urgent" as const;
  if (status === "validating") return "watch" as const;
  if (status === "paid_required") return "speculative" as const;
  return "core" as const;
}

export default async function SourceCandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const candidate = await getSourceCandidateById(id);
  const diagnostics = await getSourceDiagnosticsForCandidate(id);

  if (!candidate) {
    return (
      <AppShell
        title="Source not found"
        subtitle="Decision support only. Source registry entries are for validation review, not trading instructions."
      >
        <section className="rounded-[32px] border border-white/10 bg-white/5 p-5">
          <p className="text-lg font-semibold text-white">
            No source candidate found for {id}.
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            The entry may not have been seeded yet or the link may point to an
            older candidate id.
          </p>
          <Link
            href="/sources"
            className="mt-5 inline-flex rounded-2xl bg-teal-300 px-5 py-3 text-sm font-semibold text-slate-950"
          >
            Back to sources
          </Link>
        </section>
      </AppShell>
    );
  }

  const tone = getCandidateTone(candidate.status);
  const latestDiagnostic = diagnostics[0] ?? null;
  const isJavaScriptRendered =
    latestDiagnostic?.appearsJavaScriptRendered ||
    candidate.accessMethod === "js_rendered";

  return (
    <AppShell
      title={candidate.name}
      subtitle="Decision support only. This page records source evaluation outcomes and diagnostics."
    >
      <div className="space-y-6">
        <AttentionPanel
          tone={tone}
          eyebrow="Source evaluation"
          title={candidate.name}
          subtitle="Review the candidate metadata, latest diagnostic, and evaluation history before deciding whether the source should remain a candidate, be validated, or stay manual-only."
        >
          <div className="flex flex-wrap items-center gap-2">
            <PriorityBadge tone={tone} label={formatLabel(candidate.status)} />
            <PriorityBadge
              tone="core"
              label={formatLabel(candidate.accessMethod)}
            />
            <PriorityBadge tone="core" label={`${candidate.confidenceScore} confidence`} />
            <PriorityBadge tone="core" label="No ingestion action yet" />
          </div>
        </AttentionPanel>

        <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4 rounded-[32px] border border-white/10 bg-white/5 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm text-slate-400">Candidate metadata</p>
                <h2 className="text-2xl font-semibold text-white">
                  {candidate.name}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {candidate.url ? (
                    <a
                      href={candidate.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-sky-100 underline decoration-sky-300/40 underline-offset-4"
                    >
                      {candidate.url}
                    </a>
                  ) : (
                    "No URL recorded"
                  )}
                </p>
              </div>
              <Link
                href="/sources"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/20 hover:bg-white/10"
              >
                Back to sources
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Status
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {formatLabel(candidate.status)}
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Access method
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {formatLabel(candidate.accessMethod)}
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Confidence
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {candidate.confidenceScore}
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Validation owner
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {candidate.validationOwner}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Validation notes
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {candidate.validationNotes || "No validation notes yet."}
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Registry timestamps
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Last checked: {candidate.lastCheckedAt}
                </p>
                <p className="text-sm leading-6 text-slate-300">
                  Validated: {candidate.validatedAt}
                </p>
                <p className="text-sm leading-6 text-slate-300">
                  Rejected: {candidate.rejectedAt}
                </p>
              </div>
            </div>

            {isJavaScriptRendered ? (
              <div className="rounded-3xl border border-rose-300/20 bg-rose-300/10 p-4 text-rose-50">
                <p className="font-semibold">JS-rendered or unsuitable</p>
                <p className="mt-2 text-sm leading-6 text-rose-50/90">
                  This source is currently treated as unsuitable for a simple
                  parser. Do not force scraping or mark it as validated without
                  a safe manual workflow.
                </p>
              </div>
            ) : (
              <div className="rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-emerald-50">
                <p className="font-semibold">Parseable source shape</p>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  The latest diagnostic does not show a JS-rendered shell, but it
                  still needs manual validation before ingestion.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4 rounded-[32px] border border-white/10 bg-white/5 p-5">
            <div>
              <p className="text-sm text-slate-400">Latest diagnostic</p>
              <h3 className="text-xl font-semibold text-white">
                Current inspection result
              </h3>
            </div>

            {latestDiagnostic ? (
              <div className="space-y-3 rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                <div className="flex flex-wrap gap-2">
                  <PriorityBadge tone={tone} label={latestDiagnostic.recommendation} />
                  <PriorityBadge
                    tone={latestDiagnostic.appearsJavaScriptRendered ? "speculative" : "healthy"}
                    label={latestDiagnostic.appearsJavaScriptRendered ? "JS-rendered" : "HTML-based"}
                  />
                  <PriorityBadge
                    tone="core"
                    label={`HTTP ${latestDiagnostic.httpStatus}`}
                  />
                </div>

                <p className="text-sm leading-6 text-slate-300">
                  {latestDiagnostic.diagnosticSummary}
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      Content type
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">
                      {latestDiagnostic.contentType}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      Response length
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">
                      {latestDiagnostic.responseLength}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      Anchor count
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">
                      {latestDiagnostic.anchorCount}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      Likely RNS links
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">
                      {latestDiagnostic.likelyRnsHrefCount}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      Valid external URLs
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">
                      {latestDiagnostic.validExternalUrlsCount}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      Rejected URLs
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">
                      {latestDiagnostic.rejectedUrlsCount}
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Raw sample
                  </p>
                  <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap break-words text-xs leading-6 text-slate-300">
                    {JSON.stringify(latestDiagnostic.rawSample ?? {}, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
                No diagnostics stored yet for this candidate.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">Diagnostics timeline</p>
              <h3 className="text-xl font-semibold text-white">
                Recent checks for this source
              </h3>
            </div>
            <p className="text-sm text-slate-400">
              {diagnostics.length} diagnostic{diagnostics.length === 1 ? "" : "s"}
            </p>
          </div>

          {diagnostics.length ? (
            <div className="mt-4 space-y-3">
              {diagnostics.map((diagnostic) => (
                <article
                  key={diagnostic.id}
                  className="rounded-[28px] border border-white/10 bg-slate-950/60 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <PriorityBadge tone={tone} label={diagnostic.recommendation} />
                    <PriorityBadge
                      tone={diagnostic.appearsJavaScriptRendered ? "speculative" : "healthy"}
                      label={diagnostic.appearsJavaScriptRendered ? "JS-rendered" : "HTML-based"}
                    />
                    <PriorityBadge tone="core" label={diagnostic.createdAt} />
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {diagnostic.diagnosticSummary}
                  </p>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        HTTP status
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white">
                        {diagnostic.httpStatus}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        Page title
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white">
                        {diagnostic.pageTitle || "No title"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        Anchor / RNS links
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white">
                        {diagnostic.anchorCount} / {diagnostic.likelyRnsHrefCount}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        Response length
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white">
                        {diagnostic.responseLength}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-[28px] border border-dashed border-white/15 bg-slate-950/60 p-5 text-sm leading-6 text-slate-300">
              No diagnostics have been saved for this candidate yet.
            </p>
          )}
        </section>
      </div>
    </AppShell>
  );
}
