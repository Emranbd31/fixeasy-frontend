# Admin Repair Playbook (FixEasy)

This playbook captures the repeatable recovery steps for **admin.fixeasy.irish** issues (login/dashboard/API access), based on the current `fixeasy-frontend` codebase.

## 1) Problem patterns (what usually breaks)

### A) Admin subdomain shows: “Application error: a client-side exception…”
Most commonly caused by a **bad Vercel deployment** serving a client bundle built **without** required public env vars:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

These are injected at **build time**. If a deployment was built without them, the browser will crash even if server routes like `/api/health/env` look OK.

### B) Admin API calls return `401 Unauthorized`
Admin API routes under `app/api/admin/*` are protected by a shared secret header:
- Request header: `X-ADMIN-SECRET`
- Server env var: `ADMIN_SECRET`

If the header is missing or wrong, you’ll see `401`.

### C) “Backend is down” reports
The legacy backend base `https://api.fixeasy.irish` can return `200` at `/` but `404` at `/health`. So `/health` checks can look like an outage when the backend is actually live.

## 2) Where auth is enforced (current code)

- Cookie name used for browser admin session redirect: `fixeasy_admin_token`
  - Enforced in [middleware.ts](middleware.ts)
  - Only controls **redirect to /admin/login**; it does not grant access to the new App Router admin APIs

- Admin secret header guard:
  - Implemented by `requireAdminSecret()` in [lib/adminAuth.ts](lib/adminAuth.ts)
  - Used by:
    - [app/api/admin/bookings/route.ts](app/api/admin/bookings/route.ts)
    - [app/api/admin/professionals/route.ts](app/api/admin/professionals/route.ts)
    - [app/api/admin/approve/route.ts](app/api/admin/approve/route.ts)
    - [app/api/admin/activity/route.ts](app/api/admin/activity/route.ts)

## 3) Live checks (fast triage)

### A) Check admin host is served by Vercel
Run:
- `curl -I https://admin.fixeasy.irish/`

You should see headers like:
- `x-vercel-id: ...`
- `x-matched-path: /admin/login`

If not, DNS is likely pointing somewhere else.

### B) Check server has env (server-side)
- `https://admin.fixeasy.irish/api/health/env`

This confirms whether env vars exist on the server runtime, but it does **not** guarantee the client bundle was built with them.

### C) Check admin APIs with secret header
- `curl -H "X-ADMIN-SECRET: <ADMIN_SECRET>" https://admin.fixeasy.irish/api/admin/bookings`

Expected:
- `200` with JSON

If you get `401`, the env var `ADMIN_SECRET` is missing/mismatched in that Vercel project/environment.

## 4) Recovery flow (when admin is broken)

### Step 1 — Fix DNS first (if Vercel shows “DNS change recommended”)
In your DNS provider (GoDaddy):
- Ensure `admin.fixeasy.irish` is a **CNAME** to the exact Vercel recommended target
- Remove conflicting `A` / `AAAA` records for `admin`

This prevents intermittent routing to the wrong/old deployment.

