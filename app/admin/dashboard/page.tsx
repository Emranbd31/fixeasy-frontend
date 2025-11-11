/*
  Copilot: Keep this a server component that fetches data, then passes to client widgets.
  Layout target: 4 KPI cards on top, approvals wide-left, users/payments cards right, trend + donut below.
*/
import { cookies } from "next/headers";
import dynamicImport from "next/dynamic";
import { getAdminSummary, getApprovals, getUsers, getPayments, getInsights } from "@/lib/apiClient";

const AdminDashboardLive = dynamicImport(() => import("@/components/admin/AdminDashboardLive"), { ssr: false });

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const token = cookies().get("admin_token")?.value;

  // Fetch everything in parallel; fall back softly if something fails
    const [summary, approvals, users, payments, insights] = await Promise.all([
        getAdminSummary(token).catch(() => ({ totalUsers: 0, totalProfessionals: 0, last30dBookings: 0, revenueEUR: 0 })),
        getApprovals(token).catch(() => []),
        getUsers(token).catch(() => []),
        getPayments(token).catch(() => []),
        getInsights(30, token).catch(() => []),
    ]);

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
