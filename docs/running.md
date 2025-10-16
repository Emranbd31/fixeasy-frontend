# Running FixEasy locally

## Frontend

```bash
npm install
npm run dev
```

Environment variables:

- `NEXT_PUBLIC_API_BASE_URL` – optional; defaults to the same origin for API routes.
- `JWT_SECRET` – secret for server-generated JWTs when running Next.js API routes.

## Backend

```bash
cd backend
poetry install
poetry run uvicorn app.main:app --reload
```

Environment variables to configure:

- `DATABASE_URL` – Supabase Postgres connection string.
- `SUPABASE_SERVICE_ROLE_KEY` – used for server-side RLS bypass where required.
- `STRIPE_SECRET_KEY` / `STRIPE_CONNECT_CLIENT_ID` – Stripe Connect payouts and identity verification.
- `TURNSTILE_SECRET_KEY` – Cloudflare Turnstile verification server key.

## Database migrations

Apply the starter schema:

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

Seed the initial terms record as needed.
