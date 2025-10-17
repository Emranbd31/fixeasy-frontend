from __future__ import annotations

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from .core.config import get_settings
from .core.logging import configure_logging
from .core.rate_limit import limiter, rate_limit_exceeded_handler
from .dependencies.auth import current_user
from .middleware.auth_middleware import AuthMiddleware
from .middleware.logging_middleware import LoggingMiddleware
from .routers import bookings, storage

settings = get_settings()
configure_logging()
app = FastAPI(title="FixEasy API", version="1.0.0", debug=settings.environment != "production")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

if settings.enforce_https:
  app.add_middleware(HTTPSRedirectMiddleware)

app.add_middleware(
  CORSMiddleware,
  allow_origins=settings.cors_origins,
  allow_credentials=True,
  allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allow_headers=["Authorization", "Content-Type"],
)

app.add_middleware(
  AuthMiddleware,
  exempt_paths=("/health", "/auth/verify", "/docs", "/openapi.json", "/redoc"),
)
app.add_middleware(LoggingMiddleware)


@app.get("/health")
def health_check():
  return {"status": "ok", "service": "fixeasy-api"}


@app.get("/auth/verify")
def verify_token(user=Depends(current_user)):
  return {
    "user_id": user.get("sub"),
    "role": user.get("role") or user.get("app_metadata", {}).get("role"),
    "email": user.get("email"),
  }


app.include_router(bookings.router)
app.include_router(storage.router)
