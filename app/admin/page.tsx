"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, Users, Briefcase, Book, CreditCard, List } from "lucide-react";
import Link from "next/link";

const summaryIcons = [
  <Users className="w-6 h-6 text-blue-500" />,
  <Briefcase className="w-6 h-6 text-green-500" />,
  <Book className="w-6 h-6 text-yellow-500" />,
  <CreditCard className="w-6 h-6 text-purple-500" />,
];

const tabs = [
	{ value: "professionals", label: "Professionals", icon: <Briefcase className="w-4 h-4 mr-2" /> },
	{ value: "clients", label: "Clients", icon: <Users className="w-4 h-4 mr-2" /> },
	{ value: "bookings", label: "Bookings", icon: <Book className="w-4 h-4 mr-2" /> },
	{ value: "payments", label: "Payments", icon: <CreditCard className="w-4 h-4 mr-2" /> },
	{ value: "logs", label: "Activity Logs", icon: <List className="w-4 h-4 mr-2" /> },
];


// --- Data state ---
const [stats, setStats] = useState({ users: '-', professionals: '-', bookings: '-', payments: '-', totalRevenue: '-' });
const [professionals, setProfessionals] = useState([]);
const [clients, setClients] = useState([]);
const [bookings, setBookings] = useState([]);
const [payments, setPayments] = useState([]);
const [logs, setLogs] = useState([]);
const [loading, setLoading] = useState(true);
const [actionLoading, setActionLoading] = useState(false);
const [toast, setToast] = useState<{ type: 'success'|'error', message: string }|null>(null);

// --- Fetch functions ---
const fetchAll = async () => {
	setLoading(true);
	try {
		const statsRes = await fetch('/api/admin/stats').then(r => r.json());
		setStats(statsRes);
		const prosRes = await fetch('/api/admin/professionals').then(r => r.json());
		setProfessionals(prosRes.professionals || []);
		const clientsRes = await fetch('/api/admin/clients').then(r => r.json());
		setClients(clientsRes.clients || []);
		const bookingsRes = await fetch('/api/admin/bookings').then(r => r.json());
		setBookings(bookingsRes.bookings || []);
		const paymentsRes = await fetch('/api/admin/payments').then(r => r.json());
		setPayments(paymentsRes.payments || []);
		const logsRes = await fetch('/api/admin/activity').then(r => r.json());
		setLogs(logsRes.logs || []);
	} catch (e) {
		setToast({ type: 'error', message: 'Failed to load data' });
	}
	setLoading(false);
};

useEffect(() => { fetchAll(); }, []);

