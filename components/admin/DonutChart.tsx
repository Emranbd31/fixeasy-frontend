"use client";
import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

type Slice = { service: string; value: number };

const COLORS = ["#06b6d4", "#34d399", "#f59e0b", "#fb7185"];

export default function DonutChart({ data, title, rightSlot }: { data?: Slice[]; title?: string; rightSlot?: React.ReactNode }) {
  const mock: Slice[] = [
    { service: "Plumbing", value: 40 },
    { service: "Cleaning", value: 25 },
    { service: "Electrical", value: 20 },
    { service: "Painting", value: 15 },
  ];

  const final = data && data.length ? data : mock;
  const total = final.reduce((s, p) => s + p.value, 0) || 1;

  const label = (props: any) => {
    const name = props?.name ?? "";
    const percent = typeof props?.percent === "number" ? props.percent : 0;
    return `${name} ${Math.round(percent * 100)}%`;
  };

  return (
    <div className="card card-hover">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-gray-200">{title ?? "Services"}</h3>
        <div>{rightSlot}</div>
      </div>
      <div className="p-4">
        <div className="w-full h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={final}
                dataKey="value"
                nameKey="service"
                innerRadius={72}
                outerRadius={96}
                paddingAngle={2}
                label={label}
                labelLine={false}
              >
                {final.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value} (${((value / total) * 100).toFixed(0)}%)`} />
              <Legend verticalAlign="bottom" height={24} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
