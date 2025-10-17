# FixEasy Implementation Roadmap

## Overview
This roadmap outlines the step-by-step approach to evolve FixEasy from a static prototype into a production-ready full-stack platform. It prioritizes secure authentication, backend integration, data protection, and operational readiness using Next.js, FastAPI, Supabase, and Vercel.

---

## Phase 1: Authentication & Session Management
1. **Remove client-side role checks**
   - Delete any `localStorage` or client-only role guards.
   - Ensure all access control logic uses server-validated session state.
2. **Integrate Supabase Auth SDK with SSR helpers**
   - Add `@supabase/auth-helpers-nextjs` for server/client hydration.
   - Configure Supabase client instances in `/lib/supabaseServer.ts` and `/lib/supabaseBrowser.ts`.
3. **Secure cookie storage for JWTs**
   - Use Supabase Auth helper middleware to set http-only, `Secure`, `SameSite=Lax` cookies.
   - Configure `auth.updateUser()` to refresh cookies automatically.
4. **Implement `useUser()` context provider**
   - Create `contexts/UserContext.tsx` with SSR hydration from Supabase session.
   - Provide typed `User` object containing `id`, `email`, `role`, `access_token` metadata.
5. **Forward JWTs to FastAPI**
   - In `lib/apiClient.ts`, attach `Authorization: Bearer <access_token>` header for server-side and client-side fetches.
6. **Logout flow**
   - Create `/api/auth/logout` route that calls `supabase.auth.signOut()` and clears cookies using `deleteCookie()`.
7. **Refresh token handling**
   - Use Supabase refresh tokens with automatic cookie updates via `onAuthStateChange`.
   - Implement silent re-auth on the client by listening for `TOKEN_REFRESHED` events.

**Recommended libraries & snippets**
```ts
// lib/supabaseServer.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export const getSupabaseServerClient = (cookies: () => ReadonlyRequestCookies) =>
  createServerComponentClient({ cookies });
```
```tsx
// contexts/UserContext.tsx
const UserContext = createContext<UserContextValue | null>(null);
export const UserProvider = ({ children }: Props) => {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => data.subscription.unsubscribe();
  }, []);
  return <UserContext.Provider value={{ session }}>{children}</UserContext.Provider>;
};
```

---

## Phase 2: FastAPI Backend Security Integration
1. **Create authentication middleware** (`app/middleware/auth_middleware.py`)
   - Verify Supabase JWT using `pyjwt` and `JWKS` from Supabase.
   - Populate `request.state.user = {"id": sub, "role": role}`.
   - Raise `HTTPException(status_code=401)` on failure.
2. **Secure dependencies**
   - Implement `current_user` dependency in `app/dependencies/auth.py` returning typed `CurrentUser`.
   - Add role-based dependencies `require_client`, `require_pro`, `require_admin`.
3. **Verification endpoint**
   - Create `/auth/verify` returning user payload for SSR.
4. **Restrict CORS**
   - Configure `CORSMiddleware` with `allow_origins=["https://fixeasy.irish", "https://www.fixeasy.irish"]`.
5. **HTTPS enforcement**
   - Add `TrustedHostMiddleware` and `HTTPSRedirectMiddleware`.
   - Set HSTS headers via `SecurityHeadersMiddleware`.

**Recommended libraries & snippets**
```py
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
import jwt

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        if not token:
            raise HTTPException(status_code=401, detail="Missing token")
        try:
            payload = jwt.decode(token, JWKS_PUBLIC_KEY, algorithms=["RS256"], audience="authenticated")
        except jwt.PyJWTError:
            raise HTTPException(status_code=401, detail="Invalid token")
        request.state.user = {"id": payload["sub"], "role": payload["role"]}
        return await call_next(request)
```

---

## Phase 3: Supabase Schema & Row Level Security
1. **Database schema**
   - Define tables using Supabase migration SQL or SQL editor:
     - `users` (id UUID PK, email, created_at)
     - `profiles` (user_id FK, role ENUM, name, phone)
     - `professionals` (profile_id FK, certifications JSONB, approval_status)
     - `services` (id UUID PK, title, category, price)
     - `bookings` (id UUID PK, client_id FK, pro_id FK, service_id FK, status, scheduled_at)