// --- Action handlers ---
const handleApprove = async (proId: string) => {
	setActionLoading(true);
	const res = await fetch('/api/admin/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ proId }) }).then(r => r.json());
	if (res.ok) { setToast({ type: 'success', message: 'Professional approved!' }); fetchAll(); }
	else setToast({ type: 'error', message: res.error || 'Failed to approve' });
	setActionLoading(false);
};
const handleDeactivate = async (userId: string, active: boolean) => {
	setActionLoading(true);
	const res = await fetch('/api/admin/deactivate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, active }) }).then(r => r.json());
	if (res.ok) { setToast({ type: 'success', message: active ? 'User activated' : 'User deactivated' }); fetchAll(); }
	else setToast({ type: 'error', message: res.error || 'Failed to update user' });
	setActionLoading(false);
};
const handleResetPassword = async (email: string) => {
	setActionLoading(true);
	const res = await fetch('/api/admin/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) }).then(r => r.json());
	if (res.ok) setToast({ type: 'success', message: 'Password reset link sent!' });
	else setToast({ type: 'error', message: res.error || 'Failed to reset password' });
	setActionLoading(false);
};

return (
	<div className="min-h-screen bg-gray-50">
		{/* Header */}
		<header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
			<div className="flex items-center gap-2">
				<span className="font-bold text-2xl text-blue-700">FixEasy</span>
				<span className="ml-4 text-lg font-semibold">Admin Dashboard</span>
			</div>
			<div className="flex items-center gap-4">
				<Button variant="outline" size="icon" asChild>
					<Link href="/logout" title="Logout"><LogOut className="w-5 h-5" /></Link>
				</Button>
			</div>
		</header>

		{/* Toast */}
		{toast && (
			<div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>{toast.message}</div>
		)}

		{/* Summary Cards */}
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-6">
			{["Total Users", "Total Professionals", "Total Bookings", "Total Payments"].map((label, i) => (
				<Card key={label} className="card flex flex-col items-center justify-center">
					<CardHeader className="flex flex-row items-center gap-2">
						{summaryIcons[i]}
						<CardTitle className="text-base font-semibold">{label}</CardTitle>
					</CardHeader>
					<CardContent className="text-3xl font-bold">{Object.values(stats)[i]}</CardContent>
				</Card>
			))}
		</div>

		{/* Tabs / Side Menu */}
		<div className="flex flex-col md:flex-row gap-6 px-6 pb-8">
			<Tabs value={tab} onValueChange={setTab} className="w-full">
				<TabsList className="flex md:flex-col md:w-48 bg-white rounded-2xl shadow p-2 mb-4 md:mb-0">
					{tabs.map((t) => (
						<TabsTrigger key={t.value} value={t.value} className="flex items-center gap-2 w-full justify-start">
							{t.icon} {t.label}
						</TabsTrigger>
					))}
				</TabsList>

				{/* Professionals Table */}
				<TabsContent value="professionals">
					<div className="card">
						<div className="flex justify-between items-center mb-2">
							<h2 className="font-semibold text-lg">Professionals</h2>
							<Button variant="default" onClick={fetchAll} disabled={loading}>Reload</Button>
						</div>
						<div className="overflow-x-auto">
							<table className="min-w-full text-sm">
								<thead>
									<tr className="font-semibold text-gray-700 border-b">
										<th>Name</th><th>Email</th><th>Trade</th><th>Status</th><th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{loading ? (
										<tr><td colSpan={5} className="text-center py-6 text-gray-400">Loading…</td></tr>
									) : professionals.length === 0 ? (
										<tr><td colSpan={5} className="text-center py-6 text-gray-400">No professionals yet.</td></tr>
									) : professionals.map((p: any) => (
										<tr key={p.id}>
											<td>{p.full_name}</td>
											<td>{p.email}</td>
											<td>{p.trade}</td>
											<td><span className={`px-2 py-1 rounded text-xs ${p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : p.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>{p.status}</span></td>
											<td className="flex gap-2">
												{p.status === 'pending' && <Button size="sm" variant="default" disabled={actionLoading} onClick={() => handleApprove(p.id)}>Approve</Button>}
												<Button size="sm" variant="destructive" disabled={actionLoading} onClick={() => handleDeactivate(p.profile_id, false)}>Deactivate</Button>
												<Button size="sm" variant="secondary" disabled={actionLoading} onClick={() => handleResetPassword(p.email)}>Reset Password</Button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</TabsContent>

				{/* Clients Table */}
				<TabsContent value="clients">
					<div className="card">
						<div className="flex justify-between items-center mb-2">
							<h2 className="font-semibold text-lg">Clients</h2>
							<Button variant="default" onClick={fetchAll} disabled={loading}>Reload</Button>
						</div>
						<div className="overflow-x-auto">
							<table className="min-w-full text-sm">
								<thead>
									<tr className="font-semibold text-gray-700 border-b">
										<th>Name</th><th>Email</th><th>Status</th><th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{loading ? (
										<tr><td colSpan={4} className="text-center py-6 text-gray-400">Loading…</td></tr>
									) : clients.length === 0 ? (
										<tr><td colSpan={4} className="text-center py-6 text-gray-400">No clients yet.</td></tr>
									) : clients.map((c: any) => (
										<tr key={c.id}>
											<td>{c.full_name}</td>
											<td>{c.email}</td>
											<td><span className={`px-2 py-1 rounded text-xs ${c.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>{c.active ? 'Active' : 'Inactive'}</span></td>
											<td className="flex gap-2">
												<Button size="sm" variant={c.active ? 'destructive' : 'default'} disabled={actionLoading} onClick={() => handleDeactivate(c.id, !c.active)}>{c.active ? 'Deactivate' : 'Activate'}</Button>
												<Button size="sm" variant="secondary" disabled={actionLoading} onClick={() => handleResetPassword(c.email)}>Reset Password</Button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</TabsContent>

				{/* Bookings Table */}
				<TabsContent value="bookings">
					<div className="card">
						<div className="flex justify-between items-center mb-2">
							<h2 className="font-semibold text-lg">Bookings</h2>
							<Button variant="default" onClick={fetchAll} disabled={loading}>Reload</Button>
						</div>
						<div className="overflow-x-auto">
							<table className="min-w-full text-sm">
								<thead>
									<tr className="font-semibold text-gray-700 border-b">
										<th>Client</th><th>Professional</th><th>Service</th><th>Status</th><th>Amount</th><th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{loading ? (
										<tr><td colSpan={6} className="text-center py-6 text-gray-400">Loading…</td></tr>
									) : bookings.length === 0 ? (
										<tr><td colSpan={6} className="text-center py-6 text-gray-400">No bookings yet.</td></tr>
									) : bookings.map((b: any) => (
										<tr key={b.id}>
											<td>{b.client_name}</td>
											<td>{b.professional_name}</td>
											<td>{b.service}</td>
											<td><span className={`px-2 py-1 rounded text-xs ${b.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : b.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>{b.status}</span></td>
											<td>{b.amount}</td>
											<td className="flex gap-2">
												<Button size="sm" variant="secondary" disabled={actionLoading} onClick={() => handleResetPassword(b.client_email)}>Reset Client Password</Button>
												<Button size="sm" variant="secondary" disabled={actionLoading} onClick={() => handleResetPassword(b.professional_email)}>Reset Pro Password</Button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</TabsContent>

				{/* Payments Table */}
				<TabsContent value="payments">
					<div className="card">
						<div className="flex justify-between items-center mb-2">
							<h2 className="font-semibold text-lg">Payments</h2>
							<Button variant="default" onClick={fetchAll} disabled={loading}>Reload</Button>
						</div>
						<div className="overflow-x-auto">
							<table className="min-w-full text-sm">
								<thead>
									<tr className="font-semibold text-gray-700 border-b">
										<th>Booking ID</th><th>Amount</th><th>Status</th><th>Date</th>
									</tr>
								</thead>
								<tbody>
									{loading ? (
										<tr><td colSpan={4} className="text-center py-6 text-gray-400">Loading…</td></tr>
									) : payments.length === 0 ? (
										<tr><td colSpan={4} className="text-center py-6 text-gray-400">No payments yet.</td></tr>
									) : payments.map((p: any) => (
										<tr key={p.id}>
											<td>{p.booking_id}</td>
											<td>{p.amount}</td>
											<td><span className={`px-2 py-1 rounded text-xs ${p.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>{p.status}</span></td>
											<td>{p.created_at ? new Date(p.created_at).toLocaleString() : ''}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</TabsContent>

				{/* Activity Logs Table */}
				<TabsContent value="logs">
					<div className="card">
						<div className="flex justify-between items-center mb-2">
							<h2 className="font-semibold text-lg">Activity Logs</h2>
							<Button variant="default" onClick={fetchAll} disabled={loading}>Reload</Button>
						</div>
						<div className="overflow-x-auto">
							<table className="min-w-full text-sm">
								<thead>
									<tr className="font-semibold text-gray-700 border-b">
										<th>Action</th><th>User</th><th>Timestamp</th>
									</tr>
								</thead>
								<tbody>
									{loading ? (
										<tr><td colSpan={3} className="text-center py-6 text-gray-400">Loading…</td></tr>
									) : logs.length === 0 ? (
										<tr><td colSpan={3} className="text-center py-6 text-gray-400">No logs yet.</td></tr>
									) : logs.map((l: any) => (
										<tr key={l.id}>
											<td>{l.action}</td>
											<td>{l.user_email}</td>
											<td>{l.timestamp ? new Date(l.timestamp).toLocaleString() : ''}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	</div>
);
}