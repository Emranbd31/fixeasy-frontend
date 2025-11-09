"""Health-check endpoints for FixEasy backend."""
from __future__ import annotations

import asyncio
import logging
import os
from datetime import datetime, timezone
from typing import Callable, Optional

from fastapi import APIRouter

logger = logging.getLogger("fixeasy.health")
logger.setLevel(logging.INFO)

router = APIRouter(tags=["Health"])

# Attempt to import the Supabase helper lazily; failure only impacts health checks.
try:  # pragma: no cover - import errors handled at runtime
    from services.supabase_service import table  # type: ignore
except Exception:  # pragma: no cover - runtime environment without supabase helper
    table = None  # type: ignore[misc]


async def _run_in_thread(func: Callable[[], object]) -> object:
    """Execute a synchronous callable in a worker thread."""
    return await asyncio.to_thread(func)


async def _check_db(timeout_sec: float = 1.5) -> tuple[str, Optional[str]]:
    """Perform a lightweight Supabase query to validate connectivity."""
    if table is None:
        message = "Supabase client unavailable"
        logger.warning("DB health check skipped: %s", message)
        return "fail", message

    table_name = os.getenv("SUPABASE_HEALTH_TABLE", "profiles")
    projection = os.getenv("SUPABASE_HEALTH_COLUMN", "id")

    def _ping() -> object:
        # The Supabase REST client is synchronous; run it off the event loop thread.
        return (
            table(table_name)
            .select(projection)
            .limit(1)
            .execute(timeout=timeout_sec)
        )

    try:
        await asyncio.wait_for(_run_in_thread(_ping), timeout=timeout_sec)
        return "ok", None
    except asyncio.TimeoutError:
        logger.exception("DB health check timed out")
        return "fail", "database timeout"
    except Exception as exc:  # pragma: no cover - requires live Supabase client
        logger.exception("DB health check failed")
        return "fail", str(exc)


def _git_sha() -> str:
    for env_var in ("VERCEL_GIT_COMMIT_SHA", "GIT_COMMIT", "SOURCE_VERSION"):
        value = os.getenv(env_var)
        if value:
            return value
    return "unknown"


def _timestamp() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


@router.get("/healthz", summary="Liveness probe", include_in_schema=False)
async def healthz() -> dict[str, str]:
    """Return a simple response indicating the application is running."""
    logger.debug("Healthz probe requested")
    return {"api": "ok", "ts": _timestamp()}


@router.get("/admin/health", summary="Readiness probe", include_in_schema=False)
async def admin_health() -> dict[str, object]:
    """Return application and database health information."""
    db_status, error = await _check_db()
    api_status = "ok" if db_status == "ok" else "fail"

    payload: dict[str, object] = {
        "db": db_status,
        "api": api_status,
        "version": _git_sha(),
        "ts": _timestamp(),
    }
    if error:
        payload["error"] = error[:300]
    return payload


__all__ = ["router"]
