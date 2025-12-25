type Point = { day: string; value: number };

function formatMoney(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return rounded.toLocaleString(undefined, { style: "currency", currency: "EUR" });
}

export default function RevenueChart({
  title,
  points,
}: {
  title: string;
  points: Point[];
}) {
  const values = points.map((p) => p.value);
  const max = Math.max(1, ...values);
  const w = 520;
  const h = 160;
  const pad = 14;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;
  const step = values.length > 1 ? innerW / (values.length - 1) : innerW;

  const poly = values
    .map((v, i) => {
      const x = pad + i * step;
      const y = pad + innerH - (v / max) * innerH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const total = values.reduce((a, b) => a + b, 0);
  const last = values.length ? values[values.length - 1] : 0;

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="p-5 border-b border-white/10 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-xs text-slate-400">Last {points.length} days</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-slate-100">{formatMoney(total)}</div>
          <div className="text-xs text-slate-400">Today: {formatMoney(last)}</div>
        </div>
      </div>
      <div className="p-5">
        <div className="w-full overflow-x-auto">
          <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block">
            <defs>
              <linearGradient id="rev" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width={w} height={h} rx="14" fill="transparent" />
            <g opacity="0.25" stroke="#94a3b8" strokeWidth="1">
              <line x1={pad} y1={pad + innerH * 0.33} x2={pad + innerW} y2={pad + innerH * 0.33} />
              <line x1={pad} y1={pad + innerH * 0.66} x2={pad + innerW} y2={pad + innerH * 0.66} />
            </g>
            <polyline
              fill="none"
              stroke="#22d3ee"
              strokeWidth="3"
              points={poly}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <polygon
              fill="url(#rev)"
              points={`${poly} ${pad + innerW},${pad + innerH} ${pad},${pad + innerH}`}
            />
            {values.length ? (
              <circle
                cx={pad + innerW}
                cy={pad + innerH - (last / max) * innerH}
                r="4"
                fill="#a78bfa"
              />
            ) : null}
          </svg>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>{points[0]?.day ?? ""}</span>
          <span>{points[points.length - 1]?.day ?? ""}</span>
        </div>
      </div>
    </section>
  );
}
