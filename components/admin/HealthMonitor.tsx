"use client";
import React, { useEffect, useState } from "react";

export default function HealthMonitor() {
  const [state, setState] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("/api/admin/health");
        const payload = await res.json().catch(() => ({}));
        if (!mounted) return;
        setState(payload);
      } catch (e) {
        if (!mounted) return;
        setState({ error: "Failed to fetch health" });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    const t = setInterval(load, 30_000);
    return () => {
      mounted = false;
      clearInterval(t);
    };
  }, []);

  if (loading) return <div className="rounded-lg border bg-white p-3">Checking health...</div>;

  return (
    <div className="rounded-lg border bg-white p-3">
      <h4 className="text-sm font-semibold">System Health</h4>
      <div className="mt-2 text-sm">
        <div>
          <strong>DB:</strong> {state?.checks?.db?.ok ? <span className="text-green-600">OK</span> : <span className="text-red-600">FAIL</span>}
        </div>
        <div>
          <strong>API:</strong> {state?.checks?.api?.ok ? <span className="text-green-600">OK</span> : <span className="text-red-600">FAIL</span>}
        </div>
        <div className="text-xs text-gray-500 mt-2">Last checked: {state?.ts ?? "-"}</div>
      </div>
    </div>
  );
}
