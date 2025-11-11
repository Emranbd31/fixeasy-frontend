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
    <div
      className={`${g[gradient]} text-white rounded-xl p-5 shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
      role="figure"
      aria-label={title}
    >
      <div className="text-sm/relaxed opacity-90">{title}</div>
      <div className="text-3xl font-semibold mt-1">{value}</div>
      {subtitle && <div className="text-xs opacity-80 mt-1">{subtitle}</div>}
    </div>
  );
}

