from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from utils.auth import verify_admin_token
from supabase import create_client
import os
from datetime import datetime

router = APIRouter()

def get_supabase_client():
    """Create and return a Supabase client with service role key."""
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        raise RuntimeError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    return create_client(url, key)

@router.get("/summary")
def get_summary():
    """Return counts of key tables for admin dashboard."""
    summary = {}
    try:
        sb = get_supabase_client()
        tables = ["admins", "bookings", "payments", "professionals", "users"]

        for table in tables:
            try:
                res = sb.table(table).select("id", count="exact").execute()
                if hasattr(res, "count") and res.count is not None:
                    summary[table] = res.count
                else:
                    summary[table] = len(res.data or [])
            except Exception as e:
                summary[table] = f"error: {str(e)}"

        return {
            "status": "ok",
            "timestamp": datetime.utcnow().isoformat(),
            "summary": summary,
        }

    except Exception as e:
        # This ensures even Supabase client errors don’t crash the function
        return {
            "status": "error",
            "message": str(e),
            "timestamp": datetime.utcnow().isoformat(),
        }

@router.get("/verify")
def verify_admin(claims: dict = Depends(verify_admin_token)) -> dict:
    """Return JWT claims when the provided token is valid."""
    return {"ok": True, "claims": claims}


@router.get("/users-payments")
def list_users_payments(
    claims: dict = Depends(verify_admin_token),
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=1000),
    q: str | None = Query(None),
    start_date: str | None = Query(None),
    end_date: str | None = Query(None),
    export_csv: bool = Query(False),
):
    """
    Return all users with their related payments.
    Each record includes: user_id, user_name, user_email, payment_id, amount, status, created_at, updated_at.
    """
    try:
        sb = get_supabase_client()

        # Apply user search filter: find matching user ids if `q` provided
        user_ids = None
        if q:
            try:
                # Search name or email (case-insensitive)
                u1 = sb.table("users").select("id").ilike("email", f"%{q}%").execute()
                u2 = sb.table("users").select("id").ilike("name", f"%{q}%").execute()
                ids = set()
                for r in (u1.data or []):
                    ids.add(r.get("id"))
                for r in (u2.data or []):
                    ids.add(r.get("id"))
                user_ids = list(ids)
            except Exception:
                user_ids = None

        # Build payments query with optional filters
        payments_q = sb.table("payments").select("id, user_id, amount, status, created_at, updated_at", count="exact").order("created_at", {"ascending": False})
        if start_date:
            payments_q = payments_q.gte("created_at", start_date)
        if end_date:
            payments_q = payments_q.lte("created_at", end_date)
        if user_ids:
            payments_q = payments_q.in_("user_id", user_ids)

        # Get total count (execute without range)
        total_res = payments_q.execute()
        total_count = getattr(total_res, "count", None)
        if total_count is None:
            total_count = len(total_res.data or [])

        # Pagination range
        start = (page - 1) * per_page
        end = start + per_page - 1
        paged_res = payments_q.range(start, end).execute()
        payments = paged_res.data or []

        # Fetch users for the page to map names/emails
        uids = list({p.get("user_id") for p in payments if p.get("user_id") is not None})
        users_map = {}
        if uids:
            users_res = sb.table("users").select("id, name, email").in_("id", uids).execute()
            for u in users_res.data or []:
                users_map[u.get("id")] = u

        records = []
        for p in payments:
            u = users_map.get(p.get("user_id"), {"id": p.get("user_id"), "name": None, "email": None})
            records.append({
                "user_id": u.get("id"),
                "user_name": u.get("name"),
                "user_email": u.get("email"),
                "payment_id": p.get("id"),
                "amount": p.get("amount"),
                "status": p.get("status"),
                "created_at": p.get("created_at"),
                "updated_at": p.get("updated_at"),
            })

        if export_csv:
            # Stream CSV
            def iter_csv():
                header = "user_id,user_name,user_email,payment_id,amount,status,created_at,updated_at\n"
                yield header
                for r in records:
                    row = [
                        str(r.get("user_id") or ""),
                        '"' + (str(r.get("user_name") or "")).replace('"', '""') + '"',
                        '"' + (str(r.get("user_email") or "")).replace('"', '""') + '"',
                        str(r.get("payment_id") or ""),
                        str(r.get("amount") or ""),
                        str(r.get("status") or ""),
                        str(r.get("created_at") or ""),
                        str(r.get("updated_at") or ""),
                    ]
                    yield ",".join(row) + "\n"

            return StreamingResponse(iter_csv(), media_type="text/csv")

        return {"records": records, "count": total_count}

    except Exception as e:
        return {"error": str(e)}
