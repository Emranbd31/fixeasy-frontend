from fastapi import APIRouter
from datetime import datetime, timedelta
import os
from supabase import create_client, Client
import json
from typing import Any, Dict

router = APIRouter()
print("[admin_summary] module loaded")

def get_supabase_client() -> Client:
    # If DEMO mode is enabled, avoid creating a Supabase client.
    demo = os.getenv("DEMO", os.getenv("DEMO_MODE", "")).lower() in ("1", "true", "yes")
    if demo:
        raise RuntimeError("DEMO_MODE")

    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        raise RuntimeError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    return create_client(url, key)

@router.get("/admin/summary")
def admin_summary():
    """Return admin dashboard summary. Computes total users/professionals and 30-day bookings count and payments sum.

    Response shape:
      {
        "users": <int>,
        "professionals": <int>,
        "bookings": <int> (last 30 days),
        "payments": <number> (sum of amount in last 30 days),
        "timestamp": <iso string>
      }
    """
    print("[admin_summary] invoked")
    try:
        sb = get_supabase_client()
        now = datetime.utcnow()
        month_ago = now - timedelta(days=30)

        # all-time counts
        users_all = sb.table("users").select("id", count="exact").execute()
        pros_all = sb.table("professionals").select("id", count="exact").execute()
        bookings_all = sb.table("bookings").select("id", count="exact").execute()
        payments_all = sb.table("payments").select("amount", count="exact").execute()

        # 30-day counts / sums
        bookings_30d = sb.table("bookings").select("id", count="exact").gte("created_at", month_ago.isoformat()).execute()
        payments_30d = sb.table("payments").select("amount", count="exact").gte("created_at", month_ago.isoformat()).execute()

        def safe_count(r):
            # prefer the count attribute returned by supabase client when present
            c = getattr(r, "count", None)
            if c is None:
                return int(len(r.data or []))
            try:
                return int(c)
            except Exception:
                return int(len(r.data or []))

        def safe_sum(r):
            total = 0.0
            for p in (r.data or []):
                try:
                    total += float(p.get("amount") or 0)
                except Exception:
                    continue
            return total

        # Provide both all-time and 30-day metrics. Also include legacy keys
        # (`users`, `professionals`, `bookings`, `payments`) for backward
        # compatibility with the existing frontend which expects those names.
        users_total = safe_count(users_all)
        professionals_total = safe_count(pros_all)
        bookings_total = safe_count(bookings_all)
        payments_total = safe_sum(payments_all)
        bookings_30 = safe_count(bookings_30d)
        payments_30 = safe_sum(payments_30d)

        return {
            # new explicit fields
            "users_total": users_total,
            "professionals_total": professionals_total,
            "bookings_total": bookings_total,
            "payments_total": payments_total,
            "bookings_30d": bookings_30,
            "payments_30d": payments_30,
            # legacy fields (map to the most useful values):
            # keep `users` and `professionals` as all-time totals,
            # and `bookings`/`payments` as 30-day values to preserve
            # the prior UI semantics.
            "users": users_total,
            "professionals": professionals_total,
            "bookings": bookings_30,
            "payments": payments_30,
            "timestamp": datetime.utcnow().isoformat(),
            "demo": False,
        }
    except Exception as e:
        # Log the traceback and return a structured error payload. No local demo
        # snapshot will be used — the backend should reflect live data only.
        import traceback
        tb = traceback.format_exc()
        print("Admin summary error:", tb)
        return {
            "users": 0,
            "professionals": 0,
            "bookings": 0,
            "payments": 0.0,
            "timestamp": datetime.utcnow().isoformat(),
            "error": "data_unavailable",
            "detail": str(e),
        }


@router.get("/admin/health")
def admin_health():
    """Simple health check for admin UI to verify API and DB connectivity."""
    try:
        # quick supabase sanity check: attempt to list 1 user id (doesn't require service role strictly)
        supabase = get_supabase_client()
        # we won't fail hard if this call errors; wrap in try/except
        db_ok = False
        try:
            _res = supabase.table("users").select("id", count="exact").limit(1).execute()
            db_ok = True
        except Exception:
            db_ok = False

        return {"db": "OK" if db_ok else "UNAVAILABLE", "api": "OK", "timestamp": datetime.utcnow().isoformat()}
    except Exception as e:
        return {"db": "UNAVAILABLE", "api": "ERROR", "error": str(e), "timestamp": datetime.utcnow().isoformat()}
