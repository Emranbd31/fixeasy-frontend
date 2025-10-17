# FixEasy Frontend Deployment

This project now uses the [Vercel GitHub Integration](https://vercel.com/docs/integrations/git/github) to automatically deploy the production site at [https://fixeasy.irish](https://fixeasy.irish).

## Prerequisites

1. The repository [`Emranbd31/fixeasy-frontend`](https://github.com/Emranbd31/fixeasy-frontend) must be linked to the existing Vercel project **fixeasy-frontend**.
2. The production branch should remain `main` so that Vercel can build from each push.
3. The Vercel project should point to `frontend/Frontend--main` as the root directory.

## Deployment Flow

1. Commit your changes locally.
2. Push to the `main` branch.
3. Vercel receives the GitHub webhook, builds the Next.js app, and promotes the deployment to production once the build succeeds.

No manual `npm install -g vercel`, `vercel link`, or `vercel --prod` commands are required.

## Manual Production Builds (Optional)

If you need to verify a build locally before pushing:

```bash
npm install --legacy-peer-deps
npm run build
```

Or run the repository level helper script from the repo root:

```bash
./scripts/verify-builds.sh
```

Then push to `main` when you are ready.
