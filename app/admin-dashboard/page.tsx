"use client";

import { useEffect, useState } from "react";

type Pro = {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  experience: number | null;
  rate: number | null;
  service_area: string | null;
  id_document: string | null;
  address_proof: string | null;
  qualification_file: string | null;
  insurance_file: string | null;
  portfolio_files: string[] | null;
  profile_photo: string | null;
  verified: boolean;
  created_at?: string;
};

export default function AdminDashboard() {
  const [adminSecret, setAdminSecret] = useState<string>("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pros, setPros] = useState<Pro[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("ADMIN_SECRET") || "";
    if (saved) setAdminSecret(saved);
    setReady(true);
  }, []);

  async function loadPending() {
    if (!adminSecret) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/professionals?status=pending", {
        headers: { "x-admin-secret": adminSecret },
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const j = await res.json();
      setPros(j.rows || []);
    } catch (e: any) {
      setError("Unauthorized or failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function verify(user_id: string) {
    if (!adminSecret) return;
    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": adminSecret },
      body: JSON.stringify({ user_id, verified: true }),
    });
    if (res.ok) {
      setPros((p) => p.filter((r) => r.user_id !== user_id));
    } else {
      alert("Failed to verify");
    }
  }

  async function viewFile(path: string | null) {
    if (!path || !adminSecret) return;
    const res = await fetch("/api/admin/sign-url", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": adminSecret },
      body: JSON.stringify({ path }),
    });
    const j = await res.json();
    if (j.url) {
      window.open(j.url, "_blank");
    } else {
      alert("Could not generate link");
    }
  }

  if (!ready) return null;

  if (!adminSecret) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-md">
          <h1 className="text-3xl font-bold mb-4">Admin Login</h1>
          <p className="text-gray-600 mb-4">Enter your admin access code to continue.</p>
          <input className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-600 outline-none mb-3" placeholder="Admin access code" onChange={(e)=>setAdminSecret(e.target.value)} />
          <button className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold" onClick={()=>{ sessionStorage.setItem("ADMIN_SECRET", adminSecret); loadPending(); }}>Continue</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button className="px-4 py-2 rounded-lg border-2 border-gray-200" onClick={loadPending}>{loading ? "Loading…" : "Reload"}</button>
        </div>
        {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700">{error}</div>}

        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
          <h2 className="text-xl font-bold mb-4">Pending Professionals</h2>
          {pros.length === 0 ? (
            <p className="text-gray-600">No pending profiles. Click Reload to refresh.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Category</th>
                    <th className="py-2 pr-4">Docs</th>
                    <th className="py-2 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pros.map((p) => (
                    <tr key={p.user_id} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-semibold">{p.name}</td>
                      <td className="py-2 pr-4">{p.email}</td>
                      <td className="py-2 pr-4">{p.category}</td>
                      <td className="py-2 pr-4">
                        <div className="flex flex-wrap gap-2">
                          <button className="badge" onClick={()=>viewFile(p.id_document)}>Photo ID</button>
                          {p.address_proof && <button className="badge" onClick={()=>viewFile(p.address_proof!)}>Address</button>}
                          {p.qualification_file && <button className="badge" onClick={()=>viewFile(p.qualification_file!)}>Qualification</button>}
                          {p.insurance_file && <button className="badge" onClick={()=>viewFile(p.insurance_file!)}>Insurance</button>}
                        </div>
                      </td>
                      <td className="py-2 pr-4">
                        <button className="px-3 py-2 rounded-lg bg-green-600 text-white" onClick={()=>verify(p.user_id)}>Verify ✓</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <style jsx global>{`
          .badge { @apply px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold; }
        `}</style>
      </div>
    </main>
  );
}
