"""Admin-facing API routes."""
from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter

from services.analytics_service import get_admin_summary
from services.supabase_service import table

router = APIRouter(prefix="/admin", tags=["Admin"])


def log_action(action: str, actor: str | None = "admin") -> None:
    """Persist admin activity without interrupting primary flow."""
    try:
        table("activity_logs").insert(
            {
                "action": action,
                "actor": actor,
                "timestamp": datetime.utcnow().isoformat(),
            }
        ).execute()
    except Exception:  # pragma: no cover
        return


@router.get("/summary")
def admin_summary() -> dict[str, int]:
    """Return high level Supabase metrics for dashboards.

    NOTE: temporarily public for integration/testing. Re-add authentication
    (Depends(verify_admin_token)) once frontend integration is complete.
    """
    # Log an unauthenticated admin summary view (do not fail on logging)
    try:
        log_action("admin_summary_view", "anonymous")
    except Exception:
        pass
    return get_admin_summary()


__all__ = ["router"]
