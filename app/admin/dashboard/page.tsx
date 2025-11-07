"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { fetchDashboardSummary, type DashboardSummary } from "@/lib/analyticsService";

type SummaryKey = "users" | "professionals" | "bookings" | "payments";

const SUMMARY_CARDS: Array<{ title: string; key: SummaryKey; accent: string }> = [
  { title: "Total Users", key: "users", accent: "text-blue-600" },
  { title: "Active Professionals", key: "professionals", accent: "text-green-600" },
  { title: "Total Bookings", key: "bookings", accent: "text-purple-600" },
  { title: "Payments", key: "payments", accent: "text-emerald-600" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchDashboardSummary()
      .then((payload) => {
        if (!cancelled) {
          setStats(payload);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Unable to load dashboard summary");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-white p-8 dark:bg-slate-900">
      <nav className="mb-8 flex gap-4 border-b pb-4">
        <Link href="/admin/dashboard" className="font-bold text-blue-600">
          Dashboard
        </Link>
        <Link href="/admin/users" className="text-gray-600 hover:text-blue-600">
          Users
        </Link>
        <Link href="/admin/services" className="text-gray-600 hover:text-blue-600">
          Services
        </Link>
        <Link href="/admin/reports" className="text-gray-600 hover:text-blue-600">
          Reports
        </Link>
        <Link href="/admin/settings" className="text-gray-600 hover:text-blue-600">
          Settings
        </Link>
      </nav>

      <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {SUMMARY_CARDS.map(({ title, key, accent }) => (
          <div key={title} className="rounded-xl bg-white p-6 text-center shadow dark:bg-slate-800">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
              {title}
            </h2>
            <p className={`mt-2 text-3xl font-bold ${accent}`}>
              {stats ? stats[key].toLocaleString() : "--"}
            </p>
          </div>
        ))}
      </section>

      {error && <p className="mb-6 text-sm text-red-500">{error}</p>}

      <section className="flex min-h-[300px] flex-col items-center justify-center rounded-xl bg-white p-8 shadow dark:bg-slate-800">
        <div className="mb-2 text-xl font-bold text-gray-700 dark:text-gray-200">Charts &amp; Analytics</div>
        <div className="text-gray-400">[Charts/graphs placeholder]</div>
      </section>
    </main>
  );
}
