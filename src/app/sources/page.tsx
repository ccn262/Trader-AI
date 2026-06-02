import Link from "next/link";

import { AttentionPanel, PriorityBadge } from "@/components/attention";
import { AppShell } from "@/components/app-shell";
import {
  getLatestSourceDiagnostics,
  getSourceCandidates,
  type SourceCandidateViewModel,
  type SourceDiagnosticViewModel,
} from "@/lib/data";

function getSourceTone(status: SourceCandidateViewModel["status"]) {
  if (status === "validated") return "healthy" as const;
  if (status === "validating") return "watch" as const;
  if (status === "rejected") return "urgent" as const;
  if (status === "paid_required") return "speculative" as const;
  if (status === "manual_only") return "core" as const;
  return "core" as const;
}

function formatLabel(value: string | null | undefined) {
  if (!value) return "Not set";
  return value
    .replaceAll("_", " ")
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getLatestDiagnosticByCandidate(
  diagnostics: SourceDiagnosticViewModel[],
): Map<string, SourceDiagnosticViewModel> {
  const map = new Map<string, SourceDiagnosticViewModel>();
  for (const diagnostic of diagnostics) {
    if (!map.has(diagnostic.sourceCandidateId)) {
      map.set(diagnostic.sourceCandidateId, diagnostic);
    }
  }

  return map;
}

export default async function SourcesPage() {
  const [candidates, diagnostics] = await Promise.all([
    getSourceCandidates(),
    getLatestSourceDiagnostics(),
  ]);
  const diagnosticsByCandidate = getLatestDiagnosticByCandidate(diagnostics);
  const counts = {
    total: candidates.length,
    validated: candidates.filter((candidate) => candidate.status === "validated").length,
    rejected: candidates.filter((candidate) => candidate.status === "rejected").length,
    needsValidation: candidates.filter((candidate) =>
      candidate.status === "candidate" || candidate.status === "validating",
    ).length,
    paidOrManual: candidates.filter((candidate) =>
      candidate.status === "paid_required" || candidate.status === "manual_only",
    ).length,
  };

  return (
    <AppShell
      title="Sources"
      subtitle="Decision support only. Source registry entries track validation outcomes, not trading instructions."
    >
      <div className="space-y-6">
        <AttentionPanel
          tone="watch"
          eyebrow="Source registry"
          title="Candidate sources and validation outcomes"
          subtitle="Use this page to see which sources are candidate, validating, validated, rejected, paid-required, or manual-only."
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {[
              { label: "Total candidates", value: counts.total, tone: "core" as const },
              { label: "Validated", value: counts.validated, tone: "healthy" as const },
              { label: "Rejected", value: counts.rejected, tone: "urgent" as const },
              { label: "Needs validation", value: counts.needsValidation, tone: "watch" as const },
              { label: "Paid/manual-only", value: counts.paidOrManual, tone: "speculative" as const },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-[28px] border border-white/10 bg-slate-950/55 p-4"
              >
                <PriorityBadge tone={card.tone} label={card.label} />
                <p className="mt-4 text-3xl font-semibold text-white">{card.value}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Registry count
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[28px] border border-white/10 bg-slate-950/55 p-4">
              <p className="text-sm font-semibold text-white">
                London Stock Exchange /news
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                The diagnostic workflow confirmed that the page is reachable but
                JavaScript-rendered, with anchorCount 0 and likelyRnsHrefCount 0.
                It is not suitable for a simple HTML parser.
              </p>
              <p className="mt-3 text-sm leading-6 text-rose-100">
                Evaluation outcome: rejected for simple parser use.
              </p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-slate-950/55 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Current outcome
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                Rejected for simple parser use
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Keep it as a diagnostic reference, not as verified external
                evidence.
              </p>
            </div>
          </div>
        </AttentionPanel>

        {candidates.length ? (
          <section className="grid gap-4 xl:grid-cols-2">
            {candidates.map((candidate) => {
              const tone = getSourceTone(candidate.status);
              const hasUrl = Boolean(candidate.url);
              const latestDiagnostic = diagnosticsByCandidate.get(candidate.id) ?? null;

              return (
                <article
                  key={candidate.id}
                  className="rounded-[32px] border border-white/10 bg-white/5 p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <PriorityBadge
                        tone={tone}
                        label={formatLabel(candidate.status)}
                      />
                      <h2 className="mt-3 text-xl font-semibold text-white">
                        {candidate.name}
                      </h2>
                      <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-300">
                        <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5">
                          {formatLabel(candidate.sourceType)}
                        </span>
                        <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5">
                          {formatLabel(candidate.accessMethod)}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-slate-950/60 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        Confidence
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-white">
                        {candidate.confidenceScore}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        URL
                      </p>
                      {hasUrl && candidate.url ? (
                        <a
                          href={candidate.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 block break-all text-sm font-medium text-sky-100 underline decoration-sky-300/40 underline-offset-4"
                        >
                          {candidate.url}
                        </a>
                      ) : (
                        <p className="mt-2 text-sm text-slate-300">No URL recorded</p>
                      )}
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        Validation
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white">
                        {formatLabel(candidate.status)}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        Owner: {candidate.validationOwner}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        Last checked
                      </p>
                      <p className="mt-2 text-sm font-medium text-white">
                        {candidate.lastCheckedAt}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Validated: {candidate.validatedAt}
                      </p>
                      <p className="text-sm leading-6 text-slate-400">
                        Rejected: {candidate.rejectedAt}
                      </p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        Diagnostic status
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white">
                        {formatLabel(candidate.diagnosticStatus)}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {candidate.diagnosticSummary}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        {candidate.validationNotes || "No validation notes yet."}
                      </p>
                    </div>
                  </div>

                  {latestDiagnostic ? (
                    <div className="mt-5 rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        Latest diagnostic
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <PriorityBadge tone={tone} label={latestDiagnostic.recommendation} />
                        <PriorityBadge
                          tone={latestDiagnostic.appearsJavaScriptRendered ? "speculative" : "healthy"}
                          label={latestDiagnostic.appearsJavaScriptRendered ? "JS-rendered" : "HTML-based"}
                        />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-300">
                        {latestDiagnostic.diagnosticSummary}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-5 rounded-3xl border border-dashed border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
                      No diagnostics stored yet.
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href={`/sources/${candidate.id}`}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/20 hover:bg-white/10"
                    >
                      Open details
                    </Link>
                    {candidate.status === "rejected" && candidate.name.includes("London Stock Exchange") ? (
                      <span className="rounded-2xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm font-semibold text-rose-50">
                        Not suitable for simple parsing
                      </span>
                    ) : null}
                  </div>

                  {candidate.status === "rejected" && candidate.name.includes("London Stock Exchange") ? (
                    <p className="mt-5 rounded-3xl border border-rose-300/20 bg-rose-300/10 p-4 text-sm leading-6 text-rose-50">
                      This source is reachable but is not suitable for simple
                      server-side parsing. Do not force it into the live RNS
                      ingestion path.
                    </p>
                  ) : null}
                </article>
              );
            })}
          </section>
        ) : (
          <section className="rounded-[32px] border border-dashed border-white/15 bg-slate-950/60 p-5 text-sm leading-6 text-slate-300">
            <p className="font-semibold text-white">No source candidates yet</p>
            <p className="mt-2 text-slate-400">
              Seed rows will appear here once the source registry migration is
              applied.
            </p>
          </section>
        )}

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">Navigation</p>
              <h2 className="text-xl font-semibold text-white">
                Secondary registry links
              </h2>
            </div>
            <Link
              href="/settings"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/10"
            >
              Back to settings
            </Link>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Sources are shown here as a read-only registry so validation can be
            reviewed without changing ingestion behavior.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
