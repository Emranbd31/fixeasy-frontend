Deploying frontend and backend to Vercel
=======================================

This document shows the recommended folder layout, how to deploy the frontend and backend, how to run the backend locally for testing, and a short description of the admin/login endpoints used by the admin UI.

Quick summary
-------------
- Canonical backend folder (production): `backend/backend-main`
- Canonical frontend folder (production): the repo root `app/` and Next.js app files
- Deploy method: Vercel CLI for manual deploys or GitHub Actions for automated deploys

Project structure (important folders)
-------------------------------------
- `app/` — Next.js frontend (admin pages and user UI). The admin dashboard pages are under `app/admin` or `app/admin/*`.
- `backend/backend-main/` — Primary FastAPI backend (contains `main.py`, `requirements.txt`, routers). This is the folder we deploy to Vercel for the backend.
- `backend/Backend--main/` — legacy copy / alternate backend folder. Do not deploy this one; use `backend/backend-main`.
- `tools/` — local helper scripts (smoke tests, deploy helpers, dev utilities).
- `.github/workflows/` — CI workflows (deploy and smoke-runner).

Admin structure (front-end + API)
--------------------------------
- Admin UI page (frontend): `https://www.fixeasy.irish/admin/dashboard` (deployed Next.js page)
- Admin login API (backend): `/admin/login` — POST { email, password } → returns JWT in `access_token` or `token`.
- Admin summary API (backend): `/admin/summary` — GET, requires Authorization: Bearer <token>, returns counts (users, professionals, bookings, payments) and totalRevenue.

Prerequisites for production deploys
-----------------------------------
- Vercel account and a Personal Token (`VERCEL_TOKEN`) for CLI automated deploys.
- Move production secrets out of repo files into Vercel environment variables (Project Settings → Environment Variables):
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `JWT_SECRET`
  - `ADMIN_USER` / `ADMIN_PASS`
  - `NEXT_PUBLIC_API_URL` (frontend config pointing to backend URL)

Manual deployment (PowerShell on Windows)
----------------------------------------
1) Install Vercel CLI if needed (PowerShell):

```powershell
npm i -g vercel
```

2) From a PowerShell prompt set the token and deploy:

```powershell
#$env:VERCEL_TOKEN = '<your_token_here>'   # temporary for this session
cd C:\Users\DELL\Desktop\fixeasy-frontend
# Deploy frontend (next app at repo root / app/)
npx vercel --prod

# Deploy backend (canonical folder)
cd backend\backend-main
npx vercel --prod
```

Notes:
- `npx vercel --prod` will upload the folder it runs in.
- Be sure to run the backend deploy from `backend/backend-main` (this folder contains the working `main.py`).

Automated deploys (GitHub Actions)
----------------------------------
- The repo includes CI workflows under `.github/workflows/` that can deploy and/or run smoke tests after deploys. Add `VERCEL_TOKEN` as a GitHub secret to allow the workflow to push deploys.
- We also added a smoke test workflow (`smoke-after-deploy.yml`) that runs `tools/smoke_admin_payment.py` against the `VERCEL_BACKEND_URL` secret. Add `VERCEL_BACKEND_URL` and `SUPABASE_SERVICE_ROLE_KEY` to your repo secrets.

Run backend locally (for testing)
--------------------------------
This project uses WSL in the development instructions but runs equally on Linux/macOS. Example to start the backend inside WSL (Ubuntu):

```powershell
# from Windows PowerShell (runs the command inside WSL):
wsl -d Ubuntu -- bash -lc "cd /mnt/c/Users/DELL/Desktop/fixeasy-frontend/backend/backend-main && ./.venv/bin/python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

# then browse locally:
# http://localhost:8000/admin/login  (POST JSON), http://localhost:8000/admin/summary (GET)
```

Security checklist and best-practices
------------------------------------
1. Do not commit `.env.local` or any secret keys to git. Use Vercel environment variables and GitHub secrets.
2. Rotate any keys that may have been committed historically.
3. If Deployment Protection is enabled on Vercel, add a Protection Bypass secret for CI automation and store the value in a repository secret `VERCEL_PROTECTION_BYPASS`.
4. Limit Vercel firewall rules to trusted sources if applicable and enable Bot Protection where needed.

Troubleshooting tips
--------------------
- If `/admin/login` returns a Vercel auth page (HTML) — that means Deployment Protection / authentication is intercepting requests. Disable protection for the deployment or use a Protection Bypass token for automated tests.
- If `/admin/login` returns 404 after deploy — the deployed artifact may be the wrong folder or the build failed. Check the deployment Build Logs in Vercel and ensure you deployed from `backend/backend-main`.

If you want any of this automated (CI smoke tests, canonical deploy scripts or a checklist in repo settings), tell me which and I will add the necessary workflow or docs.

Local Playwright smoke test (safe run)
-------------------------------------
When running the Playwright admin smoke test locally you want to ensure the dev server is up and avoid port conflicts or the in-memory rate limiter blocking repeated login attempts.

1) Start dev server with the helper that will free port 3000 if needed and then start Next dev:

PowerShell (Windows):

```powershell
cd C:\Users\DELL\Desktop\fixeasy-frontend
node .\scripts\start-dev.js    # or npm run dev:restart
```

macOS / Linux:

```bash
cd /path/to/fixeasy-frontend
./scripts/start-dev.sh
```

The helper will print if port 3000 is in use and which PID(s) were killed. If the script cannot free the port it will warn and still attempt to start Next; you can inspect the PID it printed and decide whether to manually stop that process.

2) Run the Playwright smoke test against the local server (example PowerShell):

```powershell
#$env:PLAYWRIGHT_TEST must be set so the frontend's proxy login shim accepts the credentials
$env:PLAYWRIGHT_TEST='1'
$env:ADMIN_USER='admin@fixeasy.irish'
$env:ADMIN_PASS='your_password_here'
$env:ADMIN_BASE_URL='http://localhost:3000'
npx playwright test tests/admin_smoke.spec.ts --headed=false
```

Notes:
- If you see a 429 on login, the dev proxy rate limiter (in-memory) blocked the request. Restart the dev server (the restart script above resets the limiter) or wait ~60s.
- If you see an EADDRINUSE error, the start helper prints the PID(s) holding the port so you can inspect and kill them safely.

