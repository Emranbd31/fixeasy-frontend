"use client";

import Link from "next/link";

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 p-8">
      <nav className="mb-8 flex gap-4 border-b pb-4">
        <Link href="/admin/dashboard" className="font-bold text-blue-600">Dashboard</Link>
        <Link href="/admin/users" className="text-gray-600 hover:text-blue-600">Users</Link>
        <Link href="/admin/services" className="text-gray-600 hover:text-blue-600">Services</Link>
        <Link href="/admin/reports" className="text-gray-600 hover:text-blue-600">Reports</Link>
        <Link href="/admin/settings" className="text-gray-600 hover:text-blue-600">Settings</Link>
      </nav>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-blue-50 dark:bg-slate-800 rounded-xl p-6 shadow text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">--</div>
          <div className="text-gray-700 dark:text-gray-200 font-semibold">Total Users</div>
        </div>
        <div className="bg-green-50 dark:bg-slate-800 rounded-xl p-6 shadow text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">--</div>
          <div className="text-gray-700 dark:text-gray-200 font-semibold">Active Professionals</div>
        </div>
        <div className="bg-purple-50 dark:bg-slate-800 rounded-xl p-6 shadow text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">--</div>
          <div className="text-gray-700 dark:text-gray-200 font-semibold">Total Bookings</div>
        </div>
      </section>
      <section className="bg-white dark:bg-slate-800 rounded-xl shadow p-8 min-h-[300px] flex flex-col items-center justify-center">
        <div className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">Charts & Analytics</div>
        <div className="text-gray-400">[Charts/graphs placeholder]</div>
      </section>
    </main>
  );
}
