import type { ReactNode } from "react";
import { Card, Pill } from "@/components/admin/v3/ui";

export type ApprovalRow = {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  category?: string;
  status: string;
  created_at: string | null;
  verified: boolean;
};

function formatDate(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function badge(text: string, tone: "green" | "amber" | "slate"): ReactNode {
  const t = tone === "green" ? "ok" : tone === "amber" ? "warn" : "neutral";
  return <Pill tone={t as any}>{text}</Pill>;
}

export default function ApprovalsTable({
  rows,
  action,
}: {
  rows: ApprovalRow[];
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <Card
      id="approvals"
      title="Pending approvals"
      subtitle="Approve professionals and keep the marketplace healthy."
      right={<span className="text-xs text-slate-400">{rows.length} shown</span>}
    >
      <div className="-m-5">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white/[0.04] text-slate-300 sticky top-0">
              <tr>
                <th className="text-left font-semibold px-4 py-3">Name</th>
                <th className="text-left font-semibold px-4 py-3">Contact</th>
                <th className="text-left font-semibold px-4 py-3">Category</th>
                <th className="text-left font-semibold px-4 py-3">Created</th>
                <th className="text-left font-semibold px-4 py-3">Status</th>
                <th className="text-right font-semibold px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {rows.map((r, idx) => {
                const canToggle = Boolean(r.user_id);
                const statusTone =
                  r.status === "approved" ? "green" : r.status === "pending" ? "amber" : "slate";
                return (
                  <tr
                    key={r.id}
                    className={
                      idx % 2 === 0 ? "bg-white/[0.02] hover:bg-white/[0.06] transition" : "hover:bg-white/[0.06] transition"
                    }
                  >
                    <td className="px-4 py-3 text-slate-100 font-medium">{r.name}</td>
                    <td className="px-4 py-3 text-slate-200">{r.email || "—"}</td>
                    <td className="px-4 py-3 text-slate-200">{r.category || "—"}</td>
                    <td className="px-4 py-3 text-slate-400">{formatDate(r.created_at)}</td>
                    <td className="px-4 py-3">{badge(r.status || "—", statusTone as any)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <form action={action}>
                          <input type="hidden" name="user_id" value={r.user_id ?? ""} />
                          <input
                            type="hidden"
                            name="verified"
                            value={r.verified ? "false" : "true"}
                          />
                          <button
                            type="submit"
                            disabled={!canToggle}
                            className={
                              canToggle
                                ? r.verified
                                  ? "px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 transition text-slate-100"
                                  : "px-3 py-1.5 rounded-lg bg-emerald-400/90 hover:bg-emerald-400 text-slate-950 font-semibold transition"
                                : "px-3 py-1.5 rounded-lg bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed"
                            }
                          >
                            {r.verified ? "Unverify" : "Approve"}
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!rows.length ? (
                <tr>
                  <td className="px-4 py-10 text-center text-slate-400" colSpan={6}>
                    No pending approvals.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}
