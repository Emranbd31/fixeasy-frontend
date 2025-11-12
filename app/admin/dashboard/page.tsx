/*
  Copilot: Keep this a server component that fetches data, then passes to client widgets.
  Layout target: 4 KPI cards on top, approvals wide-left, users/payments cards right, trend + donut below.
*/
import { cookies } from "next/headers";
import dynamicImport from "next/dynamic";
import { getAdminSummary, getApprovals, getUsers, getPayments, getInsights, getPendingProfessionals } from "@/lib/apiClient";

const AdminDashboardLive = dynamicImport(() => import("@/components/admin/AdminDashboardLive"), { ssr: false });

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const token = cookies().get("admin_token")?.value;

  // Fetch everything in parallel; fall back softly if something fails
  const [summary, approvalsRaw, users, payments, insights] = await Promise.all([
    getAdminSummary(token).catch(() => ({ totalUsers: 0, totalProfessionals: 0, last30dBookings: 0, revenueEUR: 0 })),
    // Prefer pending professionals endpoint when available; fall back to legacy approvals
    getPendingProfessionals(token).catch(() => getApprovals(token).catch(() => [])),
        getUsers(token).catch(() => []),
        getPayments(token).catch(() => []),
        getInsights(30, token).catch(() => []),
    ]);
  // Normalize approvals shape so client table receives { id, name, email, service, status }
  const approvals = (approvalsRaw || []).map((r: any) => ({
    id: r.id ?? r._id ?? String(r?.id ?? Math.random()),
    name: r.name ?? r.full_name ?? r.username ?? "(unknown)",
    email: r.email ?? r.contact_email ?? null,
    service: r.service ?? r.skill ?? null,
    status: (r.status ?? (r.verified ? "verified" : "pending")) as "pending" | "verified",
  }));

  const serviceMix = [
        { service: "Cleaning", value: 25 },
        { service: "Electrical", value: 45 },
        { service: "Plumbing", value: 30 },
  ];

  return (
    // Render a client-side live dashboard that will poll every 30s
    <AdminDashboardLive
      initialSummary={summary}
      initialApprovals={approvals}
      initialUsers={users}
      initialPayments={payments}
      initialInsights={insights}
    />
  );
}
