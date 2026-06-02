"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BarChart3,
  House,
  NotebookPen,
  Settings2,
  Wallet,
  Bookmark,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { disclaimer } from "@/lib/mock-data";

type AppShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

const mobileNavItems = [
  { href: "/", label: "Dashboard", icon: House },
  { href: "/watchlists", label: "Watchlists", icon: Bookmark },
  { href: "/portfolio", label: "Portfolio", icon: Wallet },
  { href: "/journal", label: "Journal", icon: NotebookPen },
  { href: "/alerts", label: "Alerts", icon: Bell },
] as const;

const sidebarItems = [
  { href: "/", label: "Dashboard", icon: House },
  { href: "/watchlists", label: "Watchlists", icon: Bookmark },
  { href: "/portfolio", label: "Portfolio", icon: Wallet },
  { href: "/journal", label: "Journal", icon: NotebookPen },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings2 },
] as const;

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  compact = false,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition",
        active
          ? "border-teal-300/40 bg-teal-300/10 text-teal-100 shadow-glow"
          : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10 hover:text-white",
        compact ? "justify-center" : "",
      ].join(" ")}
      aria-current={active ? "page" : undefined}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className={compact ? "hidden sm:inline" : ""}>{label}</span>
    </Link>
  );
}

export function AppShell({ title, subtitle, children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="hidden w-72 flex-col border-r border-white/10 bg-slate-950/70 px-5 py-6 backdrop-blur xl:flex">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-glow">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-teal-300 to-cyan-500 text-slate-950">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-teal-200/70">
                  Trader AI
                </p>
                <p className="text-sm text-slate-300">Decision support only</p>
              </div>
            </div>
            <p className="text-sm leading-6 text-slate-300">{disclaimer}</p>
          </div>

          <nav className="mt-8 flex flex-1 flex-col gap-3">
            {sidebarItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={pathname === item.href}
              />
            ))}
          </nav>

          <div className="mt-6 rounded-[28px] border border-amber-300/20 bg-amber-300/10 p-5 text-sm text-amber-100">
            <p className="font-semibold">Risk discipline</p>
            <p className="mt-2 leading-6 text-amber-50/90">
              Beginner mode keeps the portfolio focused on process, not
              predictions.
            </p>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur">
            <div className="flex items-start justify-between gap-4 px-4 py-4 sm:px-6 xl:px-8">
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.35em] text-teal-200/70">
                  Phase 1 mock prototype
                </p>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {title}
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-slate-400">
                  {subtitle}
                </p>
              </div>
              <Link
                href="/settings"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:border-white/20 hover:bg-white/10"
                aria-label="Open settings"
              >
                <Settings2 className="h-5 w-5" />
              </Link>
            </div>
          </header>

          <main className="flex-1 px-4 pb-28 pt-4 sm:px-6 xl:px-8 xl:pb-10">
            {children}
          </main>

          <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-slate-950/95 px-3 py-3 backdrop-blur xl:hidden">
            <div className="mx-auto grid max-w-3xl grid-cols-5 gap-2">
              {mobileNavItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={pathname === item.href}
                  compact
                />
              ))}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
