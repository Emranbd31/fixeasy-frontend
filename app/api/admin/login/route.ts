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
    if (process.env.NODE_ENV !== "production" && process.env.DISABLE_RATE_LIMIT === "1") {
      try {
        console.info("[admin/login] Rate-limit bypass active in dev mode");
      } catch {}
    } else {
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
    }
  } catch (e) {
    // if rate limiter fails, allow the request to proceed
  }
  try {
    const backendUrl = resolveBackendUrl();
    const rawBody = await request.text();

    // Sanitize the raw request body before logging to avoid leaking passwords
    function sanitizeRequestBody(body: string) {
      if (!body) return "";
      try {
        // Try parse JSON and redact common password keys
        const parsed = JSON.parse(body);
        const pwdKeys = ["password", "pass", "pwd"];
        function walkAndRedact(obj: any) {
          if (!obj || typeof obj !== "object") return;
          for (const k of Object.keys(obj)) {
            try {
              if (pwdKeys.includes(k)) obj[k] = "[REDACTED]";
              else walkAndRedact(obj[k]);
            } catch {}
          }
        }
        walkAndRedact(parsed);
        return JSON.stringify(parsed);
      } catch {
        // Fallback: redact common patterns in urlencoded or plaintext
        try {
          let s = body.replace(/password=([^&\s]+)/gi, 'password=[REDACTED]');
          s = s.replace(/("?password"?\s*:\s*")([^"]+)(")/gi, '$1[REDACTED]$3');
          return s;
        } catch {
          return body.slice(0, 500) + (body.length > 500 ? '...[truncated]' : '');
        }
      }
    }

    console.info("[admin/login] Using backend URL", backendUrl);
    console.info("[admin/login] Raw request body", sanitizeRequestBody(rawBody));

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
        // Return a small shim payload compatible with tests (includes redirect)
        const payload = {
          ok: true,
          message: "Test login successful (shim)",
          token: testToken,
          access_token: testToken,
          redirect: "/admin/dashboard",
        };
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
      // If client sent JSON, forward as JSON to the backend and normalize
      // `username` -> `email` for backends that expect an email field.
      try {
        const parsed = JSON.parse(rawBody || "{}");
        const username = (parsed.username ?? parsed.email ?? parsed.email_address ?? "").toString().trim();
        const password = (parsed.password ?? "").toString().trim();

        if (!username || !password) {
          return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
        }

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

    // Helper to produce a redacted, short snippet of response body.
    function redactBodySnippet(body: string) {
      if (!body) return "";
      // Try to parse JSON and redact common sensitive keys
      try {
        const parsed = JSON.parse(body);
        const keysToRedact = ["password", "pass", "pwd", "token", "access_token", "accessToken", "jwt"];
        function walk(obj: any) {
          if (!obj || typeof obj !== "object") return;
          for (const k of Object.keys(obj)) {
            try {
              if (keysToRedact.includes(k)) {
                obj[k] = "[REDACTED]";
              } else {
                walk(obj[k]);
              }
            } catch {}
          }
        }
        walk(parsed);
        const s = JSON.stringify(parsed);
        return s.length > 200 ? s.slice(0, 200) + "...[truncated]" : s;
      } catch {
        // If not JSON, remove obvious password/token patterns from plaintext
        try {
          let sanitized = body.replace(/("?password"?\s*:\s*")([^"]+)(")/gi, '$1[REDACTED]$3');
          sanitized = sanitized.replace(/("?(?:access_token|token|jwt)"?\s*:\s*")([^"]+)(")/gi, '$1[REDACTED]$3');
          sanitized = sanitized.replace(/password=([^&\s]+)/gi, 'password=[REDACTED]');
          return sanitized.length > 200 ? sanitized.slice(0, 200) + "...[truncated]" : sanitized;
        } catch {
          return body.slice(0, 200) + (body.length > 200 ? "...[truncated]" : "");
        }
      }
    }

    // Log proxying action and headers being forwarded (only keys, no values)
    try {
      console.info("[admin/login] Proxying admin/login to:", `${backendUrl}/admin/login`);
      console.info("[admin/login] Forward headers:", Object.keys(forwardHeaders || {}));
    } catch (logErr) {
      // Do not block on logging
    }

    // Helper that wraps fetch with a small retry policy.
    async function fetchWithRetry(url: string, options: RequestInit, maxAttempts = 2, backoffMs = 300): Promise<Response> {
      let lastError: any = null;
      const startAll = Date.now();
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const attemptStart = Date.now();
        try {
          const res = await fetch(url, options);
          // If backend returned a retryable status and we have more attempts left, retry.
          if ((res.status === 401 || res.status === 502) && attempt < maxAttempts) {
            try {
              console.info(`[admin/login] Retry attempt ${attempt} after status ${res.status}`);
            } catch {}
            // short backoff before retrying
            await new Promise((r) => setTimeout(r, backoffMs));
            // continue to next attempt; keep the last response in case both fail
            lastError = null;
            // store intermediate response? we do not consume body here
            continue;
          }

          // attach total duration (across attempts) to the response for logging
          (res as any)._fetchDurationMs = Date.now() - startAll;
          return res;
        } catch (err: any) {
          lastError = err;
          if (attempt < maxAttempts) {
            try {
              console.info(`[admin/login] Retry attempt ${attempt} after error ${err?.message ?? String(err)}`);
            } catch {}
            await new Promise((r) => setTimeout(r, backoffMs));
            continue;
          }
          // no more attempts
          break;
        }
      }

      // If we have a lastError (network-level) then throw it so caller handles as before.
      if (lastError) throw lastError;

      // If we fell through without a lastError it means we saw retryable responses but exhausted attempts.
      // Make one final non-retry fetch to return the last response (so caller can inspect status/body)
      const finalRes = await fetch(url, options);
      (finalRes as any)._fetchDurationMs = Date.now() - startAll;
      return finalRes;
    }

    let response: Response;
    try {
      response = await fetchWithRetry(`${backendUrl}/admin/login`, {
        method: "POST",
        cache: "no-store",
        headers: forwardHeaders,
        body: forwardBody,
        // allow the runtime to attempt to keep the connection alive for in-flight requests
        keepalive: true,
      }, 2, 300);
    } catch (fetchError: any) {
      // Log fetch error message and stack (redacted) but avoid printing request body or secrets
      try {
        console.error("[admin/login] Failed to reach backend", {
          message: fetchError?.message ?? String(fetchError),
          stack: fetchError?.stack?.split("\n").slice(0, 3).join(" | ") ?? undefined,
        });
      } catch {}
      return NextResponse.json({ error: "Admin service unavailable" }, { status: 503 });
    }

    const responseBody = await response.text();
    try {
      const duration = (response as any)?._fetchDurationMs ?? null;
      console.info("[admin/login] Backend response:", {
        status: response.status,
        ok: response.ok,
        durationMs: duration,
        bodySnippet: redactBodySnippet(responseBody),
      });
    } catch (logErr) {
      // ignore logging errors
    }

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
