"use client";
import { useEffect, useState } from "react";

const STATUS = {
  OK: "✅ Live",
  FAIL: "❌ Down",
};

export default function StatusPage() {
  const [backend, setBackend] = useState<string>("Checking...");
  const [supabase, setSupabase] = useState<string>("Checking...");

  useEffect(() => {
    // Check backend
    fetch("https://fixeasy-backend.onrender.com", { method: "HEAD" })
      .then((res) => setBackend(res.ok ? STATUS.OK : STATUS.FAIL))
      .catch(() => setBackend(STATUS.FAIL));
    // Check Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      fetch(supabaseUrl + "/rest/v1/", { method: "HEAD" })
        .then((res) => setSupabase(res.ok ? STATUS.OK : STATUS.FAIL))
        .catch(() => setSupabase(STATUS.FAIL));
    } else {
      setSupabase(STATUS.FAIL);
    }
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6">FixEasy System Status</h1>
        <div className="space-y-4">
          <div className="flex justify-between text-lg">
            <span>Frontend</span>
            <span>{STATUS.OK}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span>Backend</span>
            <span>{backend}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span>Supabase</span>
            <span>{supabase}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
