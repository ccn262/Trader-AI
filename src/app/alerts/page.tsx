import { AppShell } from "@/components/app-shell";
import { getAlerts } from "@/lib/data";

export default async function AlertsPage() {
  const alerts = await getAlerts();

  return (
    <AppShell
      title="Alerts"
      subtitle="Alerts should prompt review, not action. Every message keeps the user in control."
    >
      <div className="space-y-4">
        {alerts.map((alert) => (
          <article
            key={`${alert.asset}-${alert.type}`}
            className="rounded-[32px] border border-white/10 bg-white/5 p-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {alert.type}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-white">
                  {alert.title}
                </h2>
                <p className="mt-1 text-sm text-slate-400">{alert.asset}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-right">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Due
                </p>
                <p className="mt-2 text-sm font-semibold text-white">{alert.due}</p>
              </div>
            </div>

            <p className="mt-4 rounded-3xl border border-white/10 bg-slate-950/60 p-4 text-sm leading-6 text-slate-300">
              {alert.action}
            </p>
          </article>
        ))}

        <section className="rounded-[32px] border border-amber-300/15 bg-amber-300/10 p-5 text-amber-50">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-100/70">
            Reminder
          </p>
          <p className="mt-3 text-sm leading-6 text-amber-50/90">
            Alert copy should always encourage a review of the chart, thesis,
            and risk setup before any decision is made.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
