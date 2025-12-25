import type { ReactNode } from "react";

export function Card({
  title,
  subtitle,
  right,
  children,
  id,
}: {
  id?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur supports-[backdrop-filter]:bg-white/[0.05] shadow-[0_0_0_1px_rgba(255,255,255,0.03)] overflow-hidden"
    >
      {(title || subtitle || right) && (
        <header className="px-5 py-4 border-b border-white/10 flex items-start justify-between gap-4">
          <div className="min-w-0">
            {title ? <h3 className="font-semibold text-slate-100">{title}</h3> : null}
            {subtitle ? (
              <p className="mt-0.5 text-xs text-slate-400 leading-relaxed">{subtitle}</p>
            ) : null}
          </div>
          {right ? <div className="shrink-0">{right}</div> : null}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "ok" | "warn" | "bad" | "info";
}) {
  const cls =
    tone === "ok"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/20"
      : tone === "warn"
        ? "bg-amber-500/15 text-amber-200 border-amber-500/20"
        : tone === "bad"
          ? "bg-red-500/15 text-red-200 border-red-500/20"
          : tone === "info"
            ? "bg-cyan-500/15 text-cyan-200 border-cyan-500/20"
            : "bg-white/10 text-slate-200 border-white/10";
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md border text-xs ${cls}`}>
      {children}
    </span>
  );
}

