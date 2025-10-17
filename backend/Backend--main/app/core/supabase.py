from __future__ import annotations

from supabase import Client, create_client

from .config import get_settings

_settings = get_settings()


def get_service_client() -> Client:
  if not _settings.supabase_service_role:
    raise RuntimeError("SUPABASE_SERVICE_ROLE (or SUPABASE_SERVICE_KEY) is required for server operations")
  return create_client(_settings.supabase_url, _settings.supabase_service_role)
