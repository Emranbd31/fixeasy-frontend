"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";
import Link from "next/link";

export default function ClientDashboardPage() {
    const sb = createSupabaseBrowserClient();
    const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

    useEffect(() => {
        (async () => {
            const { data: { user } } = await sb.auth.getUser();
            setIsAuthed(!!user);
        })();
    }, []);

    if (isAuthed === null) return <div className="p-10">Loading…</div>;

    if (!isAuthed) return (
        <main className="p-10">
            <p>Please <Link className="text-blue-600" href="/login">login</Link> to access your dashboard.</p>
        </main>
    );

    // TODO: Fetch bookings, profile, notifications from Supabase
    // Placeholder data for UI demonstration
    const bookings = [
        { id: 1, service: "Plumbing", date: "2025-10-28", status: "Completed", professional: "John Plumber" },
        { id: 2, service: "Cleaning", date: "2025-11-02", status: "Scheduled", professional: "Mary Cleaner" }
    ];
    const upcoming = bookings.filter(b => b.status === "Scheduled");
    const history = bookings.filter(b => b.status === "Completed");
    const userProfile = { name: "Jane Client", email: "jane@example.com", phone: "+353 87 123 4567" };
    const notifications = [
        { id: 1, message: "Your booking with Mary Cleaner is scheduled for Nov 2." },
        { id: 2, message: "Plumbing job completed. Please leave feedback." }
    ];
    const payments = [
        { id: 1, amount: 80, service: "Plumbing", date: "2025-10-28", status: "Paid" },
        { id: 2, amount: 60, service: "Cleaning", date: "2025-11-02", status: "Pending" }
    ];

    return (
        <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <h1 className="text-4xl font-bold mb-6 text-gray-900">Your Dashboard</h1>
                {/* Notifications */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">Notifications</h2>
                    <ul className="space-y-2">
                        {notifications.map(n => (
                            <li key={n.id} className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded text-blue-800 text-sm">{n.message}</li>
                        ))}
                    </ul>
                </div>
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {/* Upcoming Bookings */}
                    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
                        <h2 className="font-bold text-lg mb-3">Upcoming Bookings</h2>
                        {upcoming.length === 0 ? <p className="text-gray-500">No upcoming bookings.</p> : (
                            <ul className="space-y-3">
                                {upcoming.map(b => (
                                    <li key={b.id} className="border-b pb-2">
                                        <div className="font-semibold">{b.service} with {b.professional}</div>
                                        <div className="text-xs text-gray-600">{b.date}</div>
                                        <button className="mt-2 text-blue-600 text-xs">Reschedule / Cancel</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {/* Booking History */}
                    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
                        <h2 className="font-bold text-lg mb-3">Booking History</h2>
                        {history.length === 0 ? <p className="text-gray-500">No completed bookings.</p> : (
                            <ul className="space-y-3">
                                {history.map(b => (
                                    <li key={b.id} className="border-b pb-2">
                                        <div className="font-semibold">{b.service} with {b.professional}</div>
                                        <div className="text-xs text-gray-600">{b.date}</div>
                                        <button className="mt-2 text-green-600 text-xs">Leave Feedback</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {/* Account Info & Quick Actions */}
                    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 flex flex-col justify-between">
                        <div>
                            <h2 className="font-bold text-lg mb-3">Account Info</h2>
                            <div className="mb-2"><span className="font-semibold">Name:</span> {userProfile.name}</div>
                            <div className="mb-2"><span className="font-semibold">Email:</span> {userProfile.email}</div>
                            <div className="mb-2"><span className="font-semibold">Phone:</span> {userProfile.phone}</div>
                            <Link href="/profile" className="text-blue-600 text-xs">Edit Profile</Link>
                        </div>
                        <div className="mt-6">
                            <h2 className="font-bold text-lg mb-3">Quick Actions</h2>
                            <div className="flex flex-col gap-2">
                                <Link href="/book" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold text-center hover:bg-blue-700">Book New Service</Link>
                                <Link href="/support" className="bg-gray-100 text-blue-600 px-4 py-2 rounded font-semibold text-center hover:bg-blue-50">Contact Support</Link>
                                <Link href="/invoices" className="bg-gray-100 text-blue-600 px-4 py-2 rounded font-semibold text-center hover:bg-blue-50">View Invoices</Link>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Payment History */}
                <div className="mb-12">
                    <h2 className="text-xl font-semibold mb-2">Payment History</h2>
                    {payments.length === 0 ? <p className="text-gray-500">No payments found.</p> : (
                        <table className="min-w-full border border-gray-200 rounded text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left">Service</th>
                                    <th className="px-4 py-2 text-left">Date</th>
                                    <th className="px-4 py-2 text-left">Amount (€)</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map(p => (
                                    <tr key={p.id}>
                                        <td className="border-t px-4 py-2">{p.service}</td>
                                        <td className="border-t px-4 py-2">{p.date}</td>
                                        <td className="border-t px-4 py-2">{p.amount}</td>
                                        <td className="border-t px-4 py-2">{p.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                {/* Code comments for future logic: Replace placeholder data with Supabase queries for bookings, profile, notifications, payments. */}
            </div>
        </main>
    );
}
