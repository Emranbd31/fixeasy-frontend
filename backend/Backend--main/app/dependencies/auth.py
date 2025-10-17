from __future__ import annotations

from fastapi import Depends, HTTPException, Request, status


def current_user(request: Request):
  payload = getattr(request.state, "token_payload", None)
  if not payload:
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
  return payload


def _ensure_role(expected_role: str, payload: dict):
  role = payload.get("role") or payload.get("app_metadata", {}).get("role")
  if role != expected_role:
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
  return payload


def require_client(payload: dict = Depends(current_user)):
  return _ensure_role("client", payload)


def require_professional(payload: dict = Depends(current_user)):
  return _ensure_role("pro", payload)


def require_admin(payload: dict = Depends(current_user)):
  return _ensure_role("admin", payload)
