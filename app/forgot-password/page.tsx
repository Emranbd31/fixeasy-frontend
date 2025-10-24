"use client";

import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function ForgotPasswordPage() {
    const sb = createSupabaseBrowserClient();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);
        try {
            const { error } = await sb.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`
            });
            if (error) throw error;
            setSuccess(true);
        } catch (e: any) {
            setError(e.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-28 pb-16 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                <h1 className="text-3xl font-bold mb-4 text-gray-900 text-center">Forgot Password</h1>
                <p className="text-center text-gray-600 mb-6">Enter your email to receive a password reset link.</p>
                {error && <div className="mb-4 p-3 rounded bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">{error}</div>}
                {success ? (
                    <div className="mb-4 p-3 rounded bg-green-50 border-l-4 border-green-500 text-green-700 text-sm">
                        Password reset link sent! Please check your email.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="your.email@example.com"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>
                )}
                <div className="mt-6 text-center">
                    <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition">Back to Login</Link>
                </div>
            </div>
        </main>
    );
}
