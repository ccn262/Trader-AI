import { AppShell } from "@/components/app-shell";
import { JournalForm } from "@/components/journal-form";
import { getJournalEntries } from "@/lib/data";

export default async function JournalPage() {
  const journalEntries = await getJournalEntries();

  return (
    <AppShell
      title="Journal"
      subtitle="Capture the reason, risk, and review plan before you act. This form is mock-only in Phase 1."
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[32px] border border-white/10 bg-white/5 p-5">
          <div className="mb-5">
            <p className="text-sm text-slate-400">New entry</p>
            <h2 className="text-xl font-semibold text-white">Log a trade idea</h2>
          </div>
          <JournalForm />
        </section>

        <section className="space-y-4 rounded-[32px] border border-white/10 bg-white/5 p-5">
          <div>
            <p className="text-sm text-slate-400">Recent entries</p>
            <h2 className="text-xl font-semibold text-white">What has been logged</h2>
          </div>

          <div className="space-y-4">
            {journalEntries.map((entry) => (
              <article
                key={`${entry.ticker}-${entry.action}`}
                className="rounded-3xl border border-white/10 bg-slate-950/60 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-white">
                      {entry.ticker}
                    </p>
                    <p className="text-sm text-slate-400">
                      {entry.action} · {entry.amount}
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-200">
                    {entry.reviewDate}
                  </span>
                </div>
                <div className="mt-4 space-y-3 text-sm leading-6 text-slate-400">
                  <p>
                    <span className="font-semibold text-slate-200">
                      Thesis / reason:
                    </span>{" "}
                    {entry.thesisReason}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-200">
                      Risk notes:
                    </span>{" "}
                    {entry.riskNotes}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-200">
                      Risk amount:
                    </span>{" "}
                    {entry.riskAmount}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-200">
                      Stop-loss idea:
                    </span>{" "}
                    {entry.stopLossIdea}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-200">
                      Manual execution:
                    </span>{" "}
                    {entry.manualExecutionConfirmed ? "Confirmed" : "Not confirmed"}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-200">
                      Emotion:
                    </span>{" "}
                    {entry.emotionBefore}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-200">
                      Lesson:
                    </span>{" "}
                    {entry.lesson}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
