import Link from "next/link";

import {
  AttentionPanel,
  PriorityBadge,
} from "@/components/attention";
import { AppShell } from "@/components/app-shell";
import {
  archiveJournalEntryAction,
  saveJournalEntryAction,
} from "@/lib/supabase/actions";
import { getAssets, getJournalEntries } from "@/lib/data";
import { hasSupabaseConfig } from "@/lib/supabase/server";

function getJournalTone(action: string) {
  const normalized = action.toLowerCase();
  if (normalized.includes("avoid")) return "urgent" as const;
  if (normalized.includes("paper")) return "core" as const;
  if (normalized.includes("buy") || normalized.includes("add")) return "watch" as const;
  if (normalized.includes("trim") || normalized.includes("sell"))
    return "watch" as const;
  return "core" as const;
}

export default async function JournalPage() {
  const journalEntries = await getJournalEntries();
  const assets = await getAssets();
  const writable = hasSupabaseConfig();

  return (
    <AppShell
      title="Journal"
      subtitle="Trade notes stay decision-support only. Trades are placed manually outside this app."
    >
      <div className="space-y-6">
        <AttentionPanel
          tone="watch"
          eyebrow="Decision support only"
          title="Journal"
          subtitle="Capture the thesis, risk, review date, and manual execution confirmation in one place."
        >
          <p className="text-sm leading-6 text-slate-200/90">
            Trades are placed manually outside this app.
          </p>
        </AttentionPanel>

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Create entry</p>
              <h2 className="text-xl font-semibold text-white">
                Log a trade journal entry
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
              action={saveJournalEntryAction}
              className="mt-5 grid gap-4 md:grid-cols-2"
            >
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-200">Asset</span>
                <select
                  name="asset_id"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                >
                  {assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.symbol} · {asset.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">Action</span>
                <select
                  name="action"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                >
                  <option value="add">Add</option>
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                  <option value="trim">Trim</option>
                  <option value="paper_trade">Paper trade</option>
                  <option value="avoid">Avoid</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">Amount</span>
                <input
                  name="amount"
                  type="number"
                  step="0.01"
                  placeholder="30"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">
                  Entry price
                </span>
                <input
                  name="entry_price"
                  type="number"
                  step="0.01"
                  placeholder="30"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-200">
                  Thesis / reason
                </span>
                <textarea
                  name="thesis_reason"
                  rows={3}
                  placeholder="Why does this trade exist?"
                  className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-200">
                  Risk notes
                </span>
                <textarea
                  name="risk_notes"
                  rows={3}
                  placeholder="What is the risk context?"
                  className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">
                  Risk amount
                </span>
                <input
                  name="risk_amount"
                  type="number"
                  step="0.01"
                  placeholder="1"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">
                  Review date
                </span>
                <input
                  name="review_date"
                  type="date"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-200">
                  Stop-loss idea
                </span>
                <input
                  name="stop_loss_idea"
                  placeholder="What invalidates the idea?"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">
                  Emotion before
                </span>
                <input
                  name="emotion_before"
                  placeholder="Calm"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">Result</span>
                <input
                  name="result"
                  placeholder="Pending"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-200">
                  Lesson learned
                </span>
                <input
                  name="lesson_learned"
                  placeholder="What did you learn?"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                />
              </label>
              <label className="flex items-start gap-3 rounded-3xl border border-white/10 bg-slate-950/50 p-4 text-sm text-slate-300 md:col-span-2">
                <input
                  type="checkbox"
                  name="manual_execution_confirmed"
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-teal-300"
                />
                <span>
                  I confirm this is a manual Trading 212 decision-support entry,
                  not an automated trade instruction.
                </span>
              </label>
              <div className="md:col-span-2">
                <button className="rounded-2xl bg-teal-300 px-5 py-3 text-sm font-semibold text-slate-950">
                  Save journal entry
                </button>
              </div>
            </form>
          ) : (
            <AttentionPanel
              tone="watch"
              title="Supabase fallback"
              subtitle="Connect Supabase to create or edit journal entries. Mock fallback remains available for reading."
              className="mt-4"
            />
          )}
        </section>

        <section className="space-y-4 rounded-[32px] border border-white/10 bg-white/5 p-5">
          <div>
            <p className="text-sm text-slate-400">Journal entries</p>
            <h2 className="text-xl font-semibold text-white">
              View, edit, and archive
            </h2>
          </div>

          {journalEntries.length ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {journalEntries.map((entry) => {
                const tone = getJournalTone(entry.action);

                return (
                  <article
                    key={entry.id}
                    className={[
                      "rounded-[28px] border p-4",
                      tone === "urgent"
                        ? "border-rose-300/30 bg-rose-300/10"
                        : tone === "watch"
                          ? "border-amber-300/30 bg-amber-300/10"
                          : "border-sky-300/30 bg-sky-300/10",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-lg font-semibold text-white">
                            {entry.ticker}
                          </p>
                          <PriorityBadge tone={tone} label={entry.action} />
                        </div>
                        <p className="mt-1 text-sm text-slate-100/80">
                          Amount: {entry.amount}
                        </p>
                      </div>
                      <Link
                        href={`/journal/${entry.id}`}
                        className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200"
                      >
                        Detail
                      </Link>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <PriorityBadge
                        tone={tone}
                        label={`Review: ${entry.reviewDate}`}
                      />
                      <PriorityBadge
                        tone={entry.manualExecutionConfirmed ? "healthy" : "urgent"}
                        label={
                          entry.manualExecutionConfirmed
                            ? "Manual confirmed"
                            : "Manual confirmation needed"
                        }
                      />
                      <PriorityBadge tone={tone} label={`Risk ${entry.riskAmount}`} />
                    </div>

                    <div className="mt-4 space-y-3 rounded-3xl border border-white/10 bg-slate-950/55 p-4 text-sm leading-6 text-slate-200">
                      <p>
                        <span className="font-semibold text-white">Thesis: </span>
                        {entry.thesisReason}
                      </p>
                      <p>
                        <span className="font-semibold text-white">Risk: </span>
                        {entry.riskNotes}
                      </p>
                      <p>
                        <span className="font-semibold text-white">Lesson: </span>
                        {entry.lesson}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href={`/journal/${entry.id}`}
                        className="rounded-2xl bg-teal-300 px-4 py-2 text-sm font-semibold text-slate-950"
                      >
                        Edit entry
                      </Link>
                      {writable ? (
                        <form action={archiveJournalEntryAction}>
                          <input type="hidden" name="id" value={entry.id} />
                          <button className="rounded-2xl border border-rose-300/30 bg-rose-300/10 px-4 py-2 text-sm font-semibold text-rose-100">
                            Archive entry
                          </button>
                        </form>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <AttentionPanel
              tone="healthy"
              title="No journal entries yet"
              subtitle="Create one above to start tracking your decisions."
            />
          )}
        </section>
      </div>
    </AppShell>
  );
}
