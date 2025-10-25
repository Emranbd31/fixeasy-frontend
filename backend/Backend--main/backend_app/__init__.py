"""FixEasy backend FastAPI application factory."""

from __future__ import annotations

import os
from datetime import datetime, timezone
from typing import Iterable

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

_DEFAULT_ALLOWED_ORIGINS: list[str] = [
    "https://fixeasy.irish",
    "https://www.fixeasy.irish",
    "http://localhost:3000",
]


def _get_allowed_origins() -> list[str]:
    env_value = os.getenv("CORS_ALLOWED_ORIGINS") or os.getenv("ALLOWED_ORIGINS", "")
    if not env_value:
        return _DEFAULT_ALLOWED_ORIGINS.copy()

    origins: Iterable[str] = (
        origin.strip() for origin in env_value.split(",") if origin.strip()
    )
    parsed = list(dict.fromkeys(origins))  # Preserve order & deduplicate
    return parsed or _DEFAULT_ALLOWED_ORIGINS.copy()


def create_app() -> FastAPI:
    """Create and configure the FastAPI application instance."""
    app = FastAPI(title="FixEasy Backend", version="1.0.0")

    allowed_origins = _get_allowed_origins()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/", tags=["Health"])
    async def root() -> dict[str, str]:
        return {"message": "FixEasy backend is running"}

    @app.get("/status", tags=["Health"])
    async def status() -> dict[str, str]:
        return {
            "status": "ok",
            "checkedAt": datetime.now(timezone.utc).isoformat(),
        }

    @app.get("/health", tags=["Health"])
    async def health() -> dict[str, str]:
        return {"status": "healthy"}

    return app


app = create_app()

__all__ = ["app", "create_app"]
