from __future__ import annotations

from time import perf_counter

import structlog
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

logger = structlog.get_logger("fixeasy.api")


class LoggingMiddleware(BaseHTTPMiddleware):
  async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
    start = perf_counter()
    response = await call_next(request)
    duration = (perf_counter() - start) * 1000

    logger.info(
      "http_request",
      method=request.method,
      path=request.url.path,
      status=response.status_code,
      duration_ms=round(duration, 2),
      user_id=getattr(request.state, "user_id", None),
      client_ip=request.client.host if request.client else None,
    )

    return response
