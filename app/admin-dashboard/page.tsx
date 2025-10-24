"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminDashboardPage() {
    // Admin access logic (admin code or role)
    const [adminSecret, setAdminSecret] = useState<string>("");
    const [ready, setReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // Placeholder data for demonstration
    const [users, setUsers] = useState<any[]>([]);
    const [pros, setPros] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [payments, setPayments] = useState<any[]>([]);

    useEffect(() => {
        const saved = sessionStorage.getItem("ADMIN_SECRET") || "";
        if (saved) setAdminSecret(saved);
        // TODO: Replace with real Supabase queries
        setUsers([{ id: 1, name: "Jane Client", email: "jane@example.com" }]);
        setPros([{ id: 2, name: "John Pro", email: "john@pro.com", verified: true }]);
        setBookings([{ id: 1, service: "Plumbing", client: "Jane Client", pro: "John Pro", date: "2025-10-28", status: "Completed" }]);
        setPayments([{ id: 1, amount: 80, service: "Plumbing", client: "Jane Client", pro: "John Pro", date: "2025-10-28", status: "Paid" }]);
        setReady(true);
    }, []);

    if (!ready) return <div className="p-10">Loading…</div>;
    if (!adminSecret) return (
        <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16">
            <div className="container mx-auto px-4 max-w-md">
                <h1 className="text-3xl font-bold mb-4">Admin Login</h1>
                <p className="text-gray-600 mb-4">Enter your admin access code to continue.</p>
                <input className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-600 outline-none mb-3" placeholder="Admin access code" onChange={(e) => setAdminSecret(e.target.value)} />
                <button className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold" onClick={() => { sessionStorage.setItem("ADMIN_SECRET", adminSecret); setReady(true); }}>Continue</button>
            </div>
        </main>
	);
}

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-4xl font-bold mb-6 text-gray-900">Admin Dashboard</h1>
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


