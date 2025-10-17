from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client

from ..core.audit import record_audit_event
from ..core.rate_limit import limiter
from ..core.supabase import get_service_client
from ..dependencies import auth
from ..models.storage import (
  SignedDownloadRequest,
  SignedDownloadResponse,
  SignedUploadRequest,
  SignedUploadResponse,
)

router = APIRouter(prefix="/storage", tags=["storage"])

supabase: Client = get_service_client()
ALLOWED_TYPES = {"application/pdf", "image/jpeg", "image/png"}
EXPIRY_SECONDS = 300


def _sanitize_path(path: str) -> str:
  if ".." in path:
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid path")
  return path.strip("/")


@router.post("/sign-upload", response_model=SignedUploadResponse)
@limiter.limit("6/hour")
async def sign_upload(
  payload: SignedUploadRequest,
  user=Depends(auth.require_professional),
):
  if payload.content_type not in ALLOWED_TYPES:
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported file type")

  sanitized_path = _sanitize_path(payload.path)
  bucket = payload.bucket

  result = supabase.storage.from_(bucket).create_signed_upload_url(
    sanitized_path,
    EXPIRY_SECONDS,
    options={"contentType": payload.content_type},
  )

  if not result:
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to sign upload")

  signed_url = result.get("signed_url") or result.get("signedURL")
  if not signed_url:
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to sign upload")

  payload = SignedUploadResponse(
    url=signed_url,
    token=result.get("token", ""),
    expires_in=EXPIRY_SECONDS,
  )
  record_audit_event(
    actor_id=user.get("sub"),
    action="storage.sign_upload",
    resource_type="storage_object",
    resource_id=sanitized_path,
    metadata={"bucket": bucket},
  )
  return payload


@router.post("/sign-download", response_model=SignedDownloadResponse)
@limiter.limit("20/hour")
async def sign_download(
  payload: SignedDownloadRequest,
  user=Depends(auth.require_professional),
):
  sanitized_path = _sanitize_path(payload.path)
  bucket = payload.bucket

  result = supabase.storage.from_(bucket).create_signed_url(sanitized_path, EXPIRY_SECONDS)
  if not result:
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to sign download")

  signed_url = result.get("signedURL") or result.get("signed_url")
  if not signed_url:
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to sign download")

  record_audit_event(
    actor_id=user.get("sub"),
    action="storage.sign_download",
    resource_type="storage_object",
    resource_id=sanitized_path,
    metadata={"bucket": bucket},
  )

  return SignedDownloadResponse(url=signed_url, expires_in=EXPIRY_SECONDS)
