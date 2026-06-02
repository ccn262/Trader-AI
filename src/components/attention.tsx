import {
  AlertTriangle,
  BadgeInfo,
  CircleAlert,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

export type AttentionTone =
  | "urgent"
  | "watch"
  | "healthy"
  | "core"
  | "speculative";

type ToneConfig = {
  label: string;
  badge: string;
  border: string;
  surface: string;
  text: string;
  mutedText: string;
  icon: LucideIcon;
};

const toneConfig: Record<AttentionTone, ToneConfig> = {
  urgent: {
    label: "Urgent",
    badge: "border-rose-300/30 bg-rose-300/15 text-rose-50",
    border: "border-rose-300/30",
    surface: "bg-rose-300/10",
    text: "text-rose-50",
    mutedText: "text-rose-50/80",
    icon: CircleAlert,
  },
  watch: {
    label: "Watch today",
    badge: "border-amber-300/30 bg-amber-300/15 text-amber-50",
    border: "border-amber-300/30",
    surface: "bg-amber-300/10",
    text: "text-amber-50",
    mutedText: "text-amber-50/80",
    icon: AlertTriangle,
  },
  healthy: {
    label: "Healthy",
    badge: "border-emerald-300/30 bg-emerald-300/15 text-emerald-50",
    border: "border-emerald-300/30",
    surface: "bg-emerald-300/10",
    text: "text-emerald-50",
    mutedText: "text-emerald-50/80",
    icon: ShieldCheck,
  },
  core: {
    label: "Core",
    badge: "border-sky-300/30 bg-sky-300/15 text-sky-50",
    border: "border-sky-300/30",
    surface: "bg-sky-300/10",
    text: "text-sky-50",
    mutedText: "text-sky-50/80",
    icon: BadgeInfo,
  },
  speculative: {
    label: "Speculative",
    badge: "border-violet-300/30 bg-violet-300/15 text-violet-50",
    border: "border-violet-300/30",
    surface: "bg-violet-300/10",
    text: "text-violet-50",
    mutedText: "text-violet-50/80",
    icon: Sparkles,
  },
};

function getToneConfig(tone: AttentionTone) {
  return toneConfig[tone];
}

export function getAttentionToneFromStatus(
  status: string,
  fallback: AttentionTone = "core",
): AttentionTone {
  const normalized = status.toLowerCase();
  if (normalized.includes("avoid")) return "urgent";
  if (normalized.includes("wait") || normalized.includes("review")) return "watch";
  if (normalized.includes("spec")) return "speculative";
  if (normalized.includes("hold") || normalized.includes("healthy")) return "healthy";
  if (normalized.includes("core") || normalized.includes("informational")) return "core";
  return fallback;
}

export function getToneFromRiskLevel(riskLevel: string): AttentionTone {
  const normalized = riskLevel.toLowerCase();
  if (normalized.includes("spec")) return "speculative";
  if (normalized.includes("high")) return "urgent";
  if (normalized.includes("medium")) return "watch";
  if (normalized.includes("low")) return "healthy";
  return "core";
}

export function getToneFromScore(score: number, speculative = false): AttentionTone {
  if (speculative) return score < 65 ? "speculative" : "watch";
  if (score >= 80) return "core";
  if (score >= 65) return "healthy";
  if (score >= 45) return "watch";
  return "urgent";
}

export function PriorityBadge({
  tone,
  label,
  className = "",
}: {
  tone: AttentionTone;
  label?: string;
  className?: string;
}) {
  const config = getToneConfig(tone);
  const Icon = config.icon;

  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
        config.badge,
        className,
      ].join(" ")}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{label ?? config.label}</span>
    </span>
  );
}

export function ScoreBadge({
  score,
  tone,
  className = "",
}: {
  score: number;
  tone?: AttentionTone;
  className?: string;
}) {
  const resolvedTone = tone ?? getToneFromScore(score);
  const config = getToneConfig(resolvedTone);

  return (
    <div
      className={[
        "inline-flex items-center gap-3 rounded-3xl border px-4 py-3",
        config.border,
        config.surface,
        className,
      ].join(" ")}
    >
      <div>
        <p className={`text-xs uppercase tracking-[0.3em] ${config.mutedText}`}>
          Score
        </p>
        <p className={`mt-1 text-3xl font-semibold ${config.text}`}>{score}</p>
      </div>
      <div className="h-10 w-px bg-white/10" aria-hidden="true" />
      <div className="min-w-0">
        <p className={`text-sm font-semibold ${config.text}`}>
          {config.label}
        </p>
        <p className="mt-1 text-sm text-slate-300">Review before action</p>
      </div>
    </div>
  );
}

export function RiskBadge({
  risk,
  className = "",
}: {
  risk: string;
  className?: string;
}) {
  const tone = getToneFromRiskLevel(risk);

  return (
    <PriorityBadge
      tone={tone}
      label={risk}
      className={className}
    />
  );
}

export function AttentionPanel({
  tone,
  title,
  subtitle,
  eyebrow,
  children,
  className = "",
}: {
  tone: AttentionTone;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children?: ReactNode;
  className?: string;
}) {
  const config = getToneConfig(tone);
  return (
    <section
      className={[
        "rounded-[32px] border p-5 shadow-glow",
        config.border,
        config.surface,
        className,
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          {eyebrow ? (
            <p className={`text-sm font-medium ${config.mutedText}`}>{eyebrow}</p>
          ) : null}
          <h2 className={`mt-1 text-xl font-semibold ${config.text}`}>{title}</h2>
          {subtitle ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200/90">
              {subtitle}
            </p>
          ) : null}
        </div>
        <PriorityBadge tone={tone} />
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </section>
  );
}

export function AlertPriorityCard({
  tone,
  title,
  subtitle,
  children,
  className = "",
}: {
  tone: AttentionTone;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}) {
  const config = getToneConfig(tone);

  return (
    <article
      className={[
        "rounded-[28px] border p-4 shadow-glow",
        config.border,
        config.surface,
        className,
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <PriorityBadge tone={tone} label={title} />
          {subtitle ? (
            <p className="mt-3 text-sm leading-6 text-slate-200/90">
              {subtitle}
            </p>
          ) : null}
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-200">
          Priority
        </div>
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </article>
  );
}
