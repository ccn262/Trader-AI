"use client";

import type { FormEvent } from "react";
import { useState } from "react";

const initialState = {
  asset: "VWRP",
  direction: "Add",
  amount: "£30",
  entryPrice: "30.00",
  thesisReason: "",
  riskNotes: "",
  riskAmount: "£1",
  stopLossIdea: "",
  reviewDate: "",
  emotionBefore: "Calm",
  result: "",
  lesson: "",
  manualExecutionConfirmed: false,
};

export function JournalForm() {
  const [form, setForm] = useState(initialState);
  const [saved, setSaved] = useState(false);

  const requiredFieldsFilled =
    form.thesisReason.trim().length > 0 &&
    form.riskNotes.trim().length > 0 &&
    form.riskAmount.trim().length > 0 &&
    form.stopLossIdea.trim().length > 0 &&
    form.reviewDate.trim().length > 0 &&
    form.manualExecutionConfirmed;

  function updateField(
    field: keyof typeof initialState,
    value: string | boolean,
  ) {
    setSaved(false);
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (requiredFieldsFilled) {
      setSaved(true);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Asset</span>
          <input
            value={form.asset}
            onChange={(event) => updateField("asset", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none ring-0 transition placeholder:text-slate-500 focus:border-teal-300/40"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Direction</span>
          <select
            value={form.direction}
            onChange={(event) => updateField("direction", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none ring-0 transition focus:border-teal-300/40"
          >
            <option>Buy</option>
            <option>Add</option>
            <option>Trim</option>
            <option>Sell</option>
            <option>Paper trade</option>
            <option>Avoid</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Amount</span>
          <input
            value={form.amount}
            onChange={(event) => updateField("amount", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-teal-300/40"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Entry price</span>
          <input
            value={form.entryPrice}
            onChange={(event) => updateField("entryPrice", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-teal-300/40"
          />
        </label>
      </div>

      <label className="space-y-2">
        <span className="text-sm font-medium text-slate-200">
          Thesis / reason
        </span>
        <textarea
          value={form.thesisReason}
          onChange={(event) => updateField("thesisReason", event.target.value)}
          rows={3}
          className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-slate-500 focus:border-teal-300/40"
          placeholder="Why does this trade exist?"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Risk notes</span>
          <textarea
            value={form.riskNotes}
            onChange={(event) => updateField("riskNotes", event.target.value)}
            rows={3}
            className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-slate-500 focus:border-teal-300/40"
            placeholder="What is the risk context?"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Risk amount</span>
          <input
            value={form.riskAmount}
            onChange={(event) => updateField("riskAmount", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-teal-300/40"
            placeholder="£1 max in beginner mode"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">
            Stop-loss idea
          </span>
          <input
            value={form.stopLossIdea}
            onChange={(event) => updateField("stopLossIdea", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-teal-300/40"
            placeholder="What invalidates the idea?"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">
            Review date
          </span>
          <input
            type="date"
            value={form.reviewDate}
            onChange={(event) => updateField("reviewDate", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-teal-300/40"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">
            Emotion before trade
          </span>
          <input
            value={form.emotionBefore}
            onChange={(event) => updateField("emotionBefore", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-teal-300/40"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">
            Result
          </span>
          <input
            value={form.result}
            onChange={(event) => updateField("result", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-teal-300/40"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Lesson learned</span>
          <input
            value={form.lesson}
            onChange={(event) => updateField("lesson", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-teal-300/40"
          />
        </label>
      </div>

      <label className="flex items-start gap-3 rounded-3xl border border-white/10 bg-slate-950/50 p-4 text-sm text-slate-300">
        <input
          type="checkbox"
          checked={form.manualExecutionConfirmed}
          onChange={(event) =>
            updateField("manualExecutionConfirmed", event.target.checked)
          }
          className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-teal-300 focus:ring-teal-300"
        />
        <span>
          I confirm this is a manual Trading 212 decision-support entry, not an
          automated trade instruction.
        </span>
      </label>

      <div
        className={[
          "rounded-3xl border p-4 text-sm",
          requiredFieldsFilled
            ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-50"
            : "border-amber-300/30 bg-amber-300/10 text-amber-50",
        ].join(" ")}
      >
        {requiredFieldsFilled
          ? "Risk check complete. This mock form is ready to save, but Phase 1 does not persist data."
          : "Risk check incomplete. Add a thesis/reason, risk notes, risk amount, stop-loss idea, review date, and manual execution confirmation before saving."}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={!requiredFieldsFilled}
          className="inline-flex items-center justify-center rounded-2xl bg-teal-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          Save mock journal entry
        </button>
        <p className="text-sm text-slate-400">
          {saved
            ? "Saved locally for the prototype session only."
            : "This form is intentionally mock-only in Phase 1."}
        </p>
      </div>
    </form>
  );
}
