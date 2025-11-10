/*
  Copilot: Do not change the props. We need gradient background and compact layout.
*/

import React from "react";

type Props = {
  title: string;
  value: string | number;
  subtitle?: string;
  gradient?: "blue" | "purple" | "pink" | "teal";
};

const g = {
  blue: "bg-gradient-to-r from-blue-600 to-indigo-600",
  purple: "bg-gradient-to-r from-purple-600 to-fuchsia-600",
  pink: "bg-gradient-to-r from-pink-600 to-rose-600",
  teal: "bg-gradient-to-r from-teal-600 to-emerald-600",
};

export default function KpiCard({ title, value, subtitle, gradient = "blue" }: Props) {
  return (
    <div className={`${g[gradient]} text-white rounded-xl p-5 shadow-lg`}>
      <div className="text-sm/relaxed opacity-90">{title}</div>
      <div className="text-3xl font-semibold mt-1">{value}</div>
      {subtitle && <div className="text-xs opacity-80 mt-1">{subtitle}</div>}
    </div>
  );
}
"use client";
import React from "react";

type Props = {
    label: string;
    value: string | number;
    hint?: string;
    Icon?: React.ComponentType<{ className?: string }>;
};

export default function KpiCard({ label, value, hint, Icon }: Props) {
    return (
        <div className="card card-hover">
            <div className="flex items-center justify-between rounded-t-2xl p-3 bg-gradient-to-r from-sky-500 to-indigo-500 text-white">
                <span className="text-sm font-medium">{label}</span>
                {Icon && <Icon className="h-5 w-5 opacity-90" />}
            </div>
            <div className="p-5">
                <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
                {hint && <div className="mt-1 text-xs text-gray-500">{hint}</div>}
            </div>
        </div>
    );
}
