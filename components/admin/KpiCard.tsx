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
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 lg:p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">{label}</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
        </div>
        <div className="ml-4">
          {/* placeholder for mini chart or icon */}
          <div className="w-12 h-8 bg-gradient-to-r from-blue-100 to-cyan-100 rounded" />
        </div>
      </div>
      {hint && <div className="mt-3 text-xs text-gray-500">{hint}</div>}
    </div>
  );
}
