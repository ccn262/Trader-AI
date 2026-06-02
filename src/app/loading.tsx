export default function Loading() {
  return (
    <main className="min-h-screen px-4 py-6 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="h-8 w-40 animate-pulse rounded-full bg-white/10" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-[32px] border border-white/10 bg-white/5"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
