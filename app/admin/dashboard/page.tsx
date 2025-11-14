import { fetchAdminSummary } from "@/lib/apiClient";
import KpiCard from "@/components/admin/KpiCard";
import { formatCurrency, formatCompactNumber } from "@/lib/utils";

export const dynamic = "force-dynamic"; // always fresh
// or: export const revalidate = 0;

export default async function AdminDashboardPage() {
  let summary;
  try {
    summary = await fetchAdminSummary();
  } catch (error) {
    console.error("Failed to load admin summary:", error);
    // You can render a nicer error UI here
    return (
      <div className="rounded-lg border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-200">
        Failed to load admin summary. Please refresh the page.
      </div>
    );
  }

  const {
    totalUsers,
    totalProfessionals,
    totalBookings,
    totalRevenue,
  } = summary;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Users" value={Number(totalUsers ?? 0)} variant="purple" helper="Registered users" />
        <KpiCard label="Professionals" value={Number(totalProfessionals ?? 0)} variant="emerald" helper="Service providers" />
        <KpiCard label="Bookings" value={Number(totalBookings ?? 0)} variant="blue" helper="Total booked jobs" />
        <KpiCard label="Revenue (€)" value={formatCurrency(Number(totalRevenue ?? 0))} variant="pink" helper={formatCompactNumber(Number(totalRevenue ?? 0))} />
      </div>

      {/* Placeholder for charts / tables */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
        Charts, trends, and tables will go here in V2. For now, summary KPIs are live from <code>/api/admin/summary</code>.
      </div>
    </div>
  );
}
