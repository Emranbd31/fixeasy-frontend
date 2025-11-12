"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import FilterBar, { Filters } from "@/components/admin/FilterBar";

type Pro = {
  id: string;
  name?: string;
  service?: string;
  verified?: boolean;
  created_at?: string;
  email?: string;
  experience?: string | number;
};

function Toast({ message, onClose }: { message: string | null; onClose: () => void }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [message, onClose]);
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow">{message}</div>
  );
}

export default function AdminProfessionalsPage() {
  const [pros, setPros] = useState<Pro[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [selected, setSelected] = useState<Pro | null>(null);
  const [services, setServices] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters | null>(null);

  const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("adminToken") : null);

  async function fetchList() {
    setLoading(true);
    try {
      const token = getToken();
      const hdrs: Record<string, string> = {};
      if (token) hdrs["Authorization"] = `Bearer ${token}`;
      // build url with filters
      const params = new URLSearchParams();
      if (filters?.from) params.set("from", filters.from);
      if (filters?.to) params.set("to", filters.to);
      if (filters?.service) params.set("service", filters.service);
      if (filters?.status) params.set("status", filters.status);
      const q = params.toString();
      const url = "/api/admin/professionals" + (q ? `?${q}` : "");
      const res = await fetch(url, { headers: hdrs });
      if (!res.ok) {
        throw new Error("Failed to load professionals");
      }
      const data = await res.json();
      // The backend returns an object with a `rows` array when proxied
      // through the admin API; ensure we parse that shape safely.
      setPros(Array.isArray(data?.rows) ? data.rows : []);
    } catch (e) {
      console.error(e);
      setPros([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  useEffect(() => {
    // fetch available services from insights
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/insights");
        if (!res.ok) return;
        const payload = await res.json();
        if (!mounted) return;
        const s = (payload?.serviceSummary ?? []).map((r: any) => r.service).filter(Boolean);
        setServices(Array.from(new Set(s)));
      } catch (e) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    // refetch when filters change
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  async function patchAction(id: string, action: "verify" | "reject") {
    const prev = pros.slice();
    const optimistic = pros.map((p) => (p.id === id ? { ...p, verified: action === "verify" } : p));
    setPros(optimistic);

    try {
      const token = getToken();
      const hdrs: Record<string, string> = {};
      if (token) hdrs["Authorization"] = `Bearer ${token}`;
      const url = `/api/admin/professionals/${encodeURIComponent(id)}/${action}`;
      const res = await fetch(url, { method: "PATCH", headers: hdrs });
      if (!res.ok) {
        throw new Error(`Action failed: ${res.status}`);
      }
      setToast(action === "verify" ? "Professional approved!" : "Professional rejected");
    } catch (e) {
      console.error(e);
      setPros(prev);
      setToast("Server error — action reverted");
    }
  }

  async function openDetails(id: string) {
    // View details from Supabase via backend proxying, reuse /api/admin/professionals list if available
    const p = pros.find((x) => x.id === id);
    if (!p) return;
    // Try to fetch more details from Supabase REST via backend route
    try {
      const token = getToken();
      const hdrs: Record<string, string> = {};
      if (token) hdrs["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`/api/admin/professionals/${encodeURIComponent(id)}/details`, { headers: hdrs });
      if (res.ok) {
        const extra = await res.json();
        setSelected({ ...p, ...(extra || {}) });
        return;
      }
    } catch (e) {
      // ignore and show available info
    }
    setSelected(p);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Professionals</h1>
          <Link href="/admin-dashboard" className="text-blue-600">Back to Dashboard</Link>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <FilterBar services={services} onChange={(f) => setFilters(f)} initialDays={7} />
          {loading ? (
            <div>Loading…</div>
          ) : (
            <table className="min-w-full border border-gray-200 rounded text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Service</th>
                  <th className="px-4 py-2 text-left">Join Date</th>
                  <th className="px-4 py-2 text-left">Verified</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pros.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="border-t px-4 py-2">{p.name}</td>
                    <td className="border-t px-4 py-2">{p.service}</td>
                    <td className="border-t px-4 py-2">{p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}</td>
                    <td className="border-t px-4 py-2">
                      {p.verified ? (
                        <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Verified</span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Unverified</span>
                      )}
                    </td>
                    <td className="border-t px-4 py-2 space-x-2">
                      <button
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={() => patchAction(p.id, "verify")}
                        aria-label={`Approve ${p.name}`}
                      >
                        ✅ Approve
                      </button>
                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={() => patchAction(p.id, "reject")}
                        aria-label={`Reject ${p.name}`}
                      >
                        ❌ Reject
                      </button>
                      <button
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                        onClick={() => openDetails(p.id)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <Toast message={toast} onClose={() => setToast(null)} />

        {/* Drawer / slide-over for details */}
        {selected && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
            <aside className="absolute right-0 top-0 h-full w-full md:w-2/5 bg-white p-6 overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{selected.name}</h3>
                <button className="text-gray-500" onClick={() => setSelected(null)}>Close</button>
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                <div><strong>Email:</strong> {selected.email || "—"}</div>
                <div><strong>Service:</strong> {selected.service || "—"}</div>
                <div><strong>Experience:</strong> {selected.experience ?? "—"}</div>
                <div><strong>Joined:</strong> {selected.created_at ? new Date(selected.created_at).toLocaleString() : "—"}</div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
