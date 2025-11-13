"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // If token exists, redirect to dashboard
        if (typeof window !== "undefined") {
            const t = localStorage.getItem("adminToken");
            if (t) router.replace("/admin/dashboard");
        }
    }, [router]);

    async function doLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // Send `email` key (backend expects `email`) — keep UI label as email/username
                body: JSON.stringify({ email: email, password, returnTo: searchParams?.get('returnTo') || undefined }),
            });
            const j = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(j?.error || "Login failed");
            // Try to extract token from response
            const token = j?.token ?? j?.access_token ?? j?.accessToken ?? j?.token ?? null;
            if (token) {
                // store both new and legacy keys so existing tests and older code keep working
                localStorage.setItem("adminToken", token);
                try { localStorage.setItem("fixeasy_admin_token", token); } catch { };
                // Use router.replace to avoid back-stack clutter; prefer server-provided redirect if present
                const redirectTo = j?.redirect || (searchParams?.get('returnTo')) || '/admin/dashboard';
                router.replace(redirectTo);
            } else {
                // backend also sets cookie; still navigate to redirect target if present
                const redirectTo = j?.redirect || (searchParams?.get('returnTo')) || '/admin/dashboard';
                router.replace(redirectTo);
            }
        } catch (e: any) {
            try {
                window.alert(String(e?.message ?? e));
            } catch { }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-md mx-auto mt-8">
            <h1 className="text-2xl font-semibold mb-4">Admin Login</h1>
            <form onSubmit={doLogin} className="space-y-3">
                <label htmlFor="admin-email" className="sr-only">Email</label>
                <input id="admin-email" name="email" type="email" aria-label="Email" className="w-full p-2 border rounded" placeholder="Email or username" value={email} onChange={(e) => setEmail(e.target.value)} />

                <label htmlFor="admin-password" className="sr-only">Password</label>
                <input id="admin-password" name="password" type="password" aria-label="Password" className="w-full p-2 border rounded" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {/* reCAPTCHA placeholder - replace with real site key integration when ready */}
                <div className="text-xs text-gray-500">reCAPTCHA placeholder (disabled)</div>
                <div className="flex justify-end">
                    <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded" disabled={loading}>{loading ? "Signing in…" : "Login"}</button>
                </div>
            </form>
        </div>
    );
}
