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

    function validatePassword(pw: string) {
        // At least 8 chars, one special symbol, one number, one uppercase
        return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(pw)
    }

    async function onLogin() {
        try {
            setLoading(true);
            setError(null);
            if (!validatePassword(password)) {
                setError('Password must be at least 8 characters, include an uppercase letter, a number, and a special symbol');
                setLoading(false);
                return;
            }
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
        <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-28 md:pt-32 pb-16">
            <div className="container mx-auto px-4 max-w-md">
                <h1 className="text-4xl md:text-5xl font-bold mb-3 text-center text-gray-900">Login</h1>
                <p className="text-center text-gray-600 mb-8">Welcome back to FixEasy</p>
                {error && <div className="mb-6 p-4 rounded-xl bg-red-50 border-l-4 border-red-500 text-red-700 shadow-sm">
                    <p className="font-semibold">⚠️ {error}</p>
                </div>}
                <div className="space-y-5 bg-white p-8 md:p-10 rounded-2xl shadow-2xl border border-gray-100">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                        <input className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-600 outline-none transition" placeholder="your.email@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password <span className="text-red-500">*</span></label>
                        <input className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-600 outline-none transition" placeholder="Min. 8 chars, 1 uppercase, 1 number, 1 symbol" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button disabled={loading} onClick={onLogin} className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg hover:from-blue-700 hover:to-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30 transform hover:scale-[1.02] disabled:transform-none">
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Logging in...
                            </span>
                        ) : (
                            '510 Login'
                        )}
                    </button>

                    {/* Social Login */}
                    <div className="flex flex-col gap-4 pt-2">
                        <button type="button" className="w-full flex items-center justify-center gap-3 py-3 px-6 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 bg-white hover:bg-gray-50 transition">
                            <img src="/images/services/google-logo.png" alt="Google" className="w-6 h-6" />
                            Sign in with Google
                        </button>
                        <button type="button" className="w-full flex items-center justify-center gap-3 py-3 px-6 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 bg-white hover:bg-gray-50 transition">
                            <img src="/images/services/apple-logo.png" alt="Apple" className="w-6 h-6" />
                            Sign in with Apple
                        </button>
                    </div>

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
                        <p className="text-sm text-gray-600 text-center">
                            <Link className="text-blue-600 font-semibold hover:text-blue-700 transition" href="/forgot-password">
                                Forgot/Reset Password?
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
