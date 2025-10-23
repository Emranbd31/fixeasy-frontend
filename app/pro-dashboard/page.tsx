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

    return (
        <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-4">Pro Dashboard</h1>
                {verified === false && (
                    <div className="mb-6 p-4 rounded-xl border-2 border-yellow-300 bg-yellow-50 text-yellow-800">
                        Waiting for verification – your documents are under review. ✅ We'll email you when you're approved.
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow border border-gray-100">
                        <h2 className="font-bold mb-2">Profile</h2>
                        <p>Name: {name || "—"}</p>
                        <Link className="text-blue-600 text-sm" href="/register/professional">Update documents</Link>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow border border-gray-100">
                        <h2 className="font-bold mb-2">Job Requests</h2>
                        <p>Coming soon: Accept / Reject / Schedule.</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow border border-gray-100">
                        <h2 className="font-bold mb-2">Calendar</h2>
                        <p>Coming soon: Manage availability.</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow border border-gray-100">
                        <h2 className="font-bold mb-2">Earnings</h2>
                        <p>Coming soon: Stripe Connect payouts.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
