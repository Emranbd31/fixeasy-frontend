from functools import lru_cache
from typing import List

from pydantic import BaseSettings, Field


class Settings(BaseSettings):
  supabase_url: str = Field(..., env=["SUPABASE_URL"])
  supabase_jwt_secret: str = Field(..., env=["SUPABASE_JWT_SECRET", "SUPABASE_JWT"])
  supabase_service_role: str | None = Field(
      default=None,
      env=["SUPABASE_SERVICE_ROLE", "SUPABASE_SERVICE_KEY"],
  )
  environment: str = Field(default="development", env="ENVIRONMENT")
  cors_origins: List[str] = Field(
      default_factory=lambda: ["https://fixeasy.irish", "https://www.fixeasy.irish"],
      env=["CORS_ORIGINS", "CORS_ALLOWED_ORIGINS"],
  )
  enforce_https: bool = Field(default=True, env="ENFORCE_HTTPS")

  class Config:
    env_file = ".env"
    case_sensitive = False

  @property
  def project_ref(self) -> str:
    return self.supabase_url.replace("https://", "").split(".")[0]


@lru_cache()
def get_settings() -> Settings:
  settings = Settings()
  if isinstance(settings.cors_origins, str):
    settings.cors_origins = [origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()]
  return settings
