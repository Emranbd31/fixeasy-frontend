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

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Client Dashboard</h1>
        <p>Welcome! Booking management coming soon.</p>
      </div>
    </main>
  );
}
