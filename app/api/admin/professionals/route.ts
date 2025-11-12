import { NextResponse } from "next/server";

const BACKEND = (process.env.NEXT_PUBLIC_API_URL || "https://api.fixeasy.irish").trim();

export async function GET(req: Request) {
    try {
        const url = `${BACKEND}/admin/professionals` + (req.url.includes("?") ? new URL(req.url).search : "");
        const headers: Record<string, string> = {};
        const auth = req.headers.get("authorization");
        if (auth) headers["authorization"] = auth;

        const res = await fetch(url, { method: "GET", headers });
        const payload = await res.json().catch(() => ({}));
        return NextResponse.json(payload, { status: res.status });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 });
    }
}
