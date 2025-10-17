# FixEasy End-to-End Verification Checklist

## Authentication & Sessions
- [ ] Sign in via `/login` using Supabase credentials and confirm dashboard redirect.
- [ ] Inspect browser cookies to verify `fixeasy-auth` cookie is HttpOnly, Secure (in production), and SameSite=Lax.
- [ ] Validate SSR-protected pages (`/book`, `/register/pro`) redirect unauthenticated users to `/login`.

## Dashboard & Booking Flow
- [ ] Complete multi-step booking wizard and confirm success page displays `bookingId`.
- [ ] Inspect Supabase `bookings` table for new record tied to authenticated `client_id`.
- [ ] Attempt to post to `/api/bookings` without CSRF header and confirm 403 response.

## Storage Uploads
- [ ] Upload required documents on `/register/pro` and confirm signed upload completes.
- [ ] Validate Supabase storage object exists in `professional-documents` bucket with scoped path.
- [ ] Attempt to request signed URL without auth to ensure 401 is returned.

## Backend Hardening
- [ ] Hit `/health` endpoint to confirm JSON status payload.
- [ ] Inspect FastAPI logs for structured JSON entries with `user_id` and latency.
- [ ] Validate rate limiting by exceeding `/storage/sign-upload` threshold and confirm 429 response.

## Observability & Audit
- [ ] Check `audit_logs` table for entries on booking creation and signed URL generation.
- [ ] Review structured logs to ensure request metadata present.
- [ ] Confirm Sentry placeholder emits warning when DSN provided without SDK.

## Deployment Sanity
- [ ] Run `npm run build` and `npm run start` locally to ensure Next.js compiles with security headers.
- [ ] Start FastAPI via `cd backend/Backend--main && uvicorn main:app --reload` and smoke-test `/auth/verify` with Supabase JWT.
- [ ] Execute Supabase SQL migrations (`supabase/schema.sql`, `supabase/policies.sql`) and seed data script (`supabase/seed_services.sql`).
