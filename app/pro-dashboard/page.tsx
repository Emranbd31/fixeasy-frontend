"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";
import Link from "next/link";

export default function ProDashboardPage() {
    const sb = createSupabaseBrowserClient();
    const [status, setStatus] = useState<"loading" | "ok" | "unauth">("loading");
    const [verified, setVerified] = useState<boolean | null>(null);
    const [name, setName] = useState<string>("");

    useEffect(() => {
        (async () => {
            const { data: { user } } = await sb.auth.getUser();
            if (!user) { setStatus("unauth"); return; }

            const { data, error } = await sb.from("professionals").select("name, verified").eq("user_id", user.id).single();
            const row: any = data as any;
            if (!error && row) {
                setName(row.name as string);
                setVerified(!!row.verified);
                setStatus("ok");
            } else {
                setStatus("ok");
            }
        })();
    }, []);

    if (status === "loading") return <div className="p-10">Loading…</div>;
    if (status === "unauth") return (
        <main className="p-10">
            <p>Please <Link className="text-blue-600" href="/login">login</Link> to access your dashboard.</p>
        </main>
    );

    // TODO: Fetch jobs, earnings, calendar, profile from Supabase
    // Placeholder data for UI demonstration
    const jobRequests = [
        { id: 1, service: "Plumbing", client: "Jane Client", date: "2025-10-29" },
        { id: 2, service: "Cleaning", client: "Bob Client", date: "2025-11-03" }
    ];
    const acceptedJobs = [
        { id: 3, service: "Gardening", client: "Alice Client", date: "2025-11-05", status: "Scheduled" }
    ];
    const earnings = { total: 1200, recent: 150 };
    const calendar = [
        { date: "2025-10-29", job: "Plumbing for Jane Client" },
        { date: "2025-11-05", job: "Gardening for Alice Client" }
    ];
    const payments = [
        { id: 1, amount: 80, service: "Plumbing", client: "Jane Client", date: "2025-10-28", status: "Paid" },
        { id: 2, amount: 60, service: "Cleaning", client: "Bob Client", date: "2025-11-03", status: "Pending" }
    ];

    return (
        <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <h1 className="text-4xl font-bold mb-6 text-gray-900">Professional Dashboard</h1>
                {verified === false && (
                    <div className="mb-6 p-4 rounded-xl border-2 border-yellow-300 bg-yellow-50 text-yellow-800">
                        Waiting for verification – your documents are under review. ✅ We'll email you when you're approved.
                    </div>
                )}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {/* Job Requests */}
                    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
                        <h2 className="font-bold text-lg mb-3">Job Requests</h2>
                        {jobRequests.length === 0 ? <p className="text-gray-500">No new job requests.</p> : (
                            <ul className="space-y-3">
                                {jobRequests.map(j => (
                                    <li key={j.id} className="border-b pb-2">
                                        <div className="font-semibold">{j.service} for {j.client}</div>
                                        <div className="text-xs text-gray-600">{j.date}</div>
                                        <div className="flex gap-2 mt-2">
                                            <button className="text-green-600 text-xs">Accept</button>
                                            <button className="text-red-600 text-xs">Reject</button>
                                            <button className="text-blue-600 text-xs">Schedule</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {/* Accepted Jobs */}
                    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
                        <h2 className="font-bold text-lg mb-3">Accepted Jobs</h2>
                        {acceptedJobs.length === 0 ? <p className="text-gray-500">No accepted jobs.</p> : (
                            <ul className="space-y-3">
                                {acceptedJobs.map(j => (
                                    <li key={j.id} className="border-b pb-2">
                                        <div className="font-semibold">{j.service} for {j.client}</div>
                                        <div className="text-xs text-gray-600">{j.date} ({j.status})</div>
                                        <button className="mt-2 text-blue-600 text-xs">Update Status</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {/* Earnings & Quick Actions */}
                    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 flex flex-col justify-between">
                        <div>
                            <h2 className="font-bold text-lg mb-3">Earnings</h2>
                            <div className="mb-2"><span className="font-semibold">Total:</span> €{earnings.total}</div>
                            <div className="mb-2"><span className="font-semibold">Recent Payout:</span> €{earnings.recent}</div>
                            <Link href="/stripe-connect" className="text-blue-600 text-xs">View Stripe Payouts</Link>
                        </div>
                        <div className="mt-6">
                            <h2 className="font-bold text-lg mb-3">Quick Actions</h2>
                            <div className="flex flex-col gap-2">
                                <Link href="/availability" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold text-center hover:bg-blue-700">Update Availability</Link>
                                <Link href="/reviews" className="bg-gray-100 text-blue-600 px-4 py-2 rounded font-semibold text-center hover:bg-blue-50">View Reviews</Link>
                                <Link href="/support" className="bg-gray-100 text-blue-600 px-4 py-2 rounded font-semibold text-center hover:bg-blue-50">Contact Support</Link>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Profile Status & Calendar */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
                        <h2 className="font-bold text-lg mb-3">Profile Status</h2>
                        <div className="mb-2"><span className="font-semibold">Name:</span> {name || "—"}</div>
                        <div className="mb-2"><span className="font-semibold">Verification:</span> {verified ? "Verified" : "Pending"}</div>
                        <Link href="/register/professional" className="text-blue-600 text-xs">Update Documents</Link>
                    </div>
                    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
                        <h2 className="font-bold text-lg mb-3">Calendar</h2>
                        {calendar.length === 0 ? <p className="text-gray-500">No scheduled jobs.</p> : (
                            <ul className="space-y-3">
                                {calendar.map(c => (
                                    <li key={c.date} className="border-b pb-2">
                                        <div className="font-semibold">{c.job}</div>
                                        <div className="text-xs text-gray-600">{c.date}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
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
                                    <th className="px-4 py-2 text-left">Client</th>
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
                                        <td className="border-t px-4 py-2">{p.date}</td>
                                        <td className="border-t px-4 py-2">{p.amount}</td>
                                        <td className="border-t px-4 py-2">{p.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                {/* Code comments for future logic: Replace placeholder data with Supabase queries for jobs, earnings, calendar, profile, payments. */}
            </div>
        </main>
    );
}