### Step 2 — Fix Vercel env vars (build-time + runtime)
In the Vercel project that owns `admin.fixeasy.irish`:
- Set `NEXT_PUBLIC_SUPABASE_URL`
- Set `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Set `SUPABASE_SERVICE_ROLE_KEY` (server-only; required by admin APIs that use service-role)
- Set `ADMIN_SECRET` (required for `X-ADMIN-SECRET` guarded endpoints)

Make sure the env vars apply to the environment you’re actually serving (Production, and Preview if the HTML references `?dpl=...`).

### Step 3 — Redeploy
After env/DNS changes:
- Redeploy the project (Vercel UI “Redeploy” is enough)

Then hard-refresh in browser (or use incognito) to avoid stale cached JS.

## 5) Non-blocking admin activity (E2E note)
The endpoint [app/api/admin/activity/route.ts](app/api/admin/activity/route.ts) is treated as **non-blocking** by E2E tests (WARN on non-200). This is intentional because activity logs are optional.

## 6) Rollback plan
If a deployment is bad:
- Point `admin.fixeasy.irish` back to the last known-good deployment in Vercel (Domains/Aliases) and redeploy if needed.

## 7) Quick checklist
- DNS: `admin` CNAME matches Vercel recommendation; no conflicting records
- Vercel env (build time): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Vercel env (server): `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_SECRET`
- Admin API check: `X-ADMIN-SECRET` requests return `200`

Keep this file updated after future admin-related changes.

---

## Appendix: Emran’s manual (historical notes)

This section is kept verbatim as a reference snapshot.

# Admin Repair Playbook (Emran’s manual)

This document captures every step we took to fix the admin login/dashboard issues, plus a repeatable recovery plan.

## 1) Problem summary
- Admin login/dashboard returned 401 or failed because:
  - Next.js `cookies()` became async; token readers were sync.
  - Dashboard API calls used the public domain, so the admin cookie was not sent.
  - V3 UI toggle wasn’t wired to an env var and needed a safe fallback.

## 2) Fixed code (before/after highlights)

### lib/apiClient.ts — async token + header read
- **After (key parts)**:
```ts
export async function readAdminToken(req?: NextRequest | Request): Promise<string | null> {
  const header = req?.headers?.get('authorization') || req?.headers?.get('Authorization');
  if (header?.startsWith('Bearer ')) return header.slice('Bearer '.length);

  const requestCookie = readCookieFromRequest(req);
  if (requestCookie) return stripBearer(requestCookie);

  try {
    const storeMaybePromise = cookies() as any;
    const store = typeof storeMaybePromise?.then === 'function' ? await storeMaybePromise : storeMaybePromise;
    const getter = typeof store?.get === 'function' ? store.get.bind(store) : undefined;
    const value = getter ? getter(ADMIN_COOKIE_NAME)?.value ?? null : (store as any)?.[ADMIN_COOKIE_NAME] ?? null;
    if (value) return stripBearer(value);
  } catch {}

  return null;
}

export async function fetchAdminBackend<T = any>(path: string, init: RequestInit = {}, req?: NextRequest | Request) {
  const token = await readAdminToken(req);
  if (!token) return { ok: false, status: 401, data: { error: 'Unauthorized' } as T, text: '' };
  ...
  headers.set('Authorization', `Bearer ${token}`);
  ...
}
```

### lib/adminAuth.ts — async cookies() helpers
- **After (key parts)**:
```ts
export async function getAdminToken(): Promise<string | null> {
  try {
    const storeMaybePromise = cookies() as any;
    const store = typeof storeMaybePromise?.then === "function" ? await storeMaybePromise : storeMaybePromise;
    const raw = typeof store?.get === "function" ? store.get(ADMIN_COOKIE_NAME)?.value : (store as any)?.[ADMIN_COOKIE_NAME];
    if (!raw) return null;
    return raw.startsWith("Bearer ") ? raw.slice("Bearer ".length) : raw;
  } catch {
    return null;
  }
}

