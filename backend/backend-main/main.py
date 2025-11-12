
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
from datetime import datetime, timedelta
try:
    import jwt  # PyJWT
except ImportError:
    jwt = None
try:
    from supabase import create_client
except Exception:
    create_client = None

app = FastAPI()

# Mount routers implemented in the `routers/` package. This is defensive: if
# the router fails to import (misconfigured env or missing deps) the app
# continues to run but the failure is logged. This exposes `/admin/summary`
# implemented in `routers/admin_summary.py` so the frontend can fetch it.
try:
    from routers.admin_summary import router as admin_summary_router
    app.include_router(admin_summary_router)
except Exception as e:
    try:
        print("[main] failed to include admin_summary router:", str(e))
    except Exception:
        pass


class AdminLoginRequest(BaseModel):
    email: str
    password: str


def _issue_jwt(email: str) -> str:
    secret = os.getenv("JWT_SECRET") or os.getenv("JWT_SECRET_KEY")
    if not secret:
        # Developer-friendly error with 500 so we know to set JWT_SECRET
        raise HTTPException(status_code=500, detail="JWT secret not configured")
    payload = {
        "sub": email,
        "role": "admin",
        "exp": datetime.utcnow() + timedelta(hours=24),
        "iat": datetime.utcnow(),
    }
    if not jwt:
        raise HTTPException(status_code=500, detail="PyJWT not installed")
    return jwt.encode(payload, secret, algorithm="HS256")


@app.post("/admin/login")
def admin_login(body: AdminLoginRequest):
    ADMIN_USER = os.getenv("ADMIN_USER")
    ADMIN_PASS = os.getenv("ADMIN_PASS")
    if not ADMIN_USER or not ADMIN_PASS:
        raise HTTPException(status_code=500, detail="ADMIN_USER/ADMIN_PASS not configured")

    if body.email == ADMIN_USER and body.password == ADMIN_PASS:
        token = _issue_jwt(body.email)
        return {"token": token, "user": {"email": body.email}}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/")
def root():
    return {"message": "Welcome to FixEasy Ireland API! Backend is live 🚀"}


@app.get("/health")
def health():
    """Simple health endpoint returning a timestamp."""
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}


@app.get("/admin/revenue")
def admin_revenue():
    """
    Return totalRevenue by summing payments.amount via Supabase using
    SUPABASE_SERVICE_ROLE_KEY. Returns 503 if Supabase unavailable.
    """
    SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL") or ""
    SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY") or os.getenv("SUPABASE_SERVICE_KEY")
    if not SUPABASE_URL or not SERVICE_KEY or create_client is None:
        return JSONResponse({"error": "Supabase not configured", "totalRevenue": 0}, status_code=503)

    try:
        sb = create_client(SUPABASE_URL, SERVICE_KEY)
        res = sb.table("payments").select("amount").execute()
        # Support both response shapes (dict-like or object with .data)
        data = None
        if isinstance(res, dict):
            data = res.get("data")
        else:
            data = getattr(res, "data", None)
        data = data or []
        total = 0.0
        for row in data:
            try:
                if isinstance(row, dict):
                    amt = row.get("amount")
                else:
                    amt = getattr(row, "amount", None)
                if amt is None:
                    continue
                total += float(amt)
            except Exception:
                continue
        return {"totalRevenue": total}
    except Exception as exc:
        try:
            print("[admin/revenue] Supabase query failed:", str(exc))
        except Exception:
            pass
        return JSONResponse({"error": "Supabase unavailable", "totalRevenue": 0}, status_code=503)
