"use client";
import React, { useEffect, useState } from "react";
import KpiCard from "@/components/admin/KpiCard";
import TrendChart from "@/components/admin/TrendChart";
import DonutChart from "@/components/admin/DonutChart";
import ErrorBoundary from "@/components/admin/ErrorBoundary";
import SkeletonCard from "@/components/admin/SkeletonCard";
import InsightsCard from "@/components/admin/InsightsCard";
import HealthMonitor from "@/components/admin/HealthMonitor";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";
import { flags } from "@/lib/featureFlags";
import { fetchWithAuth } from "@/utils/apiClient";

type Summary = {
  users?: number;
  professionals?: number;
  bookings?: number;
  payments?: number;
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [serviceSummary, setServiceSummary] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const resp = await fetchWithAuth("/admin/summary", { method: "GET" });
        if (!mounted) return;
        if (!resp.ok) {
          // fallback to mock
          setSummary({ users: 1240, professionals: 312, bookings: 410, payments: 27830 });
        } else {
          const payload = await resp.json().catch(() => ({}));
          setSummary({
            users: payload?.users ?? 1240,
            professionals: payload?.professionals ?? 312,
            bookings: payload?.bookings ?? 410,
            payments: payload?.payments ?? 27830,
          });
          // try fetch insights for trend data
          try {
            const ins = await fetch("/api/admin/insights?days=7").then((r) => r.json()).catch(() => null);
            if (ins) {
              setTrendData(ins?.bookingTrend ?? []);
              setServiceSummary(ins?.serviceSummary ?? []);
            }
          } catch (e) {
            // ignore
          }
        }
      } catch (e) {
        setSummary({ users: 1240, professionals: 312, bookings: 410, payments: 27830 });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    // realtime subscription to update KPIs
    try {
      const supabase = createSupabaseBrowserClient();
      const proSub = supabase.channel("public:professionals").on("postgres_changes", { event: "*", schema: "public", table: "professionals" }, () => {
        // refetch summary
        load();
      }).subscribe();

      const bookingsSub = supabase.channel("public:bookings").on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => {
        load();
      }).subscribe();

      // cleanup
      return () => {
        mounted = false;
        try { proSub.unsubscribe(); } catch (_) {}
        try { bookingsSub.unsubscribe(); } catch (_) {}
      };
    } catch (e) {
      // ignore realtime subscription failures
    }
    return () => {
      mounted = false;
    };
  }, []);

  if (!flags.enterpriseUI) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Admin Dashboard (legacy)</h2>
        <p className="mt-2 text-sm text-gray-600">Enterprise UI is disabled. Enable NEXT_PUBLIC_FEATURE_ENTERPRISE_UI to preview.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-sm text-gray-600">Overview of key metrics and system health.</p>
      </div>

      <ErrorBoundary
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <KpiCard label="Total Users" value={loading ? "…" : summary?.users ?? "—"} hint="All registered users" />
          <KpiCard label="Professionals" value={loading ? "…" : summary?.professionals ?? "—"} hint="Verified + pending" />
          <KpiCard label="Bookings (30d)" value={loading ? "…" : summary?.bookings ?? "—"} hint="Bookings in the last 30 days" />
          <KpiCard label="Payments (€)" value={loading ? "…" : summary?.payments ?? "—"} hint="Volume in the last 30 days" />
        </div>
      </ErrorBoundary>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <ErrorBoundary
          fallback={
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          }
        >
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700">Bookings Trend (7d)</h3>
              <TrendChart data={trendData} />
            </div>
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700">Service Mix</h3>
              <div className="mt-3">
                {/* Donut chart showing service mix */}
                <DonutChart data={(serviceSummary ?? []).map((s: any) => ({ service: s.service, value: s.count }))} />
              </div>
            </div>
          </div>
        </ErrorBoundary>

        {/* Insights & Health column */}
        <div className="col-span-1 md:col-span-1 space-y-4">
          <InsightsCard />
          <HealthMonitor />
        </div>
      </div>
    </div>
  );
}
