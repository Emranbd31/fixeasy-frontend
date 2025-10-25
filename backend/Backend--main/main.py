"""FixEasy backend service configuration."""

from __future__ import annotations

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


def _parse_origins(raw_origins: str | None) -> list[str]:
    """Split and normalise the comma separated origins string."""

    if not raw_origins:
        return ["*"]

    origins = [origin.strip() for origin in raw_origins.split(",")]
    return [origin for origin in origins if origin]


ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
ALLOWED_ORIGINS = _parse_origins(os.getenv("CORS_ALLOWED_ORIGINS"))

app = FastAPI(title="FixEasy Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if "*" in ALLOWED_ORIGINS else ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Health"])
async def root() -> dict[str, str]:
    """Return a simple status payload for the root endpoint."""

    return {"message": "FixEasy backend is running", "environment": ENVIRONMENT}


@app.get("/health", tags=["Health"])
async def health() -> dict[str, str]:
    """Expose the historic health check endpoint expected by the frontend."""

    return {"status": "ok", "environment": ENVIRONMENT}


@app.get("/status", tags=["Health"])
async def status() -> dict[str, str]:
    """Maintain the newer status endpoint for backwards compatibility."""

    return {"message": "Backend active ✅", "environment": ENVIRONMENT}
