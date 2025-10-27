"use client";

import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function ForgotPasswordPage() {
    const sb = createSupabaseBrowserClient();
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [phoneSuccess, setPhoneSuccess] = useState(false);
    const [phoneError, setPhoneError] = useState<string | null>(null);

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

    // Placeholder phone reset handler
    async function handlePhoneReset(e: React.FormEvent) {
        e.preventDefault();
        setPhoneError(null);
        setPhoneSuccess(false);
        // TODO: Integrate with SMS OTP backend (e.g., Twilio)
        if (!phone.match(/^\+?[0-9\s-]{7,}$/)) {
            setPhoneError("Please enter a valid phone number.");
            return;
        }
        setPhoneSuccess(true);
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-28 pb-16 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                <h1 className="text-3xl font-bold mb-4 text-gray-900 text-center">Forgot Password</h1>
                <p className="text-center text-gray-600 mb-6">Enter your email or phone number to receive a password reset link/code.</p>
                {/* Email reset */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-2">Reset by Email</h2>
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
                </div>
                {/* Phone reset */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-2">Reset by Phone (SMS)</h2>
                    {phoneError && <div className="mb-4 p-3 rounded bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">{phoneError}</div>}
                    {phoneSuccess ? (
                        <div className="mb-4 p-3 rounded bg-green-50 border-l-4 border-green-500 text-green-700 text-sm">
                            If this phone is registered, you will receive an SMS with reset instructions. (Demo only)
                        </div>
                    ) : (
                        <form onSubmit={handlePhoneReset} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    placeholder="+353 87 123 4567"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-xl font-bold text-lg hover:from-green-700 hover:to-blue-700 transition"
                            >
                                Send SMS Code
                            </button>
                        </form>
                    )}
                    <p className="text-xs text-gray-500 mt-2">SMS password reset requires backend integration (e.g., Twilio).</p>
                </div>
                <div className="mt-6 text-center">
                    <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition">Back to Login</Link>
                </div>
            </div>
        </main>
    );
}
