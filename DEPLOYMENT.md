# FixEasy Frontend Deployment

This project now uses the [Vercel GitHub Integration](https://vercel.com/docs/integrations/git/github) to automatically deploy the production site at [https://fixeasy.irish](https://fixeasy.irish).

## Prerequisites

1. The repository [`Emranbd31/fixeasy-frontend`](https://github.com/Emranbd31/fixeasy-frontend) must be linked to the existing Vercel project **fixeasy-frontend**.
2. The production branch should remain `main` so that Vercel can build from each push.
3. The project settings in Vercel should specify `/workspace/master/frontend` (or the corresponding folder inside the repo) as the root directory if the default root does not contain the Next.js app.

## Deployment Flow

1. Commit your changes locally.
2. Push to the `main` branch.
3. Vercel receives the GitHub webhook, builds the Next.js app, and promotes the deployment to production once the build succeeds.

No manual `npm install -g vercel`, `vercel link`, or `vercel --prod` commands are required.

## Manual Production Builds (Optional)

If you need to verify a build locally before pushing:

```bash
npm install
npm run build
```

Then push to `main` when you are ready.

## Backend Service Deployment

The `backend/Backend--main` directory now contains a lightweight FastAPI service that
handles professional registrations, verification moderation actions, and upload
signing placeholders for Supabase Storage. Vercel uses the [`@vercel/python`
runtime](https://vercel.com/docs/functions/serverless-functions/runtimes/python)
to serve this API from `main.py`.

### Local Validation

```bash
cd backend/Backend--main
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The health endpoint is available at `http://127.0.0.1:8000/healthz` and returns a
JSON payload indicating the backend is running.

### Vercel Deployment

1. Ensure the backend repository is linked to the correct Vercel project (for
   example **fixeasy-backend**).
2. Push the updated `backend/Backend--main` directory to the `main` branch or the
   branch configured in Vercel.
3. Vercel will install the dependencies from `requirements.txt` and deploy the
   FastAPI application automatically.

Optional environment variables:

| Variable | Description |
| --- | --- |
| `ALLOWED_ORIGINS` | Comma-separated list of origins allowed for CORS. Defaults to common FixEasy domains. |
| `SUPABASE_STORAGE_BUCKET` | Overrides the default `verification` bucket used when generating placeholder upload URLs. |

After the deployment finishes, visit the deployment URL (e.g.
`https://api.fixeasy.irish/healthz`) to confirm a healthy response before promoting
to production.

## Environment Variables

Ensure the following values are configured in your deployment environment (e.g. Vercel project settings or `.env.local`):

| Variable | Required | Description |
| --- | --- | --- |
| `ADMIN_DASHBOARD_SECRET` | ✅ | Password used by `/auth/admin` to create secure admin sessions. |
| `ADMIN_SESSION_SECRET` | ✅ | 32+ character random string used to sign the admin session cookie. |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL for OAuth and Storage uploads. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Public anon key used for OAuth redirects and direct Storage uploads. |
| `NEXT_PUBLIC_SUPABASE_CLIENT_BUCKET` | ⚙️ (optional) | Overrides the default `client-uploads` bucket for client issue photos. |
| `SUPABASE_URL` | ⚙️ (optional) | Server-side Supabase URL if it differs from the public URL. |
| `SUPABASE_SERVICE_ROLE_KEY` | ⚙️ (optional) | Enables the `/api/uploads` endpoint to mint upload instructions. |
| `SUPABASE_AUTH_GOOGLE_CLIENT_ID` / `SUPABASE_AUTH_GOOGLE_SECRET` | ⚙️ | Configure Google OAuth in Supabase. |
| `SUPABASE_AUTH_APPLE_CLIENT_ID` / `SUPABASE_AUTH_APPLE_SECRET` | ⚙️ | Configure Apple OAuth in Supabase. |

After changing authentication provider credentials, rebuild the frontend so the new environment variables are included in the deployed bundle.
