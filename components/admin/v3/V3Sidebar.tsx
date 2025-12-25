import Link from "next/link";

const items = [
  { href: "#dashboard", label: "Dashboard", icon: "home" },
  { href: "#approvals", label: "Approvals", icon: "check" },
  { href: "#activity", label: "Activity", icon: "pulse" },
  { href: "#insights", label: "Insights", icon: "spark" },
];

function Icon({ name }: { name: string }) {
  const common = "h-4 w-4 text-slate-300";
  switch (name) {
    case "home":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M3 10.5 12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5H15v-6h-6v6H4.5A1.5 1.5 0 0 1 3 19.5v-9Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "check":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M20 6 9 17l-5-5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "pulse":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M3 12h4l2-6 4 12 2-6h6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "spark":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 2l1.2 6.2L20 10l-6.8 1.8L12 18l-1.2-6.2L4 10l6.8-1.8L12 2Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

export default function V3Sidebar() {
  return (
    <aside className="w-full lg:w-80 shrink-0">
      <div className="lg:sticky lg:top-6 rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur supports-[backdrop-filter]:bg-white/[0.05] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-wider text-slate-400">FixEasy</div>
            <div className="text-lg font-semibold leading-tight">Admin Control Center</div>
            <div className="text-xs text-slate-400 mt-1">V3 Dashboard</div>
          </div>
          <Link
            href="/"
            className="shrink-0 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 transition text-sm"
          >
            Main site
          </Link>
        </div>

        <nav className="space-y-2">
          {items.map((it) => (
            <a
              key={it.href}
              href={it.href}
              className="group flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-white/0 hover:bg-white/10 border border-white/0 hover:border-white/10 transition"
            >
              <span className="flex items-center gap-2 min-w-0">
                <Icon name={it.icon} />
                <span className="text-sm font-medium text-slate-100 truncate">{it.label}</span>
              </span>
              <span className="text-xs text-slate-400 group-hover:text-slate-300 transition">↵</span>
            </a>
          ))}
        </nav>

        <div className="mt-5 p-4 rounded-xl border border-white/10 bg-white/5">
          <div className="text-xs uppercase tracking-wider text-slate-400">Quick tips</div>
          <div className="mt-2 text-sm text-slate-200 leading-relaxed">
            Use the Approvals panel to verify professionals. Refresh to update metrics.
          </div>
          <div className="mt-3 text-xs text-slate-400">
            Set <span className="font-mono">ADMIN_DASHBOARD_VERSION=v2</span> to pin legacy UI.
          </div>
        </div>
      </div>
    </aside>
  );
}
