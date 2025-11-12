"use client";
import React, { useEffect, useState } from "react";

export default function HealthMonitor() {
    const [state, setState] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        function normalizeStatus(v: any) {
            if (!v) return "DOWN";
            // Accept strings like "UP", "OK", "OKAY", or objects with truthy ok fields
            if (typeof v === "string") {
                const s = v.trim().toLowerCase();
                if (s === "up" || s === "ok" || s === "okay" || s === "available") return "UP";
                return "DOWN";
            }
            if (typeof v === "object") {
                // example: { ok: true } or { status: 'OK' }
                if (v.ok === true) return "UP";
                const maybe = (v.status || v.state || "").toString().toLowerCase();
                if (maybe === "up" || maybe === "ok" || maybe === "available") return "UP";
                return "DOWN";
            }
            return "DOWN";
        }

        async function load() {
            try {
                const res = await fetch("/api/admin/health", { cache: "no-store" });
                const payload = await res.json().catch(() => ({}));
                if (!mounted) return;
                // Normalize to expected shape even if backend returns unexpected data
                const checks = payload?.checks ?? {};
                setState({
                    checks: {
                        api: normalizeStatus(checks.api),
                        db: normalizeStatus(checks.db),
                    },
                    ts: payload?.ts ?? new Date().toISOString(),
                });
            } catch (e) {
                if (!mounted) return;
                setState({ error: "Failed to fetch health", checks: { api: "DOWN", db: "DOWN" }, ts: new Date().toISOString() });
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        const t = setInterval(load, 60_000);
        return () => {
            mounted = false;
            clearInterval(t);
        };
    }, []);

    if (loading) return <div className="rounded-lg border bg-white p-3">Checking health...</div>;

    return (
        <div className="rounded-lg border bg-white p-3">
            <h4 className="text-sm font-semibold">System Health</h4>
            <div className="mt-2 text-sm">
                <div>
                    <strong>DB:</strong>{" "}
                    {state?.checks?.db === "UP" ? <span className="text-green-600">🟢 UP</span> : <span className="text-red-600">🔴 DOWN</span>}
                </div>
                <div>
                    <strong>API:</strong>{" "}
                    {state?.checks?.api === "UP" ? <span className="text-green-600">🟢 UP</span> : <span className="text-red-600">🔴 DOWN</span>}
                </div>
                <div className="text-xs text-gray-500 mt-2">Last checked: {state?.ts ?? "-"}</div>
            </div>
        </div>
    );
}
