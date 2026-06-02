import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { settingsGuardrails } from "@/lib/mock-data";
import { getSettings } from "@/lib/data";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <AppShell
      title="Settings"
      subtitle="This prototype keeps the guardrails visible so the product stays in decision-support mode."
    >
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[32px] border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Disclaimer</p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            Keep this visible
          </h2>
          <p className="mt-4 rounded-3xl border border-teal-300/20 bg-teal-300/10 p-4 text-sm leading-6 text-teal-50">
            {settings.disclaimer}
          </p>

          <div className="mt-5 space-y-3">
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-sm font-semibold text-white">Risk mode</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {settings.riskMode === "beginner"
                  ? "Beginner mode stays on by default to keep the prototype calm, simple, and suitable for a small manual account."
                  : `Risk mode is set to ${settings.riskMode}.`}
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-sm font-semibold text-white">Integrations</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {settings.decisionSupportOnly
                  ? "Decision support only. No broker integration, no live market API, and no auto-trading."
                  : "Supabase is connected for read access."}
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-sm font-semibold text-white">Base currency</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {settings.baseCurrency}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Guardrails</p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            What the app must not do
          </h2>

          <div className="mt-5 space-y-3">
            {settingsGuardrails.map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-white/10 bg-slate-950/60 p-4 text-sm leading-6 text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-5 xl:col-span-2">
          <p className="text-sm text-slate-400">Registry</p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            Source candidate registry
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
            Review candidate sources, validation outcomes, and diagnostic
            summaries before changing any ingestion logic.
          </p>
          <Link
            href="/sources"
            className="mt-5 inline-flex rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/20 hover:bg-white/10"
          >
            Open sources
          </Link>
        </section>
      </div>
    </AppShell>
  );
}
