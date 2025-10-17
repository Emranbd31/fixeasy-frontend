from __future__ import annotations

from pydantic import BaseModel, Field


class SignedUploadRequest(BaseModel):
  bucket: str = Field(..., min_length=3)
  path: str = Field(..., min_length=3)
  content_type: str = Field(..., alias="contentType")
  content_length: int = Field(..., alias="contentLength", le=10 * 1024 * 1024)


class SignedUploadResponse(BaseModel):
  url: str
  token: str
  expires_in: int = Field(..., alias="expiresIn")


class SignedDownloadRequest(BaseModel):
  bucket: str
  path: str


class SignedDownloadResponse(BaseModel):
  url: str
  expires_in: int = Field(..., alias="expiresIn")
