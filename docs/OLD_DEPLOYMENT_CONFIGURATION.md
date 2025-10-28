# FixEasy Deployment Configuration Reference

This document consolidates the settings recovered from the last known good Vercel deployment so they can be re-applied quickly when recreating the project.

## Vercel Project
- **Project name:** `fixeasy-frontend`
- **Framework preset:** Next.js 14.2.4
- **Node version:** 18.x
- **Git repository:** `Emranbd31/fixeasy-frontend`
- **Default branch:** `main`
- **Project ID:** `prj_vicgNi2eLNTipQYdpFJ8wkXIdhKX`
- **Team/Org ID:** `team_9nvrDzYa6wKG4rh0ypvqYAEZ`

### Connected Domains
- `https://fixeasy.irish`
- `https://www.fixeasy.irish`

### Build & Output Settings
- **Build command:** `next build`
- **Install command:** (default) `npm install`
- **Output directory:** `.vercel/output` (Next.js default)
- **Environment:** Production, Preview, Development all supported

## Environment Variables
Add the following variables in the Vercel project settings. Values marked with `🔒` are secrets and should come from Supabase or internal configuration.

| Name | Value | Environments |
| ---- | ----- | ------------ |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://wphmhlrttmzsmngysfws.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 🔒 Supabase anon key | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_KEY` | 🔒 same as anon key | Production, Preview, Development |
| `NEXT_PUBLIC_API_URL` | `https://api.fixeasy.irish` | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | `https://fixeasy.irish` | Production, Preview, Development |
| `NEXT_PUBLIC_ENV` | `production` | Production only |
| `NODE_VERSION` | `18` | Production, Preview, Development |
| `ADMIN_SECRET` | 🔒 admin shared secret for protected routes | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | 🔒 Supabase service role key | Production, Preview, Development |
| `SUPABASE_JWT_SECRET` | 🔒 Supabase JWT secret | Production, Preview, Development |

> ℹ️  The Supabase keys and admin secret were previously configured on the deployment even though they are not part of the Git repository. Re-add them exactly as stored before redeploying.

## Supabase Project
- **Project URL:** `https://wphmhlrttmzsmngysfws.supabase.co`
- **Anon key:** Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SUPABASE_KEY`
- **Service role key:** Required for server-side API routes and background tasks
- **JWT secret:** Required for admin API verification

## Backend (FastAPI) Deployment
If you also maintain the backend project (`fixeasy-backend`):

| Name | Value |
| ---- | ----- |
| `SUPABASE_URL` | `https://wphmhlrttmzsmngysfws.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | 🔒 Supabase service role key |
| `SUPABASE_JWT_SECRET` | 🔒 Supabase JWT secret |
| `CORS_ALLOWED_ORIGINS` | `https://fixeasy.irish,https://www.fixeasy.irish` |
| `ENVIRONMENT` | `production` |
| `PYTHON_VERSION` | `3.11` |

The backend Vercel project also configured a cron job with the following `vercel.json` snippet:

```json
{
  "crons": [
    {
      "path": "/status",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

## Redeployment Checklist
1. Restore repository and install dependencies (`npm install`).
2. Copy `.env.example` to `.env.local` and fill in the secret values.
3. Recreate the environment variables in Vercel using the table above.
4. Trigger a redeploy from the Vercel Deployments tab once variables are saved.
5. Confirm the site loads at `https://fixeasy.irish` and admin APIs respond.
