import { NextRequest, NextResponse } from "next/server";

const DEFAULT_BACKEND_URL = "https://api.fixeasy.irish";

function resolveBackendUrl(): string {
  // Prefer explicit environment overrides. Do not implicitly assume a localhost backend
  // unless the developer sets BACKEND_URL or NEXT_PUBLIC_API_URL in their .env.local.
  const candidates = [process.env.BACKEND_URL, process.env.NEXT_PUBLIC_API_URL, process.env.NEXT_PUBLIC_API_BASE_URL];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const sanitized = candidate.trim().split(/\s+/)[0].replace(/\/$/, "");
    try {
      const { origin, pathname } = new URL(sanitized.startsWith("http") ? sanitized : `https://${sanitized}`);
      return pathname === "/" ? origin : `${origin}${pathname}`.replace(/\/$/, "");
    } catch {
      continue;
    }
  }

  // Fallback to the production API if nothing else is configured
  // For local development restore the old behaviour: prefer a local mock at 127.0.0.1:8000
  // if no explicit BACKEND_URL is configured. This mirrors the previous, working
  // configuration used during the V1 admin flows.
  if (process.env.NODE_ENV !== "production") {
    return "http://127.0.0.1:8000";
  }

  return DEFAULT_BACKEND_URL;
}

export async function POST(request: NextRequest) {
  try {
    const backendUrl = resolveBackendUrl();
    const rawBody = await request.text();

    console.info("[admin/login] Using backend URL", backendUrl);
    console.info("[admin/login] Raw request body", rawBody);

    if (!rawBody) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const contentType = request.headers.get("content-type") ?? "application/json";

    // Extract credentials in a robust way so we can always send form-urlencoded to FastAPI backend
    let email = "";
    let password = "";

    if (contentType.includes("application/json")) {
      try {
        const parsed = JSON.parse(rawBody || "{}");
        email = (parsed.username ?? parsed.email ?? "").toString().trim();
        password = (parsed.password ?? "").toString().trim();
      } catch (jsonError) {
        console.error("[admin/login] Failed to parse JSON body", jsonError);
        return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
      }
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      try {
        const params = new URLSearchParams(rawBody);
        email = (params.get("username") ?? params.get("email") ?? "").toString().trim();
        password = (params.get("password") ?? "").toString().trim();
      } catch (e) {
        console.error("[admin/login] Failed to parse form body", e);
      }
    } else {
      // Fallback: try to parse as JSON, otherwise leave empty and let the backend respond
      try {
        const parsed = JSON.parse(rawBody || "{}");
        email = (parsed.username ?? parsed.email ?? "").toString().trim();
        password = (parsed.password ?? "").toString().trim();
      } catch {}
    }

    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    // Send JSON to match the backend's expected payload shape (AdminLoginRequest)
  const backendPayload = { email, password };

    let response: Response;
    try {
      response = await fetch(`${backendUrl}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(backendPayload),
      });
    } catch (fetchError) {
      console.error("[admin/login] Failed to reach backend", fetchError);
      // Return a friendly, consistent error when the backend cannot be reached.
      return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
    }

    const responseBody = await response.text();
    console.info("[admin/login] Backend response", {
      status: response.status,
      body: responseBody.slice(0, 500),
    });

    let payload: any = null;
    try {
      payload = JSON.parse(responseBody);
    } catch {
      payload = null;
    }

    // In development, log which top-level keys the backend returned so we can
    // quickly detect token field name mismatches (e.g. `token` vs `access_token`).
    if (process.env.NODE_ENV !== "production" && payload && typeof payload === "object") {
      try {
        const keys = Object.keys(payload).slice(0, 20);
        console.info("[admin/login] Backend payload keys:", keys);
      } catch {}
    }

    if (response.status === 401) {
      return NextResponse.json(payload ?? { error: "Invalid credentials" }, { status: 401 });
    }

    if (!response.ok || !payload) {
      const message = payload?.detail ?? payload?.error ?? "Unable to process login";
      return NextResponse.json({ error: message }, { status: response.status || 500 });
    }

    // Support different backend token field names (some backends return `access_token`, `jwt`, or nested session objects)
    const token =
      payload?.token ??
      payload?.access_token ??
      payload?.accessToken ??
      payload?.jwt ??
      payload?.id_token ??
      payload?.data?.token ??
      payload?.data?.access_token ??
      payload?.session?.access_token ??
      payload?.session?.token ??
      null;

    // If the backend set a cookie in its response (Set-Cookie header), try to extract a token
    // from that header and use it as fallback. This covers backends that set auth cookies
    // instead of returning JSON token fields.
    let cookieToken: string | null = null;
    try {
      const setCookieRaw = response.headers.get("set-cookie") || response.headers.get("Set-Cookie");
      if (setCookieRaw) {
        // Try to find a cookie-looking value (name=value) and prefer known names.
        // Look for fixeasy_admin_token, token, access_token, jwt
        const matches = Array.from(setCookieRaw.matchAll(/(?:^|,|;)?\s*(?<name>[^=;\s]+)=(?<val>[^;\s]+)/gi));
        for (const m of matches) {
          const n = (m.groups && m.groups['name']) || '';
          const v = (m.groups && m.groups['val']) || '';
          const lowered = n.toLowerCase();
          if (['fixeasy_admin_token', 'token', 'access_token', 'jwt', 'id_token'].includes(lowered)) {
            cookieToken = v;
            break;
          }
          if (!cookieToken && v && v.length > 10) {
            // keep a candidate if nothing matched yet
            cookieToken = v;
          }
        }
      }
    } catch (e) {
      console.error('[admin/login] Failed to parse Set-Cookie header', e);
    }

    const finalToken = token ?? cookieToken;
    if (!finalToken) {
      return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }

    const reply = NextResponse.json(payload, { status: response.status });
    const cookieOptions: {
      httpOnly: boolean;
      secure: boolean;
      sameSite: "lax" | "strict" | "none";
      maxAge: number;
      path: string;
      domain?: string;
    } = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    };

    if (process.env.NODE_ENV === "production") {
      cookieOptions.secure = true;
      cookieOptions.sameSite = "none";
      cookieOptions.domain = ".fixeasy.irish";
    }

  reply.cookies.set("fixeasy_admin_token", finalToken, cookieOptions);
    // In development, log a truncated token preview and the cookie options so local runs can confirm
    // the server-side handler is actually setting the cookie. Avoid printing full tokens in logs.
    if (process.env.NODE_ENV !== "production") {
      try {
        const preview = typeof token === "string" ? `${token.slice(0, 6)}...` : "(non-string)";
        console.info("[admin/login] Set cookie fixeasy_admin_token (preview):", preview);
        console.info("[admin/login] Cookie options:", cookieOptions);
      } catch {}
    }
    return reply;
  } catch (error) {
    console.error("[admin/login] Unexpected error", error);
    const message = error instanceof Error ? error.message : "Unable to process login";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  // Simple status endpoint so clients and health checks can confirm the route exists.
  return NextResponse.json({ ok: true });
}

