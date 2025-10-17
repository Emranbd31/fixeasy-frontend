# FixEasy Backend Deployment

The FastAPI application is deployed via Vercel under the project
**fixeasy-backend**. The repository is structured so that Vercel can auto-detect
the backend by using the `backend/Backend--main` directory as the project root.

## Required environment variables

- `SUPABASE_URL`
- `SUPABASE_JWT_SECRET`
- `SUPABASE_SERVICE_ROLE`
- `SUPABASE_SERVICE_KEY`
- `CORS_ALLOWED_ORIGINS`
- `ENVIRONMENT`
- `ENFORCE_HTTPS`
- `PYTHON_VERSION`

These values can be configured in the Vercel dashboard or stored as encrypted
environment variables in Git.

## Build & run commands

- **Install command:** `pip install -r requirements.txt`
- **Build command:** `pip install -r requirements.txt`
- **Start command:** `uvicorn main:app --host 0.0.0.0 --port 8000`

For local validation you can use the helper script in the repository root:

```bash
./scripts/verify-builds.sh
```
