# FixEasy Platform Vision & Architecture

## 1. Mission Overview
FixEasy delivers trustworthy home maintenance by pairing clients with vetted professionals through a secure, high-performance platform. The goal is to provide a consumer-grade experience with enterprise-grade governance from day one.

### Product Pillars
- **Delightful speed:** Next.js App Router, React Server Components, edge caching, instant transitions.
- **Hybrid security:** Cloudflare perimeter controls plus application-level Zero Trust (SSO/MFA, RBAC/ABAC, signed webhooks, device posture checks).
- **Data trust:** GDPR-first design, PII minimisation, encryption in transit and at rest, comprehensive audit trails.
- **Operational visibility:** Unified logging, metrics, tracing, and security events across FE/BE/infra.
- **Modular evolution:** Launch as a modular monolith with clear seams to extract microservices for payments, notifications, or search when justified by load.

## 2. System Architecture
### 2.1 Frontend Experience
| Capability | Details |
| --- | --- |
| Framework | Next.js 14 (TypeScript) with the App Router and React Server Components |
| Styling | Tailwind CSS + shadcn/ui, dark/light theme, motion via Framer (sparingly) |
| Rendering | Hybrid ISR/SSR depending on route criticality, edge caching, image optimisation |
| Accessibility | WCAG 2.2 AA compliance, keyboard navigation, large touch targets |
| SEO | JSON-LD (LocalBusiness & Service), sitemap.xml, robots.txt per environment |

### 2.2 Backend Services
- FastAPI (Python) with Pydantic v2 schemas for typed responses and request validation.
- Async stack (uvicorn + httpx), background jobs with Celery or RQ workers.
- API conventions: RESTful endpoints, pagination, request ID propagation, idempotency keys on POST/PUT.
- Health checks, OpenAPI docs, and rate limiting baked into the gateway layer.

### 2.3 Data & Storage
- **Primary DB:** Postgres (Supabase) with Row Level Security (RLS) isolating tenants/roles.
- **Cache:** Redis (Upstash) for sessions, rate limiting, job queues, search warmers.
- **Object Storage:** Supabase Storage for documents, invoices, media via signed URLs.
- **Search:** Postgres full-text initially; optional Meilisearch/Algolia as demand grows.

### 2.4 Integrations & Edge
- Payments via Stripe (Connect) for split payouts, disputes, and compliance (KYC/KYB).
- Email via Resend or Postmark; SMS/voice via Twilio or MessageBird; optional WhatsApp/Telegram notifications.
- Cloudflare for WAF, DDoS protection, Turnstile CAPTCHA, bot mitigation, TLS, HSTS, strict CSP.
- JWT authentication with key rotation; secrets managed in Vercel/Fly/Render environments.

### 2.5 Deployment & Observability
- Vercel hosts the Next.js frontend; Fly.io/Render/Railway handle FastAPI and workers.
- CI/CD via GitHub Actions with CodeQL SAST, dependency scanning, preview environments, and promotion gates.
- Sentry (frontend/backend), OpenTelemetry traces, Vercel Analytics, and UptimeRobot/BetterStack uptime checks feed a shared observability dashboard.

## 3. Domain Model Snapshot
Core tables and relationships:
- `users (id, role, email, phone, mfa_enabled, status)`
- `profiles (user_id FK, name, avatar, addresses JSONB)`
- `providers (user_id FK, kyc_status, company, service_categories[], coverage_geo)`
- `services (id, slug, title, description, base_price, addons JSONB, active)`
- `slots (provider_id, date, start, end, capacity)`
- `bookings (id, client_id, provider_id, service_id, address, schedule, status, price_breakdown JSONB)`
- `messages (booking_id, sender_id, text, attachments[])`
- `invoices (booking_id, url, totals, vat, paid_status)`
- `payouts (provider_id, amount, status, stripe_transfer_id)`
- `audits (actor_id, action, entity, before/after JSONB, ip, user_agent, ts)`

RLS Examples:
- Clients may access only their bookings/messages.
- Providers may access bookings assigned to them with limited client metadata.
- Admins operate via a service role key (never exposed to the client apps).

## 4. Experience Surfaces
### 4.1 Client Portal
- Discover services, instant quotes, booking flow, secure checkout, scheduling windows.
- Manage bookings, request refunds/cancellations, chat with pros, view ratings/invoices.
- Account centre with MFA, saved addresses, payment methods, support tickets, memberships, coupons, gift cards.

### 4.2 Professional (Pro) Portal
- Onboarding: Stripe Connect KYC/KYB, service categories, coverage zones, availability calendar, pricing rules.
- Work management: job inbox, accept/decline, route planning (Google Maps), time tracking, before/after media uploads, materials upsell.
- Financial insights: earnings dashboard, payouts history, tax documents, dispute centre.
- Quality program: KPIs, ratings, coaching prompts, SLA alerts.

