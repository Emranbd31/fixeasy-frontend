# FixEasy Platform Vision & Architecture

## Vision & Core Principles
- **Speed & UX:** Next.js App Router with edge caching, instant transitions.
- **Hybrid Security:** Cloudflare WAF and rate limiting plus Zero Trust controls (SSO/MFA, RBAC/ABAC, signed webhooks, device posture).
- **Data Trust:** GDPR-first, audit trails, PII minimisation, encryption in transit and at rest.
- **Observability:** Comprehensive logging, metrics, tracing, and security event collection.
- **Modular Evolution:** Start with a modular monolith and extract microservices for payments, notifications, and search as needed.

## High-Level Architecture
### Frontend
- Next.js 14 with the App Router, Tailwind, React Server Components, and a blend of ISR/SSR.
- shadcn/ui component system with light/dark themes, accessible motion, and WCAG 2.2 AA compliance.
- Edge caching, image optimisation, and route prefetch for Core Web Vitals compliance.

### Backend
- FastAPI (Python) with Pydantic v2 for typed responses and async stack (uvicorn + httpx).
- Background jobs handled by Celery or RQ workers.
- API endpoints typed, with pagination, request IDs, and idempotency keys.

### Data & Storage
- Postgres (Supabase) with Row Level Security for tenant and role segregation.
- Redis (Upstash) for sessions, rate limits, background job queues, and search warmers.
- Supabase Storage for documents, invoices, and media via signed URLs.

### Security & Edge
- Cloudflare WAF, DDoS protection, Turnstile CAPTCHA, Bot Fight.
- TLS, HSTS, CSP, signed cookies, JWT with key rotation.
- OAuth/OIDC (Supabase Auth or Auth.js) with MFA (TOTP), device/session management.

### Integrations
- Stripe (Connect) for payments and split payouts.
- Resend/Postmark for transactional email; Twilio/MessageBird for SMS.
- Optional Meilisearch/Algolia for advanced search.

### Deployment & Monitoring
- Vercel for frontend; Fly.io/Render/Railway for FastAPI and workers.
- GitHub Actions CI/CD with CodeQL, dependency scanning, and environment promotion.
- Sentry, OpenTelemetry, Vercel Analytics, UptimeRobot/BetterStack for observability.

## Domain Areas
### Roles & Portals
1. **Client Portal:** Booking, payments, chat, ratings, membership, support.
2. **Pro Portal:** Onboarding (KYC/KYB via Stripe Connect), job management, routing, photos, earnings, KPIs.
3. **Admin Panel:** Operations, catalog management, trust & safety, finance, analytics, feature flags, CMS.

### Security Strategy
- Perimeter protection with Cloudflare and geo-fencing when necessary.
- Application-level RBAC/ABAC, strict CORS, least privilege.
- OAuth + passwordless + TOTP MFA, session binding, device approvals.
- Signed JWTs with short TTL, refresh rotation, HMAC-signed webhooks, request ID propagation.
- GDPR DSR endpoints, privacy policy, data retention matrix, audit log immutability.
- Secure SDLC: SAST, dependency scanning, commit hooks, multi-environment policy, approved DB migrations.

### Data Model (Starter)
- `users`, `profiles`, `providers`, `services`, `slots`, `bookings`, `messages`, `invoices`, `payouts`, `audits` tables.
- Row-level access enforcing client, pro, and admin permissions.

### API Surface (FastAPI)
- Public endpoints: `/services`, `/services/:id`, `/contact`.
- Auth endpoints: login, magic link, TOTP verify, refresh, logout.
- Client flows: create bookings, view/cancel bookings, submit ratings.
- Pro flows: job inbox, status updates, notes, availability.
- Admin flows: overview, reassign, refund, ban.
- Webhooks: Stripe, email providers, Cloudflare Turnstile.

### UI/UX System
- Clean, Dublin-inspired design with accessible typography and motion.
- CMS-driven content for homepage, categories, trust proofs, FAQs, pricing.
- JSON-LD for SEO, sitemaps, robots per environment.

### Analytics & Growth
- First-party analytics (Vercel + PostHog) with EU data residency.
- Funnels for landing → booking → payment, experiments via feature flags (Upstash/Unleash), and SEO best practices.

## Delivery Roadmap
- **Phase 0 (Week 0):** Repo split, CI/CD, environments, Cloudflare, Sentry, secrets management.
- **Phase 1 (Weeks 1–3):** MVP: client booking flow, pro onboarding, admin booking management, status page, email templates, audit log v1.
- **Phase 2 (Weeks 4–6):** Security hardening, payouts, invoices/refunds, messaging, observability dashboards.
- **Phase 3 (Weeks 7–9):** UX polish, dynamic pricing, calendar, SEO content, provider analytics.
- **Phase 4 (Weeks 10–12):** GDPR endpoints, data retention, privacy docs, load tests, pen-test remediation, runbooks, staging sign-off.

## Immediate Next Steps (48 Hours)
- Frontend: feature flag scaffold, PostHog integration, JSON-LD, sitemap/robots per environment.
- Backend: FastAPI skeleton with auth stubs, `/services` and `/bookings` schemas, health checks, request ID middleware, rate limiting.
- Database: apply initial schema and RLS policies, seed services data.
- Security: configure Cloudflare WAF rules, Turnstile on signup/contact, rotate Stripe webhook HMAC.
- Payments: Stripe checkout session in test mode, persist payment intent on booking.
- Admin v0: guard `/admin` route with server-side RBAC, bookings grid with search.
- Pro v0: dashboard with job list, accept/decline, availability form.
- Observability: Sentry (FE/BE), BetterStack uptime, structured logs to Logtail.

## Kickoff Plan
- Begin with FastAPI scaffold (typed models, JWT auth, RLS-aware queries, Stripe webhook).
- Build guarded Admin/Client/Pro routes with placeholder UIs.
- Implement DB migrations, seeds, and RLS policies.
- Configure Cloudflare WAF and Turnstile integrations.

