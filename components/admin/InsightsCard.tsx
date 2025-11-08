"use client";
import React, { useEffect, useState } from "react";

type Insight = { title: string; body: string };

export default function InsightsCard() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("/api/admin/insights");
        if (!mounted) return;
        if (!res.ok) {
          setInsights([{ title: "Insights unavailable", body: "Could not fetch insights" }]);
          return;
        }
        const payload = await res.json().catch(() => ({}));
        setInsights(payload?.insights ?? []);
      } catch (e) {
        setInsights([{ title: "Error", body: "Failed to load insights" }]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h4 className="text-sm font-semibold">Insights</h4>
      {loading ? (
        <div className="mt-3 text-sm text-gray-500">Loading insights…</div>
      ) : insights.length === 0 ? (
        <div className="mt-3 text-sm text-gray-500">No insights available.</div>
      ) : (
        <ul className="mt-3 space-y-2">
          {insights.map((ins, i) => (
            <li key={i} className="text-sm">
              <strong className="block text-gray-800">{ins.title}</strong>
              <span className="text-gray-600">{ins.body}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
