
// Add Professional type for Supabase
type Professional = {
    id: string;
    verified: boolean;
    // Add other fields as needed
};
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

export default function AdminDashboardPage() {
    const [ready, setReady] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [pros, setPros] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [payments, setPayments] = useState<any[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error || !user) {
                setError("You must be logged in as an admin to access this page.");
                setLoading(false);
                return;
            }
            // Check user metadata for admin role
            if (user.user_metadata && user.user_metadata.role === "admin") {
                setIsAdmin(true);
                // Fetch real professionals from Supabase
                const { data: prosData, error: prosError } = await supabase.from('professionals').select('*');
                if (prosError) setError(prosError.message);
                setPros(prosData || []);
                // Fetch users (clients) from Supabase
                const { data: usersData, error: usersError } = await supabase.from('users').select('*');
                if (usersError) setError(usersError.message);
                setUsers(usersData || []);
                // Bookings and payments can be fetched similarly if needed
            } else {
                setError("You do not have admin access.");
            }
            setLoading(false);
        };
        checkAdmin();
    }, []);
                    // Removed admin API fetch calls

    // Approve/Reject handlers
      const handleApprove = async (proId: string) => {                    
    const { error } = await supabase.from('professionals').update({ verified: true } as never).eq('id', proId);
          if (error) { setError(error.message); return; }                 
          setPros(pros => pros.map(p => p.id === proId ? { ...p, verified: true } : p));
      }; 
    const handleReject = async (proId: string) => {
    const { error } = await supabase.from('professionals').update({ verified: false } as never).eq('id', proId);
        if (error) { setError(error.message); return; }
        setPros(pros => pros.map(p => p.id === proId ? { ...p, verified: false } : p));
    };

    if (loading) return <div className="p-10">Loading…</div>;
    if (error) return <div className="p-10 text-red-600">{error}</div>;
    if (!isAdmin) return null;

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
                                    <th className="px-4 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td className="border-t px-4 py-2">{u.name}</td>
                                        <td className="border-t px-4 py-2">{u.email}</td>
                                        <td className="border-t px-4 py-2">
                                            <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={async () => {
                                                // Removed reset password fetch call
                                            }}>Reset Password</button>
                                        </td>
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
                                    <th className="px-4 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pros.map(p => (
                                    <tr key={p.id}>
                                        <td className="border-t px-4 py-2">{p.name}</td>
                                        <td className="border-t px-4 py-2">{p.email}</td>
                                        <td className="border-t px-4 py-2">{p.verified ? "Yes" : "No"}</td>
                                        <td className="border-t px-4 py-2">
                                            {!p.verified && <button className="px-3 py-1 bg-green-600 text-white rounded mr-2" onClick={() => handleApprove(p.id)}>Approve</button>}
                                            {p.verified && <span className="text-green-700 font-semibold mr-2">Approved</span>}
                                            <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => handleReject(p.id)}>Reject</button>
                                        </td>
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
                {/* Activity Logs */}
                <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 mt-8">
                    <h2 className="font-bold text-lg mb-3">Recent Activity Logs</h2>
                    {logs.length === 0 ? <div className="text-gray-500">No logs found.</div> : (
                        <table className="min-w-full border border-gray-200 rounded text-sm mb-2">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left">Timestamp</th>
                                    <th className="px-4 py-2 text-left">User</th>
                                    <th className="px-4 py-2 text-left">Action</th>
                                    <th className="px-4 py-2 text-left">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map(log => (
                                    <tr key={log.id}>
                                        <td className="border-t px-4 py-2">{log.timestamp}</td>
                                        <td className="border-t px-4 py-2">{log.user_email || log.user_id}</td>
                                        <td className="border-t px-4 py-2">{log.action}</td>
                                        <td className="border-t px-4 py-2">{log.details}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <div className="mt-8 text-center">
                    <Link href="/" className="text-blue-600 font-semibold hover:text-blue-700 transition">Go to FixEasy Home</Link>
                </div>
            </div>
        </main>
        );
}
