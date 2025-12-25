export type Kpi = { label: string; value: string; delta?: string; hint?: string };

export default function KpiRow({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="group rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] hover:bg-white/[0.08] transition"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs uppercase tracking-wider text-slate-300">{kpi.label}</div>
            {kpi.delta ? (
              <span className="text-xs px-2 py-1 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                {kpi.delta}
              </span>
            ) : null}
          </div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">{kpi.value}</div>
          {kpi.hint ? (
            <div className="mt-1 text-xs text-slate-400 leading-relaxed">{kpi.hint}</div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
