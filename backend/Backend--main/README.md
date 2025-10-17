# FixEasy Backend

This directory hosts the FastAPI application that powers the FixEasy API. The
project is configured for deployment on Vercel via the accompanying
`vercel.json` and expects the Supabase credentials described in the deployment
guide.

## Local development

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The root endpoint (`/`) returns a welcome message, while `/health` can be used
for health checks.
