# FixEasy Deployment Guide

FixEasy is deployed as two separate Vercel projects that track the same GitHub repository.  Each project must be pointed at the correct sub-directory and provided with the required environment variables for a successful build.

## Repository layout

```
frontend/
  Frontend--main/   # Next.js 14 application
backend/
  Backend--main/    # FastAPI application
```

## Vercel project configuration

### Frontend (`fixeasy-frontend`)

| Setting | Value |
| --- | --- |
| Root Directory | `frontend/Frontend--main` |
| Framework Preset | Next.js |
| Install Command | `npm install --legacy-peer-deps` |
| Build Command | `npm run build` |
| Output Directory | `.next` |
| Development Command | `npm run dev` |

#### Required environment variables
```
NEXT_PUBLIC_SUPABASE_URL=https://wphmhlrttmzsmngysfws.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=<Supabase anon/public key>
NEXT_PUBLIC_API_URL=https://api.fixeasy.irish
NEXT_PUBLIC_SITE_URL=https://fixeasy.irish
NEXT_PUBLIC_ENV=production
NODE_VERSION=18
NEXT_TELEMETRY_DISABLED=1
```

### Backend (`fixeasy-backend`)

| Setting | Value |
| --- | --- |
| Root Directory | `backend/Backend--main` |
| Framework Preset | Python |
| Install Command | `pip install -r requirements.txt` |
| Build Command | `pip install -r requirements.txt` |
| Output Directory | *(leave empty)* |
| Server Start Command | `uvicorn main:app --host 0.0.0.0 --port 8000` |

Set `PYTHON_VERSION=3.11` in the project environment to match local development.

#### Required environment variables
```
SUPABASE_URL=https://wphmhlrttmzsmngysfws.supabase.co
SUPABASE_JWT_SECRET=<Supabase JWT secret>
SUPABASE_SERVICE_ROLE=<Supabase service role key>
# Optional alias also supported: SUPABASE_SERVICE_KEY
CORS_ALLOWED_ORIGINS=https://fixeasy.irish,https://www.fixeasy.irish
ENVIRONMENT=production
ENFORCE_HTTPS=true
```

## Local verification

Before pushing changes you can verify each project locally.  The repository includes a helper script that will run both builds and smoke test the API:

```bash
./scripts/verify-builds.sh
```

If you prefer to execute the steps manually:

```bash
# Frontend
cd frontend/Frontend--main
npm install --legacy-peer-deps
npm run build

# Backend
cd backend/Backend--main
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Once both builds succeed locally, push to `main` and allow the linked Vercel projects to pick up the commit.  The `vercel.json` files inside each sub-project pin the correct build commands, environments, and framework detection so Vercel mirrors the local verification process.