### 4.3 Admin Panel
- Operations: manage users/providers, bookings lifecycle, refunds/adjustments, escalations, manual reassign.
- Catalog: services, add-ons, dynamic pricing, geographic coverage management.
- Trust & Safety: flagged activity, audit logs, KYC status, device risk, ban/unban controls.
- Finance & Analytics: fees, promotions, ledgers, payouts oversight, cohort/CAC/LTV analytics, funnel reporting, heatmaps, provider performance.
- Config: feature flags, A/B tests, CMS blocks for home/category pages.

## 5. Security & Compliance Blueprint
- **Perimeter:** Cloudflare WAF, geo-fencing, DDoS mitigation, Turnstile on public forms and auth surfaces.
- **Application:** RBAC/ABAC with admin/client/pro scopes; least-privilege services; strict CORS to frontend domains; session binding (IP hash + user agent fingerprint) and device approvals.
- **Auth:** OAuth/OpenID Connect (Supabase Auth or Auth.js), passwordless magic links, TOTP MFA, session and device management.
- **API Security:** Short-lived signed JWT access tokens with refresh rotation, HMAC-signed Stripe webhooks, request ID propagation, rate limiting.
- **Data Protections:** PII minimisation, encryption at rest (Supabase), scheduled key rotation, secrets in managed vaults, immutable audit log, GDPR DSR endpoints for export/delete.
- **Secure SDLC:** Code review gates, CodeQL SAST, dependency scanning, three-environment policy (dev/stage/prod), migration approvals, regular penetration testing, incident and security runbooks, quarterly access reviews.

## 6. Analytics & Growth Stack
- First-party analytics (Vercel Analytics + PostHog) with EU data residency.
- Funnel tracking: landing → search → service → booking → payment.
- Feature experimentation via Upstash/Unleash feature flags and A/B testing harness.
- SEO foundations: structured metadata, clean slugs, sitemaps/robots automation, review/rating schema.

## 7. Delivery Roadmap (12 Weeks)
- **Phase 0 (Week 0): Foundations** – Repo split, CI/CD pipelines, environment provisioning, Cloudflare + Sentry setup, secrets management.
- **Phase 1 (Weeks 1–3): MVP Core** – Client browse→quote→booking→payment (Stripe test), Pro onboarding (basic) with accept/decline, Admin minimal booking view/reassign, status page, email templates, audit log v1.
- **Phase 2 (Weeks 4–6): Secure & Scale** – MFA, hardened RLS, rate limiting, Turnstile, signed webhooks, payouts flow (Stripe Connect), invoices/refunds, messaging/file uploads, observability dashboards.
- **Phase 3 (Weeks 7–9): UX Polish & Catalog** – Dynamic pricing/add-ons, availability calendar, cancellations/rescheduling, SEO content, CMS blocks, reviews/ratings, provider KPIs/earnings analytics.
- **Phase 4 (Weeks 10–12): Compliance & Launch** – GDPR DSR endpoints, data retention policies, privacy docs, load/pen tests, incident runbooks, staging sign-off → production launch.

## 8. Immediate Next 48 Hours
- **Frontend:** Implement feature flag scaffold, PostHog analytics, structured data (JSON-LD), sitemap.xml, environment-specific robots.txt rules.
- **Backend:** Stand up FastAPI project with auth stubs, `/services` and `/bookings` schemas, health checks, request ID middleware, rate limiting, Stripe webhook endpoint placeholder.
- **Database:** Apply initial schema with RLS policies and seed core service catalog data.
- **Security:** Configure Cloudflare WAF ruleset, Turnstile on signup/contact forms, rotate Stripe webhook HMAC secret.
- **Payments:** Integrate Stripe test mode checkout session for bookings, persist payment intent on booking record.
- **Admin v0:** Guard `/admin` route with server-side RBAC, build bookings grid with search/filter.
- **Pro v0:** Launch `/pro` dashboard with job list, accept/decline flows, availability management form.
- **Observability:** Enable Sentry (frontend/backend), BetterStack uptime, structured logs streaming to Logtail.

## 9. Kickoff Sequencing
1. Scaffold FastAPI backend with typed models, JWT auth, RLS-aware queries, Stripe webhook endpoint.
2. Create guarded Admin/Client/Pro Next.js routes with placeholder UIs and RBAC enforcement.
3. Ship DB migrations, seeds, and RLS policies aligned with the domain model.
4. Configure Cloudflare WAF/Turnstile and CI/CD pipelines with security scanning.
5. Iterate on feature delivery per roadmap phases with clear exit criteria and monitoring.
