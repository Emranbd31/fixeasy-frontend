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

## Environment Variables

Ensure the following values are configured in your deployment environment (e.g. Vercel project settings or `.env.local`):

| Variable | Required | Description |
| --- | --- | --- |
| `ADMIN_DASHBOARD_SECRET` | ✅ | Password used by `/auth/admin` to create secure admin sessions. |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL for OAuth and Storage uploads. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Public anon key used for OAuth redirects and direct Storage uploads. |
| `NEXT_PUBLIC_SUPABASE_CLIENT_BUCKET` | ⚙️ (optional) | Overrides the default `client-uploads` bucket for client issue photos. |
| `SUPABASE_URL` | ⚙️ (optional) | Server-side Supabase URL if it differs from the public URL. |
| `SUPABASE_SERVICE_ROLE_KEY` | ⚙️ (optional) | Enables the `/api/uploads` endpoint to mint upload instructions. |
| `SUPABASE_AUTH_GOOGLE_CLIENT_ID` / `SUPABASE_AUTH_GOOGLE_SECRET` | ⚙️ | Configure Google OAuth in Supabase. |
| `SUPABASE_AUTH_APPLE_CLIENT_ID` / `SUPABASE_AUTH_APPLE_SECRET` | ⚙️ | Configure Apple OAuth in Supabase. |

After changing authentication provider credentials, rebuild the frontend so the new environment variables are included in the deployed bundle.
