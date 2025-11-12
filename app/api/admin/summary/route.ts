import { NextResponse } from "next/server";

// Ensure this route is always executed at runtime (we proxy to a live backend)
export const dynamic = "force-dynamic";

// Proxy /api/admin/summary -> backend /admin/summary
// Exports a named GET handler required by Next's App Router.
export async function GET() {
    const backend = (process.env.NEXT_PUBLIC_API_URL || "https://api.fixeasy.irish").replace(/\/$/, "");
    try {
        const res = await fetch(`${backend}/admin/summary`, { method: "GET", cache: "no-store" });
        const text = await res.text().catch(() => "");
        // Try to parse JSON, but forward raw text if parsing fails
        try {
            const json = JSON.parse(text || "null");
            return NextResponse.json(json, { status: res.status });
        } catch {
            return NextResponse.json({ raw: text }, { status: res.status });
        }
    } catch (err) {
        console.error("[api/admin/summary] Failed to reach backend", err);
        return NextResponse.json({ error: "Unable to reach backend" }, { status: 502 });
    }
}
