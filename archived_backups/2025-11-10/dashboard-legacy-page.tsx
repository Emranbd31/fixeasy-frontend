"use client";

import React, { useEffect, useState } from "react";
import Shell from "@/components/admin/Shell";
import KpiCard from "@/components/admin/KpiCard";
import TrendChart from "@/components/admin/TrendChart";
import DonutChart from "@/components/admin/DonutChart";
import SkeletonCard from "@/components/admin/SkeletonCard";
import DevClientLogger from "@/components/admin/devClientLogger";
import { fetchDashboardSummary } from "@/lib/analyticsService";

type Summary = {
    users?: number;
    professionals?: number;
    bookings?: number;
    payments?: number;
    totalRevenue?: number;
};

export default function DashboardPage() {
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                const payload = await fetchDashboardSummary().catch(() => null as any);
                if (!mounted) return;
                // Always use live data; do not fallback to demo values so the
                // dashboard reflects the real backend state.
                setSummary(payload ?? null);
            } catch (e) {
                setSummary(null);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => {
            mounted = false;
        };
    }, []);

    const formatCurrency = (v?: number) => {
        if (v == null) return "—";
        try {
            return new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(v);
        } catch (_) {
            return String(v);
        }
    };

    return (
        <Shell>
            <div className="pt-6 px-4 md:px-6">
                <DevClientLogger />

                {/* Banner when backend data is missing */}
                {!loading && !summary && (
                    <div className="mb-4 rounded-lg bg-yellow-50 border-l-4 border-yellow-400 p-4 text-yellow-800">
                        <strong className="font-semibold">No backend connection — data unavailable.</strong>
                        <span className="block text-sm mt-1">Check the backend server or your network. The dashboard will update automatically when data becomes available.</span>
                    </div>
                )}

                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-slate-900">Enterprise Dashboard</h2>
                    <p className="text-sm text-slate-600">Overview of key metrics and system health.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <KpiCard label="Users (total)" value={loading ? "…" : String(summary?.users ?? "—")} hint="All registered users" />
                    <KpiCard label="Professionals" value={loading ? "…" : String(summary?.professionals ?? "—")} hint="Total professionals" />
                    <KpiCard label="Bookings (30d)" value={loading ? "…" : String(summary?.bookings ?? "—")} hint="Last 30 days" />
                    <KpiCard label="Revenue (30d)" value={loading ? "…" : formatCurrency(summary?.totalRevenue)} hint="Revenue last 30 days" />
                </div>

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-4 rounded-lg shadow bg-white">
                        <h3 className="font-semibold mb-3">Bookings trend</h3>
                        {loading ? <SkeletonCard /> : <TrendChart data={[]} title="Bookings (7d)" />}
                    </div>

                    <div className="p-4 rounded-lg shadow bg-white">
                        <h3 className="font-semibold mb-3">Payments distribution</h3>
                        {loading ? <SkeletonCard /> : <DonutChart data={[{ service: "Paid", value: 70 }, { service: "Pending", value: 20 }, { service: "Failed", value: 10 }]} />}
                    </div>
                </div>
            </div>
        </Shell>
    );
}
