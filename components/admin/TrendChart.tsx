"use client";
/* Copilot: Keep a single responsive line for bookings. */
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { Insight } from "@/lib/apiClient";

export default function TrendChart({ data }: { data: Insight[] }) {
  return (
    <div className="bg-[#0f1629] rounded-xl p-4 border border-white/5 h-56">
      <div className="text-white/90 font-medium mb-2">Bookings Trend</div>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
          <XAxis dataKey="date" hide />
          <YAxis hide />
          <Tooltip contentStyle={{ background: "#0f1629", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }} />
          <Line type="monotone" dataKey="bookings" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
"use client";
import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

type Point = { date: string; value: number };

export default function TrendChart({ data, title, rightSlot }: { data?: Point[]; title?: string; rightSlot?: React.ReactNode }) {
    const mock: Point[] = [
        { date: "2025-10-01", value: 12 },
        { date: "2025-10-02", value: 18 },
        { date: "2025-10-03", value: 10 },
        { date: "2025-10-04", value: 22 },
        { date: "2025-10-05", value: 16 },
        { date: "2025-10-06", value: 24 },
        { date: "2025-10-07", value: 20 },
    ];

    const final = data && data.length > 0 ? data : mock;

    return (
        <div className="card card-hover">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-gray-200">{title ?? "Trend"}</h3>
                <div>{rightSlot}</div>
            </div>
            <div className="p-4">
                <div className="w-full h-28">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={final} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" hide />
                            <YAxis hide />
                            <Tooltip wrapperStyle={{ fontSize: 12 }} />
                            <Area type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#areaFill)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
