"""FastAPI application entry point for FixEasy backend."""
from __future__ import annotations

import logging
import os
import subprocess
from typing import Optional

from fastapi import FastAPI

# Configure logging as early as possible so that import-time events are captured.
_LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(
    level=_LOG_LEVEL,
    format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
)
logger = logging.getLogger("fixeasy")
logger.info("Initialising FixEasy FastAPI application")

app = FastAPI(title="FixEasy API", version="1.0.0")


def _git_sha() -> str:
    """Return a best-effort git SHA for observability metadata."""
    for env_var in ("VERCEL_GIT_COMMIT_SHA", "GIT_COMMIT", "SOURCE_VERSION"):
        value: Optional[str] = os.getenv(env_var)
        if value:
            return value
    try:
        sha = subprocess.check_output(["git", "rev-parse", "--short", "HEAD"], text=True)
        return sha.strip()
    except Exception:  # pragma: no cover - best effort only
        logger.debug("Falling back to unknown git SHA", exc_info=True)
        return "unknown"


@app.on_event("startup")
async def _startup_event() -> None:
    """Emit a log entry once the application event loop is ready."""
    logger.info("FixEasy FastAPI application startup complete", extra={"git_sha": _git_sha()})


# Health router is always included – it has no external dependencies.
try:
    from routers import health as health_router
except Exception:  # pragma: no cover - defensive: health router should always import
    logger.exception("Failed to import health router")
else:
    app.include_router(health_router.router)

# Other routers may rely on optional dependencies; import defensively.
try:
    from routers import admin as admin_router  # type: ignore
except Exception:
    logger.warning("Admin router not available; continuing without it", exc_info=True)
else:
    app.include_router(admin_router.router)


__all__ = ["app"]
