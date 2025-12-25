export type ActivityItem = {
  id: string;
  timestamp: string | null;
  action: string;
  details?: string | null;
  user_email?: string | null;
};

function formatWhen(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return d.toLocaleString(undefined, { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export default function ActivityTimeline({ items }: { items: ActivityItem[] }) {
  return (
    <section id="activity" className="rounded-2xl border border-white/10 bg-white/[0.06] overflow-hidden">
      <div className="p-5 border-b border-white/10">
        <h3 className="font-semibold">Activity</h3>
        <p className="text-xs text-slate-400">Latest events and changes.</p>
      </div>
      <div className="p-5 space-y-3">
        {items.map((it) => (
          <div
            key={it.id}
            className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
          >
            <div className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-400/90 shadow-[0_0_0_4px_rgba(34,211,238,0.10)]" />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium text-slate-100">{it.action || "Activity"}</div>
                <div className="text-xs text-slate-400">{formatWhen(it.timestamp)}</div>
              </div>
              <div className="text-xs text-slate-400">
                {(it.user_email || "").trim() ? it.user_email : "—"}
              </div>
              {it.details ? <div className="mt-1 text-sm text-slate-200">{it.details}</div> : null}
            </div>
          </div>
        ))}
        {!items.length ? <div className="text-sm text-slate-400">No activity found.</div> : null}
      </div>
    </section>
  );
}
