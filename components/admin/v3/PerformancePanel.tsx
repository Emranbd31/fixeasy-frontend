export type Metric = { label: string; value: string; tone?: "good" | "warn" | "neutral" };

function toneClass(tone: Metric["tone"]) {
  if (tone === "good") return "bg-emerald-500/15 text-emerald-300 border-emerald-500/20";
  if (tone === "warn") return "bg-amber-500/15 text-amber-200 border-amber-500/20";
  return "bg-white/10 text-slate-200 border-white/10";
}

export default function PerformancePanel({
  title,
  metrics,
}: {
  title: string;
  metrics: Metric[];
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.06] overflow-hidden">
      <div className="p-5 border-b border-white/10">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-xs text-slate-400">Key operational metrics.</p>
      </div>
      <div className="p-5 space-y-3">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-center justify-between gap-3">
            <div className="text-sm text-slate-200">{m.label}</div>
            <span className={`px-2 py-1 rounded-md border text-xs ${toneClass(m.tone)}`}>{m.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
