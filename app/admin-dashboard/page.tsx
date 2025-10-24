"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";

type UserRecord = {
    id: number;
    name: string;
    email: string;
};

type ProRecord = UserRecord & {
    verified: boolean;
};

type BookingRecord = {
    id: number;
    service: string;
    client: string;
    pro: string;
    date: string;
    status: string;
};

type PaymentRecord = {
    id: number;
    service: string;
    client: string;
    pro: string;
    date: string;
    amount: number;
    status: string;
};

const ADMIN_AUTH_KEY = "FIXEASY_ADMIN_AUTH";

export default function AdminDashboardPage() {
    const [inputCode, setInputCode] = useState<string>("");
    const [authorized, setAuthorized] = useState(false);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [users, setUsers] = useState<UserRecord[]>([]);
    const [pros, setPros] = useState<ProRecord[]>([]);
    const [bookings, setBookings] = useState<BookingRecord[]>([]);
    const [payments, setPayments] = useState<PaymentRecord[]>([]);

    const expectedCode = useMemo(() => process.env.NEXT_PUBLIC_ADMIN_ACCESS_CODE?.trim() ?? "", []);

    useEffect(() => {
        const savedAuth = sessionStorage.getItem(ADMIN_AUTH_KEY);
        if (savedAuth === "true") {
            setAuthorized(true);
        }

        // TODO: Replace with real Supabase queries
        setUsers([{ id: 1, name: "Jane Client", email: "jane@example.com" }]);
        setPros([{ id: 2, name: "John Pro", email: "john@pro.com", verified: true }]);
        setBookings([{ id: 1, service: "Plumbing", client: "Jane Client", pro: "John Pro", date: "2025-10-28", status: "Completed" }]);
        setPayments([{ id: 1, amount: 80, service: "Plumbing", client: "Jane Client", pro: "John Pro", date: "2025-10-28", status: "Paid" }]);
        setReady(true);
    }, []);

    const handleLogin = () => {
        const trimmed = inputCode.trim();
        if (!trimmed) {
            setError("Please enter your admin access code.");
            return;
        }

        if (expectedCode && trimmed !== expectedCode) {
            setError("That admin access code is not valid.");
            return;
        }

        sessionStorage.setItem(ADMIN_AUTH_KEY, "true");
        setAuthorized(true);
        setError(null);
    };

    const handleLogout = () => {
        sessionStorage.removeItem(ADMIN_AUTH_KEY);
        setAuthorized(false);
        setInputCode("");
    };

    if (!ready) return <div className="p-10">Loading…</div>;

    if (!authorized) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16">
                <div className="container mx-auto px-4 max-w-md">
                    <h1 className="text-3xl font-bold mb-4">Admin Login</h1>
                    <p className="text-gray-600 mb-4">Enter your admin access code to continue.</p>
                    {expectedCode === "" && (
                        <p className="text-sm text-amber-600 mb-3">
                            No admin access code is configured. Set <code className="font-mono">NEXT_PUBLIC_ADMIN_ACCESS_CODE</code> in your environment to require a code.
                        </p>
                    )}
                    {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
                    <input
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-600 outline-none mb-3"
                        placeholder="Admin access code"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                    />
                    <button
                        className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold"
                        onClick={handleLogin}
                    >
                        Continue
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-4xl font-bold mb-6 text-gray-900">Admin Dashboard</h1>
                <div className="flex justify-end mb-6">
                    <button
                        className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition"
                        onClick={handleLogout}
                    >
                        Log out
                    </button>
                </div>
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* Users */}
                    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
                        <h2 className="font-bold text-lg mb-3">All Users</h2>
                        <table className="min-w-full border border-gray-200 rounded text-sm mb-2">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left">Name</th>
                                    <th className="px-4 py-2 text-left">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td className="border-t px-4 py-2">{u.name}</td>
                                        <td className="border-t px-4 py-2">{u.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Link href="/register/user" className="text-blue-600 text-xs">Add User</Link>
                    </div>
                    {/* Professionals */}
                    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
                        <h2 className="font-bold text-lg mb-3">All Professionals</h2>
                        <table className="min-w-full border border-gray-200 rounded text-sm mb-2">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left">Name</th>
                                    <th className="px-4 py-2 text-left">Email</th>
                                    <th className="px-4 py-2 text-left">Verified</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pros.map(p => (
                                    <tr key={p.id}>
                                        <td className="border-t px-4 py-2">{p.name}</td>
                                        <td className="border-t px-4 py-2">{p.email}</td>
                                        <td className="border-t px-4 py-2">{p.verified ? "Yes" : "No"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Link href="/register/professional" className="text-blue-600 text-xs">Add Professional</Link>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* Bookings */}
                    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
                        <h2 className="font-bold text-lg mb-3">All Bookings</h2>
                        <table className="min-w-full border border-gray-200 rounded text-sm mb-2">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left">Service</th>
                                    <th className="px-4 py-2 text-left">Client</th>
                                    <th className="px-4 py-2 text-left">Professional</th>
                                    <th className="px-4 py-2 text-left">Date</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(b => (
                                    <tr key={b.id}>
                                        <td className="border-t px-4 py-2">{b.service}</td>
                                        <td className="border-t px-4 py-2">{b.client}</td>
                                        <td className="border-t px-4 py-2">{b.pro}</td>
                                        <td className="border-t px-4 py-2">{b.date}</td>
                                        <td className="border-t px-4 py-2">{b.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Payments */}
                    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
                        <h2 className="font-bold text-lg mb-3">All Payments</h2>
                        <table className="min-w-full border border-gray-200 rounded text-sm mb-2">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left">Service</th>
                                    <th className="px-4 py-2 text-left">Client</th>
                                    <th className="px-4 py-2 text-left">Professional</th>
                                    <th className="px-4 py-2 text-left">Date</th>
                                    <th className="px-4 py-2 text-left">Amount (€)</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map(p => (
                                    <tr key={p.id}>
                                        <td className="border-t px-4 py-2">{p.service}</td>
                                        <td className="border-t px-4 py-2">{p.client}</td>
                                        <td className="border-t px-4 py-2">{p.pro}</td>
                                        <td className="border-t px-4 py-2">{p.date}</td>
                                        <td className="border-t px-4 py-2">{p.amount}</td>
                                        <td className="border-t px-4 py-2">{p.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <Link href="/" className="text-blue-600 font-semibold hover:text-blue-700 transition">Go to FixEasy Home</Link>
                </div>
            </div>
        </main>
    );

}

