"use client";
import React from "react";

export type Filters = {
  from?: string;
  to?: string;
  days?: number;
  service?: string | null;
  status?: "all" | "active" | "pending";
};

export default function FilterBar({
  services = [],
  onChange,
  initialDays = 7,
}: {
  services?: string[];
  onChange: (f: Filters) => void;
  initialDays?: number;
}) {
  const [days, setDays] = React.useState<number>(initialDays);
  const [service, setService] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<"all" | "active" | "pending">("all");

  React.useEffect(() => {
    const to = new Date();
    const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    onChange({ days, from: from.toISOString(), to: to.toISOString(), service: service ?? undefined, status });
  }, [days, service, status, onChange]);

  return (
    <div className="flex items-center gap-3 mb-4">
      <div>
        <label className="block text-xs text-gray-600">Range</label>
        <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="mt-1 rounded-md border px-2 py-1 text-sm">
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      <div>
        <label className="block text-xs text-gray-600">Service</label>
        <select value={service ?? ""} onChange={(e) => setService(e.target.value || null)} className="mt-1 rounded-md border px-2 py-1 text-sm">
          <option value="">All services</option>
          {services.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-gray-600">Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="mt-1 rounded-md border px-2 py-1 text-sm">
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
        </select>
      </div>
    </div>
  );
}
