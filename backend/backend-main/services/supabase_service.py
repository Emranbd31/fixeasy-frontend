"""Utility helpers to interact with Supabase REST endpoints.

This lightweight wrapper avoids pulling in the full Supabase Python SDK while
still providing the minimal chainable API that the routers expect.  The
implementation speaks directly to the Supabase PostgREST endpoint using the
service role key so that privileged operations remain server-side.
"""
from __future__ import annotations

import json
import logging
import os
from dataclasses import dataclass, field
from typing import Any, Dict, Optional

import requests

logger = logging.getLogger("fixeasy.supabase")

_SUPABASE_URL = os.getenv("SUPABASE_URL")
_SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not _SUPABASE_URL:
    logger.warning("SUPABASE_URL is not configured; Supabase access disabled")
if not _SUPABASE_KEY:
    logger.warning(
        "SUPABASE_SERVICE_ROLE_KEY is not configured; Supabase access disabled"
    )


@dataclass
class _SupabaseTableQuery:
    """Chainable request builder for a single Supabase table."""

    table_name: str
    method: str = "GET"
    _select: str = "*"
    _limit: Optional[int] = None
    _payload: Optional[Any] = None
    _headers: Dict[str, str] = field(default_factory=dict)

    def select(self, columns: str) -> "_SupabaseTableQuery":
        self._select = columns or "*"
        return self

    def limit(self, count: int) -> "_SupabaseTableQuery":
        self._limit = count
        return self

    def insert(self, payload: Any) -> "_SupabaseTableQuery":
        self.method = "POST"
        self._payload = payload
        # Requesting a minimal return reduces payload size and latency.
        self._headers.setdefault("Prefer", "return=minimal")
        return self

    def execute(self, timeout: Optional[float] = None) -> Any:
        if not _SUPABASE_URL or not _SUPABASE_KEY:
            raise RuntimeError("Supabase credentials are not configured")

        url = f"{_SUPABASE_URL.rstrip('/')}/rest/v1/{self.table_name}"
        headers = {
            "apikey": _SUPABASE_KEY,
            "Authorization": f"Bearer {_SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Accept": "application/json",
            **self._headers,
        }

        params: Dict[str, Any] = {"select": self._select}
        if self._limit is not None:
            params["limit"] = self._limit

        request_timeout = timeout or 5.0
        response = requests.request(
            self.method,
            url,
            headers=headers,
            params=params if self.method.upper() == "GET" else None,
            json=self._payload if self.method.upper() != "GET" else None,
            timeout=request_timeout,
        )

        response.raise_for_status()
        if not response.content:
            return None
        try:
            return response.json()
        except json.JSONDecodeError:
            return response.text


def table(name: str) -> _SupabaseTableQuery:
    """Return a query builder for the requested Supabase table."""

    if not name:
        raise ValueError("Supabase table name must be provided")
    return _SupabaseTableQuery(table_name=name)


__all__ = ["table"]
