"use client";
import React from "react";

export default function KpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  const icon = label.includes("Users") ? "👥" : label.includes("Professionals") ? "🧑‍🔧" : label.includes("Bookings") ? "📅" : label.includes("Payments") ? "💳" : "📊";
  const gradient = label.includes("Users")
    ? "from-indigo-100 to-indigo-50"
    : label.includes("Professionals")
    ? "from-green-100 to-emerald-50"
    : label.includes("Bookings")
    ? "from-yellow-100 to-amber-50"
    : label.includes("Payments")
    ? "from-pink-100 to-rose-50"
    : "from-slate-100 to-slate-50";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 lg:p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">{label}</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
        </div>
        <div className="ml-4 flex items-center">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r ${gradient}`}>
            <span className="text-xl">{icon}</span>
          </div>
        </div>
      </div>
      {hint && <div className="mt-3 text-xs text-gray-500">{hint}</div>}
    </div>
  );
}
