# FixEasy FastAPI backend

This service powers the secure authentication and onboarding flows for FixEasy. It exposes the routes described in the product
spec including signup, login, OAuth hand-offs, legal terms, and professional KYC management.

## Quick start

```bash
cd backend
poetry install
poetry run uvicorn app.main:app --reload
```

Environment variables are loaded from `.env` if present. Supabase connection strings, Stripe secrets, and JWT signing keys are
expected.

## Directory overview

- `app/main.py` – FastAPI application with router wiring and middleware (request IDs, rate limiting placeholder).
- `app/api/` – route definitions split by domain (auth, legal, professionals).
- `app/models/` – Pydantic schemas and domain models.
- `app/core/` – security helpers, rate limiting, and configuration loading.
- `app/services/` – in-memory services standing in for Postgres/Supabase operations.

The implementation keeps storage in memory for demonstration while mirroring how Supabase tables and Stripe Connect verification
would be orchestrated.
