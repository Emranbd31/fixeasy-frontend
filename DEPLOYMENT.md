# FixEasy Backend — Deployment Guide

This document describes the GitHub Actions workflow for building and pushing the FixEasy backend Docker image to GitHub Container Registry (GHCR) and running a post-deploy summary check.

Required repository secrets (GitHub → Settings → Secrets → Actions)
- GHCR_USERNAME — GHCR username (usually your GitHub username or org)
- GHCR_TOKEN — Personal access token with packages:write (do NOT commit this value)
- SUPABASE_URL — Supabase project URL (used by backend/runtime)
- SUPABASE_SERVICE_ROLE_KEY — Supabase service role key (keep secret)

Optional secrets for automatic deploy hooks:
- RENDER_API_KEY, RENDER_SERVICE_ID
- VERCEL_TOKEN, VERCEL_PROJECT_BACKEND, VERCEL_TEAM_ID (if used)

How to add secrets
1. Go to your repository on GitHub.
2. Click Settings → Secrets and variables → Actions → New repository secret.
3. Add the secrets listed above (Name and Value). Save each.

Manually triggering the workflow
1. Go to the Actions tab in the repository.
2. Select "Deploy Backend".
3. Click "Run workflow" (choose branch `main`) and click the green button.

What the workflow does
- Triggers on push to `main` and manual dispatch.
- Logs in to GHCR using `GHCR_USERNAME` and `GHCR_TOKEN`.
- Builds the Docker image using `backend/Dockerfile` and pushes tags:
  - `ghcr.io/<owner>/fixeasy-backend:latest`
  - `ghcr.io/<owner>/fixeasy-backend:<commit-sha>`
- Optionally POSTs to Render or Vercel if corresponding secrets are set.
- Runs `python tools/run_summary.py` to verify Supabase/backend summary counts.

Notes
- Do not store secrets in the repository.
- Ensure `backend/Dockerfile` and `backend/backend-main/requirements.txt` are up to date.
- The workflow prints pushed image URLs after push.

Local verification
- You can run a local build using Docker:
```powershell
docker build -t fixeasy-backend:local -f backend/Dockerfile backend
```
- Then run the summary script locally (requires SUPABASE env vars):
```powershell
pip install -r backend/backend-main/requirements.txt
python tools/run_summary.py
```

Commit message to use:
"Add GitHub Actions backend deploy workflow and deployment guide"
