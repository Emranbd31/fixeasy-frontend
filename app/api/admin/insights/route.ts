import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseClient";

export async function GET(req: Request) {
  try {
    const supabase = createSupabaseServerClient();
    const url = new URL(req.url);
    const daysParam = Number(url.searchParams.get("days") || "7") || 7;
    const days = Math.min(30, Math.max(7, daysParam));

    // Basic KPIs
    // Fetch rows and compute counts locally to avoid Postgrest count typing
    const [{ data: usersRows }, { data: professionalsRows }, { data: bookingsRows }, { data: paymentsRows }] = await Promise.all([
      supabase.from("users").select("id"),
      supabase.from("professionals").select("id,service,verified,created_at"),
      supabase.from("bookings").select("id,created_at"),
      supabase.from("payments").select("amount"),
    ]);

    // Top services (compute counts in JS)
    const serviceCounts: Record<string, number> = {};
    (professionalsRows ?? []).forEach((r: any) => {
      const s = r?.service ?? "unknown";
      serviceCounts[s] = (serviceCounts[s] || 0) + 1;
    });
    const top = Object.entries(serviceCounts)
      .map(([service, count]) => ({ service, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Trends: compute bookings/payments per day for `days` and previous period
    const now = new Date();
    const end = now.toISOString();
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const prevStart = new Date(Date.now() - 2 * days * 24 * 60 * 60 * 1000);

    const { data: bookingsRange } = await supabase.from("bookings").select("id,created_at").gte("created_at", prevStart.toISOString()).lte("created_at", end);
    const { data: paymentsRange } = await supabase.from("payments").select("amount,created_at").gte("created_at", prevStart.toISOString()).lte("created_at", end);

    // bucket by day
    function formatDate(d: Date) {
      return d.toISOString().slice(0, 10);
    }
    const daysArr: string[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const dt = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      daysArr.push(formatDate(dt));
    }

    const bookingsByDay: Record<string, number> = {};
    const paymentsByDay: Record<string, number> = {};
    (bookingsRange ?? []).forEach((b: any) => {
      const d = b?.created_at ? formatDate(new Date(b.created_at)) : null;
      if (!d) return;
      bookingsByDay[d] = (bookingsByDay[d] || 0) + 1;
    });
    (paymentsRange ?? []).forEach((p: any) => {
      const d = p?.created_at ? formatDate(new Date(p.created_at)) : null;
      if (!d) return;
      paymentsByDay[d] = (paymentsByDay[d] || 0) + Number(p.amount || 0);
    });

    const bookingTrend = daysArr.map((date) => ({ date, value: bookingsByDay[date] ?? 0 }));
    const paymentTrend = daysArr.map((date) => ({ date, value: paymentsByDay[date] ?? 0 }));

    const lastPeriodTotalBookings = bookingTrend.reduce((s, x) => s + x.value, 0);
    const prevPeriodTotalBookings = (Object.keys(bookingsByDay).reduce((s, k) => s + (bookingsByDay[k] || 0), 0) - lastPeriodTotalBookings) || 0;

    const lastPeriodTotalPayments = paymentTrend.reduce((s, x) => s + x.value, 0);
    const prevPeriodTotalPayments = (Object.keys(paymentsByDay).reduce((s, k) => s + (paymentsByDay[k] || 0), 0) - lastPeriodTotalPayments) || 0;

    const bookingTrendPct = prevPeriodTotalBookings > 0 ? ((lastPeriodTotalBookings - prevPeriodTotalBookings) / prevPeriodTotalBookings) * 100 : 0;
    const paymentTrendPct = prevPeriodTotalPayments > 0 ? ((lastPeriodTotalPayments - prevPeriodTotalPayments) / prevPeriodTotalPayments) * 100 : 0;

    const insights: Array<{ title: string; body: string }> = [];
    insights.push({ title: `Bookings (${days}d)`, body: `${lastPeriodTotalBookings} bookings in the last ${days} days` });
    if (Math.abs(bookingTrendPct) > 20) {
      insights.push({ title: bookingTrendPct > 0 ? "Spike detected" : "Drop detected", body: `${Math.round(Math.abs(bookingTrendPct))}% change vs previous ${days} days` });
    }

    // Top services summary
    const paymentsTotal = (paymentsRows ?? []).reduce((s: number, row: any) => s + (Number(row?.amount) || 0), 0);

    const serviceSummary = top.slice(0, 5);

    return NextResponse.json({
      kpis: {
        users: Array.isArray(usersRows) ? usersRows.length : 0,
        professionals: Array.isArray(professionalsRows) ? professionalsRows.length : 0,
        bookings: Array.isArray(bookingsRows) ? bookingsRows.length : 0,
        payments: paymentsTotal,
      },
      insights,
      serviceSummary,
      bookingTrend,
      paymentTrend,
      bookingTrendPct,
      paymentTrendPct,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "unknown" }, { status: 500 });
  }
}
