"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    return emailOk && password.trim().length > 0;
  }, [email, password]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error || `Login failed (${res.status})`);
        return;
      }

      router.replace("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-28 md:pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-md">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-center text-gray-900">
          Admin Login
        </h1>
        <p className="text-center text-gray-600 mb-8">Sign in to FixEasy Admin</p>
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border-l-4 border-red-500 text-red-700 shadow-sm">
            <p className="font-semibold">⚠️ {error}</p>
          </div>
        )}

        <form
          onSubmit={onSubmit}
          className="space-y-5 bg-white p-8 md:p-10 rounded-2xl shadow-2xl border border-gray-100"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-600 outline-none transition"
              placeholder="admin@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-600 outline-none transition"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            disabled={loading || !canSubmit}
            type="submit"
            className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg hover:from-blue-700 hover:to-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30 transform hover:scale-[1.02] disabled:transform-none"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}

