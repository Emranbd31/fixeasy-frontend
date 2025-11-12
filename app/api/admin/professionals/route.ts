import { NextResponse } from "next/server";

const __RAW_API = (process.env.NEXT_PUBLIC_API_URL || "https://api.fixeasy.irish").toString().replace(/[\r\n]+/g, "").replace(/\s+/g, "").trim();
let BACKEND = __RAW_API;
const originMatch = __RAW_API.match(/^(https?:\/\/[^\/\s]+)(?:\/.*)?$/i);
if (originMatch) {
    BACKEND = originMatch[1];
} else {
    try {
        BACKEND = new URL(__RAW_API).origin;
    } catch (e) {
        BACKEND = __RAW_API.replace(/\/+$/, "");
    }
}

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
