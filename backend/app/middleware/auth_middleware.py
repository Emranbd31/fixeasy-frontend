from __future__ import annotations

import time
from typing import Iterable, Optional

import jwt
from fastapi import status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

from ..core.config import get_settings


class AuthMiddleware(BaseHTTPMiddleware):
  def __init__(self, app, exempt_paths: Optional[Iterable[str]] = None):
    super().__init__(app)
    self.settings = get_settings()
    self.exempt_paths = tuple(exempt_paths or ())
    self.audience = "authenticated"

  async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
    start_time = time.perf_counter()

    if request.method.upper() == "OPTIONS":
      return await call_next(request)

    path = request.url.path
    if any(path.startswith(exempt) for exempt in self.exempt_paths):
      return await self._finalise(request, call_next, start_time)

    authorization = request.headers.get("authorization")
    if not authorization or not authorization.lower().startswith("bearer "):
      return JSONResponse({"detail": "Missing bearer token"}, status_code=status.HTTP_401_UNAUTHORIZED)

    token = authorization.split(" ", 1)[1]

    try:
      payload = jwt.decode(
        token,
        self.settings.supabase_jwt_secret,
        algorithms=["HS256"],
        audience=self.audience,
      )
    except jwt.ExpiredSignatureError:
      return JSONResponse({"detail": "Token expired"}, status_code=status.HTTP_401_UNAUTHORIZED)
    except jwt.InvalidTokenError:
      return JSONResponse({"detail": "Invalid token"}, status_code=status.HTTP_401_UNAUTHORIZED)

    request.state.token = token
    request.state.token_payload = payload
    request.state.user_id = payload.get("sub")
    request.state.role = (
      payload.get("role")
      or payload.get("app_metadata", {}).get("role")
      or payload.get("user_metadata", {}).get("role")
    )

    return await self._finalise(request, call_next, start_time)

  async def _finalise(self, request: Request, call_next: RequestResponseEndpoint, start_time: float) -> Response:
    response = await call_next(request)
    duration_ms = (time.perf_counter() - start_time) * 1000
    response.headers["x-request-duration"] = f"{duration_ms:.2f}ms"
    return response
