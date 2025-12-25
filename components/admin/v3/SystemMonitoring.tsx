export type Monitor = { label: string; value: string; tone?: "ok" | "warn" | "bad" };

function cls(tone?: Monitor["tone"]) {
  if (tone === "ok") return "bg-emerald-500/15 text-emerald-300 border-emerald-500/20";
  if (tone === "bad") return "bg-red-500/15 text-red-200 border-red-500/20";
  return "bg-amber-500/15 text-amber-200 border-amber-500/20";
}

export default function SystemMonitoring({ monitors }: { monitors: Monitor[] }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.06] overflow-hidden">
      <div className="p-5 border-b border-white/10">
        <h3 className="font-semibold">System Monitoring</h3>
        <p className="text-xs text-slate-400">High-level signals.</p>
      </div>
      <div className="p-5 grid gap-3 sm:grid-cols-2">
        {monitors.map((m) => (
          <div key={m.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-wider text-slate-400">{m.label}</div>
            <div className={`mt-2 inline-flex px-2 py-1 rounded-md border text-xs ${cls(m.tone)}`}>
              {m.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
