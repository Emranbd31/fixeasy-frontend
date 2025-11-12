import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter (per-IP). This is intentionally lightweight
// and works for single-process deployments. It prevents brute-force login
// attempts at the proxy layer before forwarding to the backend.
const RATE_LIMIT_MAP: Map<string, number[]> = new Map();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 60 seconds

const DEFAULT_BACKEND_URL = "https://api.fixeasy.irish";

function resolveBackendUrl(): string {
  const candidates = [
    process.env.BACKEND_URL,
    process.env.NEXT_PUBLIC_API_BASE_URL,
    process.env.NEXT_PUBLIC_API_URL,
  ];

  // During local development prefer a localhost backend if available.
  // This helps when you run the backend on port 8000 locally.
  if (process.env.NODE_ENV !== "production") {
    candidates.push("http://127.0.0.1:8000");
    candidates.push("http://localhost:8000");
  }

  // Fallback to the production API if nothing else is configured
  candidates.push(DEFAULT_BACKEND_URL);

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

  return DEFAULT_BACKEND_URL;
}

export async function POST(request: NextRequest) {
  // Rate limit by client IP (X-Forwarded-For or fallback)
  try {
    const xff = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    // Use only the first IP in X-Forwarded-For list
    const clientIp = (xff || "unknown").split(",")[0].trim();
    const now = Date.now();
    const arr = RATE_LIMIT_MAP.get(clientIp) || [];
    // prune old timestamps
    const recent = arr.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
    if (recent.length >= RATE_LIMIT_MAX) {
      return NextResponse.json({ error: "Too many login attempts" }, { status: 429 });
    }
    recent.push(now);
    RATE_LIMIT_MAP.set(clientIp, recent);
  } catch (e) {
    // if rate limiter fails, allow the request to proceed
  }
  try {
    const backendUrl = resolveBackendUrl();
    const rawBody = await request.text();

    console.info("[admin/login] Using backend URL", backendUrl);
    console.info("[admin/login] Raw request body", rawBody);

    // Playwright/local test shim: when PLAYWRIGHT_TEST=1 is set we accept
    // the supplied credentials locally and return a test token without
    // forwarding to the remote backend. This keeps E2E tests hermetic and
    // avoids depending on an externally-hosted admin account.
    if (process.env.PLAYWRIGHT_TEST === "1") {
      try {
        const contentType = request.headers.get("content-type") ?? "";
        let parsed: any = null;
        if (contentType.includes("application/json")) {
          parsed = JSON.parse(rawBody || "{}");
        } else {
          // parse x-www-form-urlencoded into an object
          parsed = Object.fromEntries(new URLSearchParams(rawBody || ""));
        }
        const username = (parsed.username ?? parsed.email ?? "").toString().trim();
        const password = (parsed.password ?? "").toString().trim();
        if (!username || !password) {
          return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
        }

        // If ADMIN_USER/ADMIN_PASS are provided in env, enforce them in the shim,
        // otherwise accept any non-empty credentials.
        const envUser = process.env.ADMIN_USER;
        const envPass = process.env.ADMIN_PASS;
        if (envUser && envPass) {
          if (username !== envUser && username.toLowerCase() !== envUser.toLowerCase()) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
          }
          if (password !== envPass) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
          }
        }

        const testToken = "playwright-test-token";
        const payload = { access_token: testToken, token: testToken };
        const reply = NextResponse.json(payload, { status: 200 });
        // Set a cookie to emulate production behavior (not secure in dev)
        reply.cookies.set("fixeasy_admin_token", testToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 60 * 60,
          path: "/",
        });
        return reply;
      } catch (shimErr) {
        console.error("[admin/login] Playwright shim parse error", shimErr);
        return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
      }
    }

    if (!rawBody) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const contentType = request.headers.get("content-type") ?? "application/json";

    let forwardHeaders: Record<string, string>;
    let forwardBody: BodyInit;

    if (contentType.includes("application/json")) {
      // If client sent JSON, forward JSON to backend as JSON.
      try {
        const parsed = JSON.parse(rawBody || "{}");
        const username = (parsed.username ?? parsed.email ?? "").toString().trim();
        const password = (parsed.password ?? "").toString().trim();

        if (!username || !password) {
          return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
        }

  // Preserve compatibility but forward `email` to backends that expect it.
  // Use parsed.email when present; otherwise treat `username` as the email field.
  const email = (parsed.email ?? username).toString().trim();
  const payload = { email, password };
        forwardBody = JSON.stringify(payload);
        forwardHeaders = { "Content-Type": "application/json" };
      } catch (jsonError) {
        console.error("[admin/login] Failed to parse JSON body", jsonError);
        return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
      }
    } else {
      // Non-JSON content types are forwarded as-is.
      forwardHeaders = { "Content-Type": contentType };
      forwardBody = rawBody;
    }

    let response: Response;
    try {
      response = await fetch(`${backendUrl}/admin/login`, {
        method: "POST",
        cache: "no-store",
        headers: forwardHeaders,
        body: forwardBody,
      });
    } catch (fetchError) {
      console.error("[admin/login] Failed to reach backend", fetchError);
      return NextResponse.json({ error: "Admin service unavailable" }, { status: 503 });
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

    if (response.status === 401) {
      return NextResponse.json(payload ?? { error: "Invalid credentials" }, { status: 401 });
    }

    if (!response.ok || !payload) {
      const message = payload?.detail ?? payload?.error ?? "Unable to process login";
      return NextResponse.json({ error: message }, { status: response.status || 500 });
    }

    // Support different backend token field names (some backends return `access_token`)
    const token = payload?.token ?? payload?.access_token ?? payload?.accessToken ?? payload?.accessToken;
    if (!token) {
      return NextResponse.json({ error: "Login failed" }, { status: 500 });
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

    reply.cookies.set("fixeasy_admin_token", token, cookieOptions);
    return reply;
  } catch (error) {
    console.error("[admin/login] Unexpected error", error);
    const message = error instanceof Error ? error.message : "Unable to process login";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
