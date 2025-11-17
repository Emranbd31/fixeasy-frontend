import KpiCard from "@/components/admin/KpiCard";
import { formatCurrency, formatCompactNumber } from "@/lib/utils";
import { getAdminAuthHeader } from "@/lib/adminAuth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic"; // always fresh

export default async function AdminDashboardPage() {
  // Call the internal Next.js API route which proxies to the backend.
  // Do NOT call backend URLs directly from the browser; token is in the cookie.
  let res: Response;
  try {
    // Include server-side Authorization header built from the HttpOnly cookie
    const rawHeaders = headers();
    const headerStore =
      typeof (rawHeaders as any)?.then === "function"
        ? await rawHeaders
        : rawHeaders;
    const headerGetter =
      typeof (headerStore as any)?.get === "function"
        ? (headerStore as any).get.bind(headerStore)
        : undefined;
    const scheme =
      (headerGetter && headerGetter("x-forwarded-proto")) ||
      (process.env.NODE_ENV === "production" ? "https" : "http");
    const host =
      (headerGetter && headerGetter("x-forwarded-host")) ||
      (headerGetter && headerGetter("host")) ||
      "localhost:3000";
    const baseUrl = `${scheme}://${host}`;

    res = await fetch(`${baseUrl}/api/admin/summary`, {
      headers: getAdminAuthHeader(),
      cache: "no-store",
    });
  } catch (err) {
    console.error("Admin summary fetch failed:", err);
    return (
      <div className="rounded-lg border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-200">
        Failed to load admin summary. Please refresh the page.
      </div>
    );
  }

  // If backend returned non-OK, surface the error message returned by the API.
  if (!res.ok) {
    if (res.status === 401) {
      redirect("/admin/login?from=dashboard");
    }
    let payload: any = { error: `Status ${res.status}` };
    try {
      payload = await res.json();
    } catch (e) {
      try {
        payload = { error: await res.text() };
      } catch (_) {
        /* ignore */
      }
    }

    const message = payload?.error || payload?.message || payload?.details || JSON.stringify(payload);
    return (
      <div className="rounded-lg border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-200">
        Error loading summary: {message}
      </div>
    );
  }

  const summary = await res.json();

  // Accept either new shape { users, professionals, bookings, payments, trend, serviceMix }
  // or legacy backend shape { totalUsers, totalProfessionals, totalBookings, totalRevenue }
  const users = (summary as any).users ?? (summary as any).totalUsers ?? 0;
  const professionals = (summary as any).professionals ?? (summary as any).totalProfessionals ?? 0;
  const bookings = (summary as any).bookings ?? (summary as any).totalBookings ?? 0;
  const payments = (summary as any).payments ?? (summary as any).totalRevenue ?? 0;
  const trend = (summary as any).trend ?? null;
  const serviceMix = (summary as any).serviceMix ?? null;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Users" value={Number(users ?? 0)} variant="purple" helper="Registered users" />
        <KpiCard label="Professionals" value={Number(professionals ?? 0)} variant="emerald" helper="Service providers" />
        <KpiCard label="Bookings" value={Number(bookings ?? 0)} variant="blue" helper="Total booked jobs" />
        <KpiCard label="Revenue (€)" value={formatCurrency(Number(payments ?? 0))} variant="pink" helper={formatCompactNumber(Number(payments ?? 0))} />
      </div>

      {/* Placeholder for charts / tables */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
        Charts, trends, and tables will go here in V2. For now, summary KPIs are live from <code>/api/admin/summary</code>.
      </div>
    </div>
  );
}
