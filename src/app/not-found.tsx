import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 text-slate-100">
      <div className="max-w-lg rounded-[32px] border border-white/10 bg-white/5 p-8 text-center shadow-glow">
        <p className="text-xs uppercase tracking-[0.35em] text-teal-200/70">
          Trader AI
        </p>
        <h1 className="mt-4 text-3xl font-semibold">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          The route you tried does not exist in this prototype. Use the
          dashboard or bottom navigation to continue.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-2xl bg-teal-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-200"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
