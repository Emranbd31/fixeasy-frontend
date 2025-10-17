#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="$ROOT_DIR/frontend/Frontend--main"
BACKEND_DIR="$ROOT_DIR/backend/Backend--main"

run_frontend_build() {
  echo "📦 Installing frontend dependencies..."
  pushd "$FRONTEND_DIR" >/dev/null
  if ! npm ci; then
    echo "⚠️ npm ci failed, attempting npm install"
    if ! npm install; then
      echo "⚠️ npm install failed, attempting npm install --legacy-peer-deps"
      if ! npm install --legacy-peer-deps; then
        echo "❌ Unable to install frontend dependencies."
        popd >/dev/null
        return 1
      fi
    fi
  fi
  echo "🏗️ Building frontend..."
  npm run build
  popd >/dev/null
}

run_backend_build() {
  echo "📦 Preparing backend virtualenv..."
  pushd "$BACKEND_DIR" >/dev/null
  python -m venv .venv
  source .venv/bin/activate
  pip install --upgrade pip
  if ! pip install -r requirements.txt; then
    deactivate >/dev/null 2>&1 || true
    popd >/dev/null
    return 1
  fi
  echo "🏃‍♂️ Launching backend health check..."
  python -m uvicorn main:app --host 127.0.0.1 --port 8000 --limit-concurrency 1 --timeout-keep-alive 5 &
  UVICORN_PID=$!
  sleep 5
  if ! curl -fsS http://127.0.0.1:8000/health; then
    echo "❌ Backend health endpoint not reachable"
    kill "$UVICORN_PID" >/dev/null 2>&1 || true
    wait "$UVICORN_PID" >/dev/null 2>&1 || true
    deactivate >/dev/null 2>&1 || true
    popd >/dev/null
    return 1
  fi
  kill "$UVICORN_PID" >/dev/null 2>&1 || true
  wait "$UVICORN_PID" >/dev/null 2>&1 || true
  deactivate >/dev/null 2>&1 || true
  popd >/dev/null
}

run_frontend_build
run_backend_build
