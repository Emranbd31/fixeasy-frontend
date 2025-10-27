http://localhost:3000/admin-dashboardgit add .
git commit -m "Fix: remove extra closing brace in admin dashboard"
git push origin main"use client";


import { useEffect, useState, useRef } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";
import Link from "next/link";
import { Bell, Calendar, Clock, User, Zap, Info, CheckCircle, AlertTriangle, Pencil } from "lucide-react";

import { useRef } from "react";

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
            <p>Please <Link className="text-blue-600 transition-transform duration-200 hover:scale-105 hover:shadow-md hover:underline" href="/login">login</Link> to access your dashboard.</p>
        </main>
    );

    // TODO: Fetch bookings, profile, notifications from Supabase
    // Placeholder data for UI demonstration
    const [bookings, setBookings] = useState([
        { id: 1, service: "Plumbing", date: "2025-10-28", time: "10:00 AM", location: "Dublin", status: "Completed", professional: "John Plumber" },
        { id: 2, service: "Cleaning", date: "2025-11-02", time: "2:00 PM", location: "Dublin", status: "Scheduled", professional: "Mary Cleaner" },
        { id: 3, service: "Gardening", date: "2025-11-10", time: "9:00 AM", location: "Cork", status: "Pending", professional: "Sam Gardener" }
    ]);
    const upcoming = bookings.filter(b => b.status === "Scheduled");
    const history = bookings.filter(b => b.status === "Completed");

    // Supabase real-time booking updates
    useEffect(() => {
        const sb = createSupabaseBrowserClient();
        const channel = sb.channel('bookings-realtime');
        channel.on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, (payload) => {
            // For demo: just refetch or update bookings state
            // In production, fetch from Supabase or update state based on payload.new
            // Here, we simulate by logging
            // TODO: Replace with real fetch
            // fetchBookings();
            // For now, just log:
            console.log('Booking update:', payload);
        });
        channel.subscribe();
        return () => { channel.unsubscribe(); };
    }, []);
    const userProfile = { name: "Jane Client", email: "jane@example.com", phone: "+353 87 123 4567" };
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [editProfile, setEditProfile] = useState(userProfile);
    const modalRef = useRef<HTMLDivElement>(null);
    // Support modal state
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [supportMessage, setSupportMessage] = useState("");
    const [supportLoading, setSupportLoading] = useState(false);
    const [supportSuccess, setSupportSuccess] = useState(false);
    // Feedback modal state
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbackBooking, setFeedbackBooking] = useState<any>(null);
    const [feedbackStars, setFeedbackStars] = useState(0);
    const [feedbackComment, setFeedbackComment] = useState("");
    // Example notification types: info, success, warning
    const notifications = [
        { id: 1, message: "Your booking with Mary Cleaner is scheduled for Nov 2.", type: "info" },
        { id: 2, message: "Plumbing job completed. Please leave feedback.", type: "success" },
        { id: 3, message: "Payment pending for your last booking.", type: "warning" }
    ];
    const payments = [
        { id: 1, amount: 80, service: "Plumbing", date: "2025-10-28", status: "Paid" },
        { id: 2, amount: 60, service: "Cleaning", date: "2025-11-02", status: "Pending" }
    ];

    return (
        <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
            <div className="container mx-auto px-2 sm:px-4 max-w-5xl">
                <h1 className="text-4xl font-bold mb-6 text-gray-900">Your Dashboard</h1>
                {/* Notifications */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2 flex items-center gap-2"><Bell className="w-5 h-5 text-blue-500" /> Notifications</h2>
                    <style>{`
                    .fade-in-notification {
                        animation: fadeInNotif 0.7s ease;
                    }
                    @keyframes fadeInNotif {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: none; }
                    }
                    `}</style>
                    <ul className="space-y-2">
                        {notifications.map(n => {
                            let icon = <Info className="w-4 h-4 text-blue-500 mr-2" />;
                            let bg = "bg-blue-50 border-blue-400 text-blue-800";
                            if (n.type === "success") {
                                icon = <CheckCircle className="w-4 h-4 text-green-500 mr-2" />;
                                bg = "bg-green-50 border-green-400 text-green-800";
                            } else if (n.type === "warning") {
                                icon = <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />;
                                bg = "bg-yellow-50 border-yellow-400 text-yellow-800";
                            }
                            return (
                                <li key={n.id} className={`fade-in-notification flex items-center border-l-4 p-3 rounded text-sm ${bg}`}>
                                    {icon}
                                    <span>{n.message}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
                    {/* Upcoming Bookings */}
                    <div className="bg-white rounded-2xl shadow p-4 sm:p-6 border border-gray-100 flex flex-col h-full">
                        <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-500" /> Upcoming Bookings</h2>
                        {upcoming.length === 0 ? <p className="text-gray-500">No upcoming bookings.</p> : (
                            <ul className="space-y-3">
                                {upcoming.map(b => (
                                    <li key={b.id} className="border-b pb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">{b.service} with {b.professional}</span>
                                            <span className={`ml-auto px-2 py-0.5 rounded text-xs font-semibold 
                                                ${b.status === "Pending" ? "bg-yellow-100 text-yellow-800" : ""}
                                                ${b.status === "Scheduled" ? "bg-blue-100 text-blue-800" : ""}
                                                ${b.status === "Completed" ? "bg-green-100 text-green-800" : ""}
                                            `}>{b.status}</span>
                                        </div>
                                        <div className="text-xs text-gray-600 flex items-center gap-2 mt-1">
                                            {b.location && <span>📍 {b.location}</span>}
                                            {b.time && <span>⏰ {b.time}</span>}
                                            <span>{b.date}</span>
                                        </div>
                                        <button className="mt-2 text-xs bg-blue-600 text-white rounded px-3 py-1 transition-transform duration-200 hover:scale-105 hover:shadow-md hover:bg-blue-700 mr-2">Reschedule / Cancel</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {/* Booking History */}
                    <div className="bg-white rounded-2xl shadow p-4 sm:p-6 border border-gray-100 flex flex-col h-full">
                        <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500" /> Booking History</h2>
                        {history.length === 0 ? <p className="text-gray-500">No completed bookings.</p> : (
                            <ul className="space-y-3">
                                {history.map(b => (
                                    <li key={b.id} className="border-b pb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">{b.service} with {b.professional}</span>
                                            <span className={`ml-auto px-2 py-0.5 rounded text-xs font-semibold 
                                                ${b.status === "Pending" ? "bg-yellow-100 text-yellow-800" : ""}
                                                ${b.status === "Scheduled" ? "bg-blue-100 text-blue-800" : ""}
                                                ${b.status === "Completed" ? "bg-green-100 text-green-800" : ""}
                                            `}>{b.status}</span>
                                        </div>
                                        <div className="text-xs text-gray-600 flex items-center gap-2 mt-1">
                                            {b.location && <span>📍 {b.location}</span>}
                                            {b.time && <span>⏰ {b.time}</span>}
                                            <span>{b.date}</span>
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            <button className="text-xs bg-green-600 text-white rounded px-3 py-1 transition-transform duration-200 hover:scale-105 hover:shadow-md hover:bg-green-700" onClick={() => { setFeedbackBooking(b); setShowFeedbackModal(true); }}>Leave Feedback</button>
                                            <a
                                                href={`/api/invoice/${b.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs bg-blue-600 text-white rounded px-3 py-1 transition-transform duration-200 hover:scale-105 hover:shadow-md hover:bg-blue-700"
                                            >
                                                Download Invoice (PDF)
                                            </a>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {/* Account Info & Quick Actions */}
                    <div className="bg-white rounded-2xl shadow p-4 sm:p-6 border border-gray-100 flex flex-col justify-between h-full">
                        <div>
                            <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><User className="w-4 h-4 text-blue-500" /> Account Info</h2>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="inline-block w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg border">{userProfile.name[0]}</span>
                                <span className="font-semibold">{userProfile.name}</span>
                            </div>
                            <div className="mb-2"><span className="font-semibold">Email:</span> {userProfile.email}</div>
                            <div className="mb-2"><span className="font-semibold">Phone:</span> {userProfile.phone}</div>
                            <button onClick={() => setShowProfileModal(true)} className="flex items-center gap-1 text-blue-600 text-xs transition-transform duration-200 hover:scale-105 hover:shadow-md hover:underline"><Pencil className="w-3 h-3" /> Edit Profile</button>
                        </div>
                        <div className="mt-6">
                            <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><Zap className="w-4 h-4 text-blue-500" /> Quick Actions</h2>
                            <div className="flex flex-col gap-2">
                                <Link href="/book" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold text-center transition-transform duration-200 hover:scale-105 hover:shadow-md hover:bg-blue-700">Book New Service</Link>
                                <button type="button" onClick={() => setShowSupportModal(true)} className="bg-gray-100 text-blue-600 px-4 py-2 rounded font-semibold text-center transition-transform duration-200 hover:scale-105 hover:shadow-md hover:bg-blue-50">Contact Support</button>
                                <Link href="/invoices" className="bg-gray-100 text-blue-600 px-4 py-2 rounded font-semibold text-center transition-transform duration-200 hover:scale-105 hover:shadow-md hover:bg-blue-50">View Invoices</Link>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Payment History */}
                <div className="mb-12 overflow-x-auto">
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
            {/* Support Modal */}
            {showSupportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm animate-fadeIn" style={{ animation: 'fadeIn 0.2s' }}>
                        <h3 className="text-lg font-bold mb-4">Contact Support</h3>
                        {supportSuccess ? (
                            <div className="text-green-600 font-semibold mb-4">Your message has been sent!</div>
                        ) : (
                        <form onSubmit={async e => {
                            e.preventDefault();
                            setSupportLoading(true);
                            setSupportSuccess(false);
                            try {
                                const sb = createSupabaseBrowserClient();
                                await sb.from('support_tickets').insert({
                                    user_email: userProfile.email,
                                    message: supportMessage,
                                    created_at: new Date().toISOString()
                                });
                                setSupportSuccess(true);
                                setSupportMessage("");
                            } catch {
                                // Optionally show error
                            }
                            setSupportLoading(false);
                        }}>
                            <label className="block text-xs font-semibold mb-1">Message</label>
                            <textarea className="w-full border rounded px-3 py-2 mb-4" rows={4} required value={supportMessage} onChange={e => setSupportMessage(e.target.value)} placeholder="How can we help you?" />
                            <div className="flex gap-2 justify-end mt-4">
                                <button type="button" className="px-4 py-2 rounded bg-gray-100 text-gray-700 transition-transform duration-200 hover:scale-105 hover:shadow-md hover:bg-gray-200" onClick={() => { setShowSupportModal(false); setSupportSuccess(false); }}>Cancel</button>
                                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white transition-transform duration-200 hover:scale-105 hover:shadow-md hover:bg-blue-700" disabled={supportLoading}>{supportLoading ? "Sending..." : "Send"}</button>
                            </div>
                        </form>
                        )}
                    </div>
                    <style>{`
                        @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: none; } }
                    `}</style>
                </div>
            )}
            {/* Feedback Modal */}
            {showFeedbackModal && feedbackBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={e => { if (e.target === feedbackModalRef.current) setShowFeedbackModal(false); }}>
                    <div ref={feedbackModalRef} className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm animate-fadeIn" style={{ animation: 'fadeIn 0.2s' }}>
                        <h3 className="text-lg font-bold mb-4">Leave Feedback</h3>
                        <div className="mb-2 font-semibold">{feedbackBooking.service} with {feedbackBooking.professional}</div>
                        <div className="flex gap-1 mb-4">
                            {[1,2,3,4,5].map(star => (
                                <button key={star} type="button" onClick={() => setFeedbackStars(star)} className={star <= feedbackStars ? "text-yellow-400" : "text-gray-300"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                                </button>
                            ))}
                        </div>
                        <textarea className="w-full border rounded px-3 py-2 mb-4" rows={3} placeholder="Add a comment (optional)" value={feedbackComment} onChange={e => setFeedbackComment(e.target.value)} />
                        <div className="flex gap-2 justify-end mt-4">
                            <button type="button" className="px-4 py-2 rounded bg-gray-100 text-gray-700 transition-transform duration-200 hover:scale-105 hover:shadow-md hover:bg-gray-200" onClick={() => setShowFeedbackModal(false)}>Cancel</button>
                            <button type="button" className="px-4 py-2 rounded bg-blue-600 text-white transition-transform duration-200 hover:scale-105 hover:shadow-md hover:bg-blue-700" onClick={() => { setShowFeedbackModal(false); setFeedbackStars(0); setFeedbackComment(""); }}>Submit</button>
                        </div>
                    </div>
                    <style>{`
                        @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: none; } }
                    `}</style>
                </div>
            )}
            {/* Edit Profile Modal */}
            {showProfileModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={e => { if (e.target === modalRef.current) setShowProfileModal(false); }}>
                    <div ref={modalRef} className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm animate-fadeIn" style={{ animation: 'fadeIn 0.2s' }}>
                        <h3 className="text-lg font-bold mb-4">Edit Profile</h3>
                        <form onSubmit={e => { e.preventDefault(); setShowProfileModal(false); }}>
                            <div className="mb-3">
                                <label className="block text-xs font-semibold mb-1">Name</label>
                                <input className="w-full border rounded px-3 py-2" value={editProfile.name} onChange={e => setEditProfile({ ...editProfile, name: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label className="block text-xs font-semibold mb-1">Email</label>
                                <input className="w-full border rounded px-3 py-2" value={editProfile.email} onChange={e => setEditProfile({ ...editProfile, email: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label className="block text-xs font-semibold mb-1">Phone</label>
                                <input className="w-full border rounded px-3 py-2" value={editProfile.phone} onChange={e => setEditProfile({ ...editProfile, phone: e.target.value })} />
                            </div>
                            <div className="flex gap-2 justify-end mt-4">
                                <button type="button" className="px-4 py-2 rounded bg-gray-100 text-gray-700 transition-transform duration-200 hover:scale-105 hover:shadow-md hover:bg-gray-200" onClick={() => setShowProfileModal(false)}>Cancel</button>
                                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white transition-transform duration-200 hover:scale-105 hover:shadow-md hover:bg-blue-700">Save</button>
                            </div>
                        </form>
                    </div>
                    <style>{`
                        @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: none; } }
                    `}</style>
                </div>
            )}
            </div>
        </main>
    );
}