export async function getAdminAuthHeader(): Promise<{ Authorization: string } | Record<string, never>> {
  const token = await getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
```

### app/(admin)/admin/dashboard/page.tsx — host-aware base URL + V2/V3 switch + fallback
- **After (key parts)**:
```ts
async function resolveBaseUrl() {
  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") || hdrs.get("host");
  const proto = hdrs.get("x-forwarded-proto") || "https";
  if (host) return `${proto}://${host}`.replace(/\/$/, "");
  ...
}

const version = `${process.env.ADMIN_DASHBOARD_VERSION ?? process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_VERSION ?? ""}`
  .trim()
  .toLowerCase();
const useV3 = version === "v3";
const v2Dashboard = <V2Dashboard ... />;

if (useV3) {
  try {
    return <V3Dashboard summary={{ users, professionals, bookings, payments, trend, serviceMix }} />;
  } catch (err) {
    console.error("[admin dashboard] V3 render failed, falling back to V2", err);
    return v2Dashboard;
  }
}
return v2Dashboard;
```

### V3 locations
- `app/(admin)/admin/dashboard/v3/V3Dashboard.tsx` (main V3 UI)
- `app/(admin)/admin/dashboard/v3/DashboardV3.tsx` (re-export)
- `components/admin/v3/` (KpiRow, RevenueChart, ApprovalsTable, ActivityTimeline, PerformancePanel, V3Sidebar)

## 3) What NOT changed (kept stable)
- `/api/admin/login` untouched.
- Cookie name/domain/flags unchanged: `fixeasy_admin_token`, domain `.fixeasy.irish`, HttpOnly, sameSite strict/lax, secure in prod.
- Middleware/proxy logic and backend URLs unchanged.
- Alias/domain unchanged: `admin.fixeasy.irish`.

## 4) Deployment + env var sequence (Vercel)
Commands actually used:
```
# set V3 env var (production)
echo v3 | vercel env add ADMIN_DASHBOARD_VERSION production

# pull envs locally if needed
vercel env pull .env.production.local --yes

# build & deploy
npm run typecheck
npm run build
vercel --prod --yes

# point alias to latest deployment
vercel alias set <deployment-url> admin.fixeasy.irish
```
Notes:
- `ADMIN_DASHBOARD_VERSION=v3` must be set in Production env for V3 to render.
- If the UI looks stale, hard-refresh or use incognito to bypass cached assets.

## 5) Recovery flow if login breaks
1) Check tokens:
   - DevTools Application > Cookies > admin.fixeasy.irish -> `fixeasy_admin_token` exists and is HttpOnly.
2) Call API directly:
   - `curl -I https://admin.fixeasy.irish/api/admin/summary` (expect 200/JSON; 401 means missing/invalid cookie).
3) Validate base URL:
   - Ensure dashboard uses the admin host (see `resolveBaseUrl()`); public domain will drop the cookie.
4) Verify envs:
   - `vercel env ls` → confirm backend base and `ADMIN_DASHBOARD_VERSION`.
5) Rebuild/redeploy:
   - `npm run build` → `vercel --prod --yes` → `vercel alias set ... admin.fixeasy.irish`.
6) If V3 errors:
   - The try/catch auto-falls back to V2; check logs for `[admin dashboard] V3 render failed`.

## 6) How to confirm latest deployment uses V3
- In browser: load `https://admin.fixeasy.irish/admin/dashboard` → should show the purple/teal V3 with sidebar and charts.
- In code: `process.env.ADMIN_DASHBOARD_VERSION` logs as `v3` in server console if set.
- Deployment info: `vercel alias ls` to see which deployment the alias points to; `vercel inspect <deployment>` to confirm build time.

## 7) Debug cookies + headers in DevTools
- Application tab → Cookies → `admin.fixeasy.irish` → verify `fixeasy_admin_token` exists, HttpOnly, Secure.
- Network tab → request to `/api/admin/summary`:
  - Check Request Headers: `Cookie: fixeasy_admin_token=...` should be present (DevTools won’t show HttpOnly token value, but the header should contain the cookie name).
  - Check Response: 200 vs 401. If 401, token missing/invalid.
- If calling from an unexpected host (e.g., `fixeasy.irish`), the admin cookie won’t be sent; ensure requests stay on `admin.fixeasy.irish`.

## 8) Rollback plan
- To return to V2 UI only: unset or change the env:
  - `vercel env add ADMIN_DASHBOARD_VERSION production` (leave blank or set to `v2`), then `vercel --prod --yes`, re-alias to admin domain.
- V2 code is still present in `page.tsx`; no code removal needed.
- If a deployment is bad, re-alias to the previous known-good deployment:
  - `vercel alias ls` to find prior deployment URL.
  - `vercel alias set <previous-deployment> admin.fixeasy.irish`.

## 9) Quick checklist (A→Z)
- ✅ Async token readers (`lib/apiClient.ts`, `lib/adminAuth.ts`) use `await cookies()`.
- ✅ Dashboard base URL derived from request headers to stay on admin domain.
- ✅ V3 lives in `app/(admin)/admin/dashboard/v3/` + `components/admin/v3/`.
- ✅ Switch + fallback in `app/(admin)/admin/dashboard/page.tsx` (env `ADMIN_DASHBOARD_VERSION=v3`).
- ✅ Deployment sequence run with `vercel --prod --yes` and alias set.
- ✅ Test `/api/admin/summary` returns 200 while logged in; otherwise 401 means missing token.
- ✅ If V3 fails, auto-fallback to V2; check logs for the V3 render error.

Keep this file updated after any future changes. This is the playbook to get admin back up fast.