2. **Enable RLS** on each table.
3. **Policies**
   - *Clients:* `USING (auth.uid() = client_id)` for select/update; allow insert if `auth.uid() = client_id` via check.
   - *Professionals:* `USING (auth.uid() = pro_id)` for select/update bookings.
   - *Admins:* create role via service key; backend uses service key to bypass RLS.
4. **Testing**
   - Use Supabase SQL console: run `set auth.jwt.claim.role = 'client';` etc.
   - Insert sample data and verify visibility per role.

**Example policy snippet**
```sql
create policy "Clients can manage own bookings"
  on public.bookings
  for all
  using (auth.uid() = client_id)
  with check (auth.uid() = client_id);
```

---

## Phase 4: Secure Routes & Dashboards
1. **Route restructuring**
   - Move admin UI from `/admin` to `/dashboard/admin/index.tsx`.
   - Add client and pro dashboards under `/dashboard/client` and `/dashboard/pro`.
2. **Middleware enforcement**
   - Implement `middleware.ts` using `createMiddlewareClient` to check session on every request.
   - Redirect unauthenticated requests to `/login`.
3. **SSR role checks**
   - Use `getServerSideProps` to fetch session via Supabase server client and gate route by role.
4. **Scoped data fetching**
   - Client dashboard fetches bookings filtered by `client_id`.
   - Pro dashboard fetches bookings filtered by `pro_id` and aggregates earnings.
   - Admin dashboard fetches pending professionals, metrics using service key via backend.
5. **403 fallback**
   - Add `/403` page; return `notFound: true` or redirect when unauthorized.

**Middleware snippet**
```ts
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return res;
}
```

---

## Phase 5: File Uploads & Storage
1. **Supabase Storage configuration**
   - Create `professional-documents` bucket with RLS enabled.
   - Allow uploads where `auth.uid() = owner_id`.
2. **Signed upload/download URLs**
   - FastAPI endpoint `/storage/sign-upload` uses service key to generate signed upload URL (5-minute expiry).
   - `/storage/sign-download` to generate download URL for the requesting user.
3. **Validation**
   - Validate MIME type & size using `python-magic` and request headers before issuing upload URL.
   - On frontend, restrict accepted files in `<input type="file" accept="application/pdf,image/*" />`.

**FastAPI snippet**
```py
from supabase import create_client

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

@app.post('/storage/sign-upload')
async def sign_upload(payload: UploadRequest, user = Depends(current_user)):
    key = f"{user.id}/{uuid4()}.{payload.extension}"
    if payload.size > MAX_SIZE:
        raise HTTPException(400, 'File too large')
    url = supabase.storage.from_('professional-documents').create_signed_upload_url(key, expires_in=300)
    return {"url": url, "key": key}
```

---

## Phase 6: Booking Flow Integration
1. **Frontend form submission**
   - Update booking wizard final step to call internal API route `/api/bookings`.
   - Handle optimistic UI and error states.
2. **Next.js API route**
   - Implement `pages/api/bookings.ts` that forwards request to FastAPI with JWT header.
3. **FastAPI booking endpoint**
   - Create `BookingCreate` Pydantic model with validation (service ID exists, dates in future).
   - Insert into Supabase using service key client.
   - Return `booking_id`, `status`, `scheduled_at`.
4. **Response handling**
   - Update UI to show confirmation screen with `booking_id` and follow-up actions.

**Pydantic model example**
```py
class BookingCreate(BaseModel):
    service_id: UUID
    scheduled_at: datetime
    notes: constr(max_length=500) | None

    @validator('scheduled_at')
    def validate_future(cls, value):
        if value <= datetime.utcnow():
            raise ValueError('scheduled_at must be in the future')
        return value
```

---

## Phase 7: Security Hardening
1. **CSRF protection**
   - Use `next-csrf` to issue anti-CSRF tokens stored in double-submit cookies.
   - FastAPI validates `X-CSRF-Token` header for state-changing endpoints.
2. **Rate limiting**
   - Integrate `slowapi` or `fastapi-limiter` with Redis for IP-based limits.
3. **Input sanitization**
   - Leverage Pydantic validators and `bleach` for HTML fields.
4. **Security headers**
   - Configure Next.js `headers()` in `next.config.mjs` to add `Content-Security-Policy`, `X-Frame-Options`, etc.
   - Use `fastapi.middleware.httpsredirect.HTTPSRedirectMiddleware` and custom headers for backend.
5. **Production error handling**
   - Set `NODE_ENV=production`, disable stack traces in Next.js API routes.
   - Configure FastAPI `debug=False` with custom exception handlers.

