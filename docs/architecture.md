# FixEasy authentication architecture

This document captures the combined frontend and backend responsibilities for the FixEasy zero-trust onboarding programme.

## Frontend (Next.js 14 App Router)

- App Router routes provide `/signup`, `/signup/client`, `/signup/pro`, `/terms`, `/privacy`, `/dashboard`, `/dashboard/pro`, and
  `/admin` experiences.
- React Server Components render marketing and legal content; client components handle onboarding forms with validation.
- Terms acceptance is fetched from `/api/legal/terms` before forms can be submitted. Submissions call `/api/auth/signup` which
  issues session tokens and writes acceptance audits.
- OAuth buttons hit `/api/auth/oauth/{provider}` which return provider redirect URLs; stubs are in place for offline review.

## Backend (FastAPI)

- `backend/app` exposes `/auth/signup`, `/auth/login`, `/auth/logout`, `/legal/terms`, `/legal/accept`, and `/pro/kyc` routes.
- Pydantic models align with the Supabase schema defined in `db/schema.sql`.
- Memory-backed services mimic Supabase behaviour but can be replaced with actual queries without touching the route contracts.
- JWT handling uses HS256 for simplicity; swap to JWK-based rotation before production launch.
- Rate limiting, audit logging, and Stripe Connect integration points are stubbed out but documented for extension.

## Terms lifecycle

- Terms content is versioned in `data/terms.js` for the frontend and `MemoryStore` for the backend.
- `/api/legal/terms` returns the latest version to the client applications.
- Acceptance records include IP address and user agent details to satisfy compliance requirements. Admins can publish new
  versions via backend mutations to force re-acceptance.

## Security controls

- Cloudflare Turnstile messaging is surfaced on onboarding forms. Integration keys are expected via environment variables.
- All session tokens are short-lived JWTs with refresh rotation. Refresh tokens are rotated server-side on use.
- Audit logs capture account creation and KYC updates. Replace the in-memory implementation with Supabase `audit_logs` table and
  append-only storage for immutability.
