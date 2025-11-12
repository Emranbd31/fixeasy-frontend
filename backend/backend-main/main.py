
from fastapi import FastAPI, HTTPException, Request, Response, status, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
from datetime import datetime, timedelta
import time
from collections import defaultdict
try:
    import redis
except Exception:
    redis = None
try:
    from utils.auth import verify_admin_token
except Exception:
    verify_admin_token = None
try:
    import jwt  # PyJWT
except ImportError:
    jwt = None
try:
    from supabase import create_client
except Exception:
    create_client = None

app = FastAPI()

# --- CORS middleware: restrict origins to frontend domains ---
try:
    from fastapi.middleware.cors import CORSMiddleware
    origins = [
        "https://fixeasy.irish",
        "https://www.fixeasy.irish",
    ]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )
except Exception:
    pass

# Simple in-memory rate limiter (per-IP) for POST /admin/login
_rate_limit_store: dict = defaultdict(list)
RATE_LIMIT_MAX = 5
RATE_LIMIT_WINDOW = 60

# Optional Redis-backed limiter. If REDIS_URL present and redis module is installed
# we'll use INCR+EXPIRE on a key per IP. Otherwise fall back to in-memory limiter.
_redis_client = None
REDIS_URL = os.getenv("REDIS_URL") or os.getenv("REDIS_HOST")
if redis and REDIS_URL:
    try:
        _redis_client = redis.from_url(REDIS_URL)
    except Exception:
        _redis_client = None

async def rate_limit_dependency(request: Request):
    if request.method.upper() != "POST" or request.url.path != "/admin/login":
        return
    ip = request.client.host if request.client else "unknown"

    # Redis path
    if _redis_client:
        try:
            key = f"rl:{ip}"
            current = _redis_client.get(key)
            current_val = int(current) if current else 0
            if current_val >= RATE_LIMIT_MAX:
                return Response(content="Too many requests", status_code=status.HTTP_429_TOO_MANY_REQUESTS)
            # atomic increment with expiry
            pipe = _redis_client.pipeline()
            pipe.incr(key)
            pipe.expire(key, RATE_LIMIT_WINDOW)
            pipe.execute()
            return
        except Exception:
            # fallback to in-memory if redis fails
            pass

    # In-memory fallback
    now = time.time()
    calls = _rate_limit_store.get(ip, [])
    calls = [t for t in calls if now - t < RATE_LIMIT_WINDOW]
    if len(calls) >= RATE_LIMIT_MAX:
        return Response(content="Too many requests", status_code=status.HTTP_429_TOO_MANY_REQUESTS)
    calls.append(now)
    _rate_limit_store[ip] = calls

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

    # Mount admin professionals router so /admin/professionals endpoints are exposed
    try:
        from routers.admin_professionals import router as admin_professionals_router
        app.include_router(admin_professionals_router)
    except Exception as e:
        try:
            print("[main] failed to include admin_professionals router:", str(e))
        except Exception:
            pass

    # Comment: legacy admin_login router intentionally not included to avoid duplicate routes
    try:
        # from routers.admin_login import router as admin_login_router
        # app.include_router(admin_login_router)
        pass
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
def admin_login(body: AdminLoginRequest, rl: None = Depends(rate_limit_dependency)):
    ADMIN_USER = os.getenv("ADMIN_USER")
    ADMIN_PASS = os.getenv("ADMIN_PASS")
    if not ADMIN_USER or not ADMIN_PASS:
        raise HTTPException(status_code=500, detail="ADMIN_USER/ADMIN_PASS not configured")

    if body.email == ADMIN_USER and body.password == ADMIN_PASS:
        token = _issue_jwt(body.email)
        return {"token": token, "user": {"email": body.email}}
    raise HTTPException(status_code=401, detail="Invalid credentials")