---

## Phase 8: Logging, Monitoring & Auditing
1. **Logging middleware**
   - Add `logging_middleware.py` capturing request ID, user ID, latency, response code using `structlog`.
2. **Audit logs table**
   - Table columns: `id`, `user_id`, `action`, `resource`, `metadata JSONB`, `created_at`.
   - Log events on sign-in, role updates, booking edits.
3. **Health endpoint**
   - `/health` returns system status including Supabase connectivity check.
4. **Error tracking**
   - Configure Sentry SDK for Next.js (`@sentry/nextjs`) and FastAPI (`sentry-sdk[fastapi]`).
5. **Uptime monitoring**
   - Deploy public status page via UptimeRobot pointing to `/health` endpoints.

---

## Phase 9: Environment & Deployment
1. **Environment variable hygiene**
   - Keep only non-sensitive keys prefixed with `NEXT_PUBLIC_` (e.g., `NEXT_PUBLIC_SUPABASE_URL`).
   - Move secrets to server-side `.env` and Vercel project settings.
2. **Backend secrets**
   - Store `SUPABASE_SERVICE_ROLE`, `SUPABASE_URL`, `JWT_SECRET`, `SENTRY_DSN`, `REDIS_URL` in deployment environment.
3. **Vercel configuration**
   - Set Vercel environment variables for preview and production.
   - Ensure Next.js API routes deployed to Vercel or run FastAPI separately (e.g., Fly.io/Render) with secure network.
4. **Resource planning**
   - Verify Supabase usage tiers; upgrade to Pro for RLS and auth limits.
   - Confirm FastAPI hosting uses HTTPS certificates (e.g., via Caddy/Traefik).
5. **Documentation**
   - Update `/docs/DEPLOYMENT.md` with full `.env` schema, deployment commands, and rollback plan.

---

## Implementation Sequence
1. **Backend foundation**
   - Implement Supabase schema, RLS policies, and audit logging tables.
   - Build FastAPI auth middleware, verification endpoint, and security headers.
2. **Frontend authentication overhaul**
   - Integrate Supabase Auth helpers, cookie-based sessions, `useUser` context, and SSR protection.
   - Replace legacy role checks and restructure dashboard routes.
3. **API integration**
   - Connect booking flow and dashboards to FastAPI endpoints.
   - Implement file upload signing and client proxies.
4. **Security hardening & observability**
   - Add CSRF, rate limiting, logging middleware, Sentry, and health checks.
5. **Deployment readiness**
   - Configure environment variables, CI/CD secrets, and finalize documentation.
   - Run end-to-end tests and security reviews before launch.

---

## Risk & Mitigation Checklist
- **Authentication misconfiguration**: Verify cookie flags, refresh tokens, and session invalidation; add end-to-end auth tests.
- **RLS policy gaps**: Run Supabase tests per role and review policies with least privilege principle.
- **Token leakage**: Ensure no tokens stored in localStorage; use HTTP-only cookies exclusively.
- **CORS & mixed content issues**: Restrict origins and enforce HTTPS across all services.
- **File upload abuse**: Validate file size/type, scan documents (future ClamAV integration).
- **Rate limiting gaps**: Configure and test Redis-backed rate limits on critical endpoints.
- **Monitoring blind spots**: Confirm Sentry DSNs, UptimeRobot monitoring, and log retention.
- **Deployment secrets exposure**: Review `.env` contents and restrict access in Vercel/Supabase.

---

## Testing Strategy
- **Unit tests**: Pydantic validators, auth middleware, Supabase client wrappers.
- **Integration tests**: Auth flow, booking creation, file upload signing using Playwright & pytest.
- **Security tests**: OWASP ZAP scan, Supabase RLS penetration, JWT tampering attempts.
- **Performance tests**: Load test booking API and dashboards under expected load.
- **Smoke tests**: Run after each deployment with automated script hitting `/health`, login, booking flow, dashboards.

---

## Monitoring & Go-Live Checklist
- [ ] Supabase Auth configured with email templates and domain.
- [ ] FastAPI hosted with HTTPS and logging middleware enabled.
- [ ] Dashboards gated by SSR session + role checks.
- [ ] Booking flow integrated end-to-end with Supabase storage.
- [ ] Sentry alerts and UptimeRobot monitors active.
- [ ] Documentation updated for operations and incident response.

