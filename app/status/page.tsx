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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const backendStatusUrl =
      process.env.NEXT_PUBLIC_BACKEND_STATUS_URL ??
      "https://fixeasy-backend.onrender.com/status";

    fetch(backendStatusUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) {
          setBackend(STATUS.FAIL);
          return;
        }

        const text = await res.text().catch(() => "");
        if (!text) {
          setBackend(STATUS.OK);
          return;
        }

        let healthy = false;

        try {
          const data = JSON.parse(text);
          healthy = isBackendHealthy(data);
        } catch {
          healthy = isMessageHealthy(text);
        }

        if (!healthy) {
          healthy = isMessageHealthy(text);
        }

        setBackend(healthy ? STATUS.OK : STATUS.FAIL);
      })
      .catch(() => setBackend(STATUS.FAIL))
      .finally(() => {
        clearTimeout(timeout);
      });
    // Check Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      fetch(supabaseUrl + "/rest/v1/", { method: "GET" })
        .then((res) => {
          // Supabase returns 401 Unauthorized if endpoint exists but no auth
          if (res.status === 200 || res.status === 401) {
            setSupabase(STATUS.OK);
          } else {
            setSupabase(STATUS.FAIL);
          }
        })
        .catch(() => setSupabase(STATUS.FAIL));
    } else {
      setSupabase(STATUS.FAIL);
    }
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
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

function isBackendHealthy(payload: unknown): boolean {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const record = payload as Record<string, unknown>;

  if (typeof record.ok === "boolean" && record.ok) {
    return true;
  }

  if (typeof record.healthy === "boolean" && record.healthy) {
    return true;
  }

  if (typeof record.status === "string" && isMessageHealthy(record.status)) {
    return true;
  }

  if (typeof record.message === "string" && isMessageHealthy(record.message)) {
    return true;
  }

  return false;
}

function isMessageHealthy(value: string): boolean {
  const normalized = value.toLowerCase();
  return ["backend active", "backend is live", "ok", "healthy"].some((token) =>
    normalized.includes(token),
  );
}
