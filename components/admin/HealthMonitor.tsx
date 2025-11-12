"use client";
import React, { useEffect, useState } from "react";

type Status = "ok" | "down" | "unknown";

export default function HealthMonitor() {
  const [backend, setBackend] = useState<Status>("unknown");
  const [supabase, setSupabase] = useState<Status>("unknown");
  const [ts, setTs] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchHealth() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/health", { cache: "no-store" });
      if (!res.ok) throw new Error("health fetch failed");
      const j = await res.json();
      setBackend(j?.checks?.api === "UP" ? "ok" : "down");
      setSupabase(j?.checks?.db === "UP" ? "ok" : "down");
      setTs(j?.ts ? Date.parse(j.ts) : Date.now());
    } catch (e) {
      setBackend("down");
      setSupabase("down");
      setTs(Date.now());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHealth();
    const id = setInterval(fetchHealth, 60_000);
    return () => clearInterval(id);
  }, []);

  const badge = (s: Status) =>
    s === "ok" ? (
      <span className="inline-flex items-center px-2 py-1 rounded bg-emerald-600 text-white text-xs">OK</span>
    ) : s === "down" ? (
      <span className="inline-flex items-center px-2 py-1 rounded bg-rose-600 text-white text-xs">DOWN</span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded bg-gray-500 text-white text-xs">…</span>
    );

  return (
    <div className="bg-[#071029] rounded-xl p-4 border border-white/5">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-white/90">System Health</div>
        <button className="text-xs text-white/60" onClick={fetchHealth} disabled={loading}>
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="text-xs text-white/70">Backend</div>
          {badge(backend)}
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-xs text-white/70">Supabase</div>
          {badge(supabase)}
        </div>
        <div className="ml-auto text-xs text-white/50">{ts ? new Date(ts).toLocaleTimeString() : "—"}</div>
      </div>
    </div>
  );
}

