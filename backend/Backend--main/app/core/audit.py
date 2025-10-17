from __future__ import annotations

from typing import Any, Dict, Optional

from supabase import Client

from .supabase import get_service_client

_audit_client: Client | None = None


def _client() -> Client:
  global _audit_client
  if _audit_client is None:
    _audit_client = get_service_client()
  return _audit_client


def record_audit_event(
  *,
  actor_id: Optional[str],
  action: str,
  resource_type: str,
  resource_id: Optional[str] = None,
  new_values: Optional[Dict[str, Any]] = None,
  previous_values: Optional[Dict[str, Any]] = None,
  metadata: Optional[Dict[str, Any]] = None,
) -> None:
  payload = {
    "actor_id": actor_id,
    "action": action,
    "resource_type": resource_type,
    "resource_id": resource_id,
    "new_values": new_values or {},
    "previous_values": previous_values or {},
    "metadata": metadata or {},
  }

  try:
    _client().table("audit_logs").insert(payload).execute()
  except Exception:
    # audit failures should not block primary flow
    pass
