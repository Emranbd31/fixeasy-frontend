import { createSupabaseServerServiceRoleClient } from "@/lib/supabaseClient";
import { setProfessionalVerified } from "./actions";
import V3Dashboard, { type V3Summary } from "./v3/V3Dashboard";
import type { ApprovalRow } from "@/components/admin/v3/ApprovalsTable";
import type { ActivityItem } from "@/components/admin/v3/ActivityTimeline";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ProfessionalRow = {
  id: string;
  user_id: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  verified?: boolean | null;
  status?: string | null;
  created_at?: string | null;
};

export default async function AdminDashboardPage() {
  const supabase = createSupabaseServerServiceRoleClient() as any;

  const { data: professionals, error } = await supabase
    .from("professionals")
    .select("id,user_id,name,email,phone,verified,status,created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const versionRaw = `${process.env.ADMIN_DASHBOARD_VERSION ?? process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_VERSION ?? ""}`
    .trim()
    .toLowerCase();
  // Default to V3 unless explicitly pinned to V2.
  const useV3 = versionRaw !== "v2";

  if (useV3) {
    const kpis: V3Summary["kpis"] = [];
    const addKpi = (label: string, value: string, hint?: string, delta?: string) =>
      kpis.push({ label, value, hint, delta });

    const now = new Date();
    const days = 14;
    const start = new Date(now);
    start.setDate(now.getDate() - (days - 1));

    const revenueByDay = new Map<string, number>();
    for (let i = days - 1; i >= 0; i -= 1) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      revenueByDay.set(d.toISOString().slice(0, 10), 0);
    }

    let totalProfessionals = 0;
    let totalBookings = 0;
    let totalUsers: number | null = null;
    let totalPayments: number | null = null;

    try {
      const { count } = await supabase.from("professionals").select("id", { count: "exact", head: true });
      totalProfessionals = Number(count || 0);
    } catch {}

    try {
      const { count } = await supabase.from("bookings").select("id", { count: "exact", head: true });
      totalBookings = Number(count || 0);
    } catch {}

    try {
      const { count } = await supabase.from("users").select("id", { count: "exact", head: true });
      totalUsers = Number(count || 0);
    } catch {}

    try {
      const { count } = await supabase.from("payments").select("id", { count: "exact", head: true });
      totalPayments = Number(count || 0);
    } catch {}

    const approvals: ApprovalRow[] = [];
    try {
      const { data } = await supabase
        .from("professionals")
        .select("id,user_id,name,email,service,status,verified,created_at")
        .or("verified.is.false,status.eq.pending,status.eq.awaiting_confirmation")
        .order("created_at", { ascending: false })
        .limit(50);
      for (const p of (data ?? []) as Array<any>) {
        approvals.push({
          id: String(p.id),
          user_id: p.user_id ? String(p.user_id) : null,
          name: String(p.name || p.email || p.id),
          email: String(p.email || ""),
          category: String(p.service || "").trim() || undefined,
          status: String(p.status || "").trim(),
          created_at: p.created_at ? String(p.created_at) : null,
          verified: Boolean(p.verified),
        });
      }
    } catch {}

    // Bookings last 14 days for revenue estimation and throughput.
    let recentBookings = 0;
    let completedBookings = 0;
    let pendingBookings = 0;
    try {
      const { data } = await supabase
        .from("bookings")
        .select("status,created_at,price_estimate")
        .gte("created_at", start.toISOString())
        .order("created_at", { ascending: true })
        .limit(1200);

      for (const row of (data ?? []) as Array<any>) {
        recentBookings += 1;
        const status = String(row.status || "").toLowerCase();
        if (status === "completed") completedBookings += 1;
        if (status === "pending" || status === "booking_requested" || status === "awaiting_confirmation") pendingBookings += 1;

        const created = typeof row.created_at === "string" ? row.created_at : null;
        const dayKey = created ? created.slice(0, 10) : null;
        const amount = typeof row.price_estimate === "number" ? row.price_estimate : Number(row.price_estimate || 0);
        if (dayKey && revenueByDay.has(dayKey) && Number.isFinite(amount) && amount > 0) {
          revenueByDay.set(dayKey, (revenueByDay.get(dayKey) || 0) + amount);
        }
      }
    } catch {}

    const revenueTrend = Array.from(revenueByDay.entries()).map(([day, value]) => ({ day, value }));

    addKpi("Professionals", totalProfessionals.toLocaleString(), `${approvals.length} pending approvals`, "+live");
    addKpi("Bookings", totalBookings.toLocaleString(), "All-time", `+${recentBookings} / 14d`);
    addKpi("Users", totalUsers === null ? "—" : totalUsers.toLocaleString(), "All-time");
    addKpi("Payments", totalPayments === null ? "—" : totalPayments.toLocaleString(), "All-time");

    const completionRate = recentBookings ? Math.round((completedBookings / recentBookings) * 100) : 0;
    const performance: V3Summary["performance"] = [
      { label: "Completion rate (14d)", value: `${completionRate}%`, tone: completionRate >= 60 ? "good" : "warn" },
      { label: "Pending bookings (14d)", value: pendingBookings.toLocaleString(), tone: pendingBookings <= 10 ? "good" : "warn" },
      { label: "Pending approvals", value: approvals.length.toLocaleString(), tone: approvals.length <= 10 ? "good" : "warn" },
      { label: "Deploy", value: "Vercel", tone: "neutral" },
    ];

    const monitors: V3Summary["monitors"] = [
      { label: "Backend", value: "api.fixeasy.irish", tone: "ok" },
      { label: "Supabase env", value: "configured", tone: "ok" },
      { label: "Stripe", value: process.env.STRIPE_SECRET_KEY ? "configured" : "not set", tone: process.env.STRIPE_SECRET_KEY ? "ok" : "warn" },
      { label: "Admin secret", value: process.env.ADMIN_SECRET ? "configured" : "missing", tone: process.env.ADMIN_SECRET ? "ok" : "bad" },
    ];

    const activity: ActivityItem[] = [];
    try {
      const { data } = await supabase
        .from("activity_logs")
        .select("id,timestamp,action,details,user_email")
        .order("timestamp", { ascending: false })
        .limit(8);
      for (const a of (data ?? []) as Array<any>) {
        activity.push({
          id: String(a.id),
          timestamp: a.timestamp ? String(a.timestamp) : null,
          action: String(a.action || "Activity"),
          details: a.details ? String(a.details) : null,
          user_email: a.user_email ? String(a.user_email) : null,
        });
      }
    } catch {}

    return (
      <V3Dashboard
        summary={{ kpis, approvals, revenueTrend, performance, monitors, activity }}
        actions={{ setProfessionalVerified }}
      />
    );
  }

  // V2 disabled for now; V3 is the default UI.
  return (
    <V3Dashboard
      summary={{
        kpis: [{ label: "Dashboard", value: "V3", hint: "Set ADMIN_DASHBOARD_VERSION=v2 to pin V2." }],
        approvals: [],
        revenueTrend: [],
        performance: [],
        monitors: [],
        activity: [],
      }}
      actions={{ setProfessionalVerified }}
    />
  );
}
