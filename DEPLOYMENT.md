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

## Automated Validation & Redeploy Workflow

When you need to double‑check both Vercel projects and trigger a fresh production deploy manually, run the helper script shipped in this repository:

```bash
./scripts/vercel-validate-and-redeploy.sh
```

The script performs the following steps in order:

1. Validates the `fixeasy-frontend` and `fixeasy-backend` Vercel projects (checks environment variables and build configuration).
2. Downloads the production environment variables for both projects into temporary files so you can confirm they are present.
3. Simulates the local frontend build (and backend build, when the backend repository is available locally).
4. Triggers production redeployments for both Vercel projects if every previous step succeeds.

You can override defaults (project names, working directories, or the Vercel environment) with environment variables before running the script:

```bash
FRONTEND_PROJECT=my-frontend \
BACKEND_PROJECT=my-backend \
FRONTEND_DIR=./frontend \
BACKEND_DIR=../backend \
PRODUCTION_ENV=preview \
  ./scripts/vercel-validate-and-redeploy.sh
```

> **Note:** The script expects the [Vercel CLI](https://vercel.com/docs/cli) to be accessible via `npx` and requires valid Vercel credentials in your environment.
