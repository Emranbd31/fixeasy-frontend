import type { Kpi } from "@/components/admin/v3/KpiRow";
import KpiRow from "@/components/admin/v3/KpiRow";
import V3Sidebar from "@/components/admin/v3/V3Sidebar";
import RevenueChart from "@/components/admin/v3/RevenueChart";
import ApprovalsTable, { type ApprovalRow } from "@/components/admin/v3/ApprovalsTable";
import ActivityTimeline, { type ActivityItem } from "@/components/admin/v3/ActivityTimeline";
import PerformancePanel, { type Metric } from "@/components/admin/v3/PerformancePanel";
import SystemMonitoring, { type Monitor } from "@/components/admin/v3/SystemMonitoring";

export type V3Summary = {
  kpis: Kpi[];
  approvals: ApprovalRow[];
  revenueTrend: Array<{ day: string; value: number }>;
  performance: Metric[];
  monitors: Monitor[];
  activity: ActivityItem[];
};

export default function V3Dashboard({
  summary,
  actions,
}: {
  summary: V3Summary;
  actions: { setProfessionalVerified: (formData: FormData) => Promise<void> };
}) {
  return (
    <main className="min-h-screen bg-[radial-gradient(1100px_circle_at_20%_-20%,rgba(34,211,238,0.18),transparent_60%),radial-gradient(900px_circle_at_120%_10%,rgba(167,139,250,0.15),transparent_55%),linear-gradient(to_bottom_right,#020617,#020617,#0b1220)] text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-6">
          <V3Sidebar />

          <div className="flex-1 min-w-0">
            <section id="dashboard" className="space-y-5">
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-400">Control Center</div>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">Live KPIs</h1>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Overview of marketplace health, bookings, and approvals.
                    </p>
                  </div>
                  <div className="hidden sm:block text-xs text-slate-400">
                    Refresh to update
                  </div>
                </div>
              </div>

              <KpiRow kpis={summary.kpis} />
            </section>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <ApprovalsTable rows={summary.approvals} action={actions.setProfessionalVerified} />
                <RevenueChart title="Revenue (estimated)" points={summary.revenueTrend} />
              </div>
              <div className="space-y-6">
                <PerformancePanel title="Performance" metrics={summary.performance} />
                <SystemMonitoring monitors={summary.monitors} />
                <ActivityTimeline items={summary.activity} />
              </div>
            </div>

            <div id="insights" className="mt-8 text-xs text-slate-500 leading-relaxed">
              Tip: set <span className="font-mono">ADMIN_DASHBOARD_VERSION=v2</span> to force the legacy dashboard.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
