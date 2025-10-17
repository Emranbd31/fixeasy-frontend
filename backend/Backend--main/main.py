"""FixEasy FastAPI application entry point."""
from __future__ import annotations

import os
from typing import List

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse


def _get_allowed_origins() -> List[str]:
    """Parse the comma separated CORS origins from the environment."""
    raw_origins = os.getenv("CORS_ALLOWED_ORIGINS", "")
    return [origin.strip() for origin in raw_origins.split(",") if origin.strip()]


def _https_enforced() -> bool:
    return os.getenv("ENFORCE_HTTPS", "false").lower() in {"1", "true", "yes"}


app = FastAPI(
    title="FixEasy API",
    description="Public API for the FixEasy platform.",
    version=os.getenv("API_VERSION", "1.0.0"),
)

allowed_origins = _get_allowed_origins()
if allowed_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


if _https_enforced():
    @app.middleware("http")
    async def enforce_https(request: Request, call_next):  # type: ignore[override]
        """Redirect non-HTTPS requests to HTTPS when ENFORCE_HTTPS=true."""
        proto = request.headers.get("x-forwarded-proto", request.url.scheme)
        if proto != "https":
            https_url = request.url.replace(scheme="https")
            return RedirectResponse(url=str(https_url), status_code=307)
        return await call_next(request)


@app.get("/")
async def read_root() -> JSONResponse:
    """Default welcome route for uptime checks."""
    message = {
        "message": "Welcome to the FixEasy API",
        "environment": os.getenv("ENVIRONMENT", "development"),
        "supabase_url": os.getenv("SUPABASE_URL", ""),
    }
    return JSONResponse(message)


@app.get("/healthz")
async def health_check() -> JSONResponse:
    """Basic health endpoint to aid deployment diagnostics."""
    return JSONResponse({"status": "ok"})
