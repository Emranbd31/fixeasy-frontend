# Deployment notes

This file documents the canonical deployment target and a short secure checklist for production deploys.

## Canonical backend for production

- Use `backend/backend-main` as the canonical production backend folder. This folder contains `main.py`, `requirements.txt` and a `vercel.json` tuned for the Python FastAPI app. Deploy from this folder to avoid accidental frontend/backend flips.

## Secure deployment checklist

1. Move any secrets out of local files (for example, `.env.local`) and into Vercel Project Environment Variables. Do not commit service-role keys or other credentials to git.
2. Rotate any keys that may have been present in the repo since they may have been exposed.
3. Add the following secrets to the repository or Vercel project as appropriate:
	- `SUPABASE_SERVICE_ROLE_KEY` (if CI needs to query Supabase)
	- `VERCEL_TOKEN` (if you want automated CLI deploys from CI)
	- `VERCEL_PROTECTION_BYPASS` (optional — for CI automation against protected deployments)
4. If Deployment Protection is enabled, configure a Protection Bypass secret in Vercel (Project → Settings → Deployment Protection → Protection Bypass for Automation) and mirror that value into the `VERCEL_PROTECTION_BYPASS` secret for CI.
5. Limit firewall rules to only trusted IPs or ranges where possible and enable Bot Protection if appropriate.

## Automated smoke test (CI)

We recommend running a small smoke check after production deploys to validate that `/admin/login` and `/admin/summary` work end-to-end. Below is a sample GitHub Actions workflow (kept conservative):

- Create a repository secret named `VERCEL_BACKEND_URL` with your backend production URL (for example `https://fixeasy-backend-...vercel.app`).
- Optionally add `VERCEL_PROTECTION_BYPASS` and `SUPABASE_SERVICE_ROLE_KEY` if needed by the smoke script.

See `.github/workflows/smoke-after-deploy.yml` for an example workflow that installs Python, runs the smoke script, and reports the result.

## Notes

- Consolidate to a single `vercel.json` per intended deploy target and keep `backend/backend-main` as the source of truth.
- Do not share secrets in chat or code; use GitHub/Vercel secrets instead.
