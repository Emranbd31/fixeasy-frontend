"""Admin routes for FixEasy backend."""

from fastapi import APIRouter

router = APIRouter()


@router.get("/ping", tags=["admin"])
def ping() -> dict[str, str]:
    """Return a simple ping response for health checks."""
    return {"message": "Admin service reachable"}