@app.get("/admin/pending")
def admin_pending():
    """Return pending professionals (verified == false)."""
    SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL") or ""
    SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY") or os.getenv("SUPABASE_SERVICE_KEY")
    if not SUPABASE_URL or not SERVICE_KEY or create_client is None:
        return JSONResponse({"error": "Supabase not configured", "data": []}, status_code=503)
    try:
        sb = create_client(SUPABASE_URL, SERVICE_KEY)
        res = sb.table("professionals").select("*").eq("verified", False).execute()
        data = None
        if isinstance(res, dict):
            data = res.get("data", [])
        else:
            data = getattr(res, "data", []) or []
        return {"data": data}
    except Exception as exc:
        try:
            print("[admin/pending] error:", str(exc))
        except Exception:
            pass
        return JSONResponse({"error": "Supabase query failed", "data": []}, status_code=503)


# Expose professionals management endpoints directly in main.py so they're
# available even if importing the routers package fails at runtime in some
# deployment environments.
@app.get("/admin/professionals")
def list_professionals(claims: dict | None = Depends(verify_admin_token) if verify_admin_token else None):
    SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL") or ""
    SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY") or os.getenv("SUPABASE_SERVICE_KEY")
    if not SUPABASE_URL or not SERVICE_KEY or create_client is None:
        return JSONResponse({"error": "Supabase not configured", "data": []}, status_code=503)
    try:
        sb = create_client(SUPABASE_URL, SERVICE_KEY)
        resp = sb.table("professionals").select("id,name,service,verified,created_at,email").execute()
        data = None
        if isinstance(resp, dict):
            data = resp.get("data", [])
        else:
            data = getattr(resp, "data", []) or []
        # normalize created_at
        for row in data:
            if row.get("created_at") is not None:
                try:
                    row["created_at"] = row["created_at"].isoformat() if hasattr(row["created_at"], "isoformat") else str(row["created_at"])
                except Exception:
                    row["created_at"] = str(row.get("created_at"))
        return {"data": data}
    except Exception as exc:
        try:
            print("[admin/professionals] list error:", str(exc))
        except Exception:
            pass
        return JSONResponse({"error": "Supabase query failed", "data": []}, status_code=503)


@app.patch("/admin/professionals/{pro_id}/verify")
def verify_professional(pro_id: str, claims: dict | None = Depends(verify_admin_token) if verify_admin_token else None):
    SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL") or ""
    SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY") or os.getenv("SUPABASE_SERVICE_KEY")
    if not SUPABASE_URL or not SERVICE_KEY or create_client is None:
        return JSONResponse({"error": "Supabase not configured"}, status_code=503)
    try:
        sb = create_client(SUPABASE_URL, SERVICE_KEY)
        res = sb.table("professionals").update({"verified": True}).eq("id", pro_id).execute()
        data = None
        if isinstance(res, dict):
            data = res.get("data")
        else:
            data = getattr(res, "data", None)
        if not data:
            return JSONResponse({"error": "not found"}, status_code=404)
        return {"ok": True}
    except Exception as exc:
        try:
            print("[admin/professionals] verify error:", str(exc))
        except Exception:
            pass
        return JSONResponse({"error": "Supabase update failed"}, status_code=500)


@app.patch("/admin/professionals/{pro_id}/reject")
def reject_professional(pro_id: str, claims: dict | None = Depends(verify_admin_token) if verify_admin_token else None):
    SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL") or ""
    SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY") or os.getenv("SUPABASE_SERVICE_KEY")
    if not SUPABASE_URL or not SERVICE_KEY or create_client is None:
        return JSONResponse({"error": "Supabase not configured"}, status_code=503)
    try:
        sb = create_client(SUPABASE_URL, SERVICE_KEY)
        res = sb.table("professionals").update({"verified": False}).eq("id", pro_id).execute()
        data = None
        if isinstance(res, dict):
            data = res.get("data")
        else:
            data = getattr(res, "data", None)
        if not data:
            return JSONResponse({"error": "not found"}, status_code=404)
        return {"ok": True}
    except Exception as exc:
        try:
            print("[admin/professionals] reject error:", str(exc))
        except Exception:
            pass
        return JSONResponse({"error": "Supabase update failed"}, status_code=500)

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
