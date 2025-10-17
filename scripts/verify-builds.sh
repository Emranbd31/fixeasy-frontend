#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="$ROOT_DIR/frontend/Frontend--main"
BACKEND_DIR="$ROOT_DIR/backend/Backend--main"

printf '\n==> Building FixEasy frontend (Next.js)\n'
(
  cd "$FRONTEND_DIR"
  npm ci
  npm run build
)

printf '\n==> Verifying FixEasy backend (FastAPI)\n'
(
  cd "$BACKEND_DIR"
  python3 -m venv .venv
  source .venv/bin/activate
  pip install -r requirements.txt
  python - <<'PY'
from main import app
from fastapi.testclient import TestClient

client = TestClient(app)
response = client.get("/health")
response.raise_for_status()
print("Backend health response:", response.json())
PY
)

printf '\nAll builds completed successfully.\n'
