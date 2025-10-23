"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";
import Link from "next/link";

export default function LoginPage() {
  const sb = createSupabaseBrowserClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onLogin() {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const user = data.user;
      const role = user?.user_metadata?.role || "client";

      if (role === "professional") {
        router.push("/pro-dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-md">
        <h1 className="text-3xl font-bold mb-6">Login</h1>
        {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700">{error}</div>}
        <div className="space-y-4 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
          <input className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-600 outline-none" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-600 outline-none" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          <button disabled={loading} onClick={onLogin} className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:from-blue-700 hover:to-cyan-700 transition disabled:opacity-50">{loading ? "Logging in…" : "Login"}</button>
          
          <div className="pt-4 border-t border-gray-200 space-y-2">
            <p className="text-sm text-gray-600 text-center">
              Don't have an account?{' '}
              <Link className="text-blue-600 font-semibold hover:text-blue-700 transition" href="/register/user">
                Sign Up as User
              </Link>
            </p>
            <p className="text-sm text-gray-600 text-center">
              Are you a professional?{' '}
              <Link className="text-green-600 font-semibold hover:text-green-700 transition" href="/register/professional">
                Register as Pro
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
