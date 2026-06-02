import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import {
  archiveJournalEntryAction,
  saveJournalEntryAction,
} from "@/lib/supabase/actions";
import { getAssets, getJournalEntryById } from "@/lib/data";
import { hasSupabaseConfig } from "@/lib/supabase/server";

export default async function JournalEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await getJournalEntryById(id);
  const assets = await getAssets();
  const writable = hasSupabaseConfig();

  if (!entry) {
    return (
      <AppShell
        title="Journal not found"
        subtitle="Decision support only. Trades are placed manually outside this app."
      >
        <section className="rounded-[32px] border border-white/10 bg-white/5 p-5">
          <p className="text-lg font-semibold text-white">
            No journal entry found for {id}.
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            The entry may have been archived or the link may be pointing at a
            mock record that has not been seeded yet.
          </p>
          <Link
            href="/journal"
            className="mt-5 inline-flex rounded-2xl bg-teal-300 px-5 py-3 text-sm font-semibold text-slate-950"
          >
            Back to journal
          </Link>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={`Journal ${entry.ticker}`}
      subtitle="Trade notes stay decision-support only. Trades are placed manually outside this app."
    >
      <div className="space-y-6">
        <section className="rounded-[32px] border border-amber-300/20 bg-amber-300/10 p-4 text-amber-50">
          <p className="font-semibold">Decision support only</p>
          <p className="mt-2 text-sm leading-6 text-amber-50/90">
            Trades are placed manually outside this app.
          </p>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Journal detail</p>
              <h2 className="text-2xl font-semibold text-white">
                {entry.ticker} · {entry.action}
              </h2>
            </div>
            <Link
              href="/journal"
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200"
            >
              Back
            </Link>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Amount
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {entry.amount}
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Review date
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {entry.reviewDate}
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Manual exec
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {entry.manualExecutionConfirmed ? "Confirmed" : "Not confirmed"}
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Risk amount
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {entry.riskAmount}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Edit entry</p>
              <h2 className="text-xl font-semibold text-white">
                Update the record
              </h2>
            </div>
            {!writable ? (
              <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs font-semibold text-slate-300">
                Supabase fallback
              </span>
            ) : null}
          </div>

          {writable ? (
            <>
            <form action={saveJournalEntryAction} className="mt-5 grid gap-4 md:grid-cols-2">
              <input type="hidden" name="id" value={entry.id} />
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-200">Asset</span>
                <select
                  name="asset_id"
                  defaultValue={entry.assetId}
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
                  defaultValue={
                    entry.action === "Paper trade"
                      ? "paper_trade"
                      : entry.action === "Avoid"
                        ? "avoid"
                        : entry.action.toLowerCase()
                  }
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
                  defaultValue={entry.amount.replace("£", "")}
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
                  placeholder="Optional"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-200">
                  Thesis / reason
                </span>
                <textarea
                  name="thesis_reason"
                  defaultValue={entry.thesisReason}
                  rows={3}
                  className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-200">
                  Risk notes
                </span>
                <textarea
                  name="risk_notes"
                  defaultValue={entry.riskNotes}
                  rows={3}
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
                  defaultValue={entry.riskAmount.replace("£", "")}
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
                  defaultValue={entry.reviewDate}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-200">
                  Stop-loss idea
                </span>
                <input
                  name="stop_loss_idea"
                  defaultValue={entry.stopLossIdea}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">
                  Emotion before
                </span>
                <input
                  name="emotion_before"
                  defaultValue={entry.emotionBefore}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">Result</span>
                <input
                  name="result"
                  defaultValue={""}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-200">
                  Lesson learned
                </span>
                <input
                  name="lesson_learned"
                  defaultValue={entry.lesson}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                />
              </label>
              <label className="flex items-start gap-3 rounded-3xl border border-white/10 bg-slate-950/50 p-4 text-sm text-slate-300 md:col-span-2">
                <input
                  type="checkbox"
                  name="manual_execution_confirmed"
                  defaultChecked={entry.manualExecutionConfirmed}
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-teal-300"
                />
                <span>
                  I confirm this is a manual Trading 212 decision-support entry.
                </span>
              </label>
              <div className="md:col-span-2 flex flex-wrap gap-3">
                <button className="rounded-2xl bg-teal-300 px-5 py-3 text-sm font-semibold text-slate-950">
                  Save changes
                </button>
              </div>
            </form>
            <form action={archiveJournalEntryAction} className="mt-3">
              <input type="hidden" name="id" value={entry.id} />
              <button className="rounded-2xl border border-rose-300/30 bg-rose-300/10 px-5 py-3 text-sm font-semibold text-rose-100">
                Archive entry
              </button>
            </form>
            </>
          ) : (
            <p className="mt-4 rounded-3xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
              Connect Supabase to edit or archive journal entries.
            </p>
          )}
        </section>
      </div>
    </AppShell>
  );
}
