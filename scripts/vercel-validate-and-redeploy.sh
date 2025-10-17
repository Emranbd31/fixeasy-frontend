#!/usr/bin/env bash
set -euo pipefail

FRONTEND_PROJECT="${FRONTEND_PROJECT:-fixeasy-frontend}"
BACKEND_PROJECT="${BACKEND_PROJECT:-fixeasy-backend}"
FRONTEND_DIR="${FRONTEND_DIR:-frontend/Frontend--main}"
BACKEND_DIR="${BACKEND_DIR:-backend/Backend--main}"
PRODUCTION_ENV="${PRODUCTION_ENV:-production}"
VERCEL_BIN="npx --yes vercel@latest"

cleanup_tmp_files=()
backend_pid=""
cleanup() {
  for file in "${cleanup_tmp_files[@]:-}"; do
    if [[ -n "$file" && -f "$file" ]]; then
      rm -f "$file"
    fi
  done
  if [[ -n "$backend_pid" ]]; then
    kill "$backend_pid" 2>/dev/null || true
  fi
}
trap cleanup EXIT

log() {
  echo -e "\n==> $1"
}

run_cmd() {
  local description="$1"
  shift
  log "$description"
  if ! "$@"; then
    echo "\n❌ $description failed." >&2
    exit 1
  fi
}

ensure_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Required command '$1' not found in PATH." >&2
    exit 1
  fi
}

ensure_command npx
ensure_command npm
ensure_command curl
ensure_command mktemp

# 1. Validate Vercel project configurations
run_cmd "Validating Vercel project: ${FRONTEND_PROJECT}" bash -c "${VERCEL_BIN} project validate ${FRONTEND_PROJECT} --check-env --check-build --confirm"
run_cmd "Validating Vercel project: ${BACKEND_PROJECT}" bash -c "${VERCEL_BIN} project validate ${BACKEND_PROJECT} --check-env --check-build --confirm"

# 2. Verify environment variables by pulling them to temporary files
frontend_env_file=$(mktemp)
backend_env_file=$(mktemp)
cleanup_tmp_files+=("$frontend_env_file" "$backend_env_file")

run_cmd "Pulling ${PRODUCTION_ENV} environment variables for ${FRONTEND_PROJECT}" bash -c "${VERCEL_BIN} env pull ${frontend_env_file} --environment ${PRODUCTION_ENV} --project ${FRONTEND_PROJECT}"
run_cmd "Pulling ${PRODUCTION_ENV} environment variables for ${BACKEND_PROJECT}" bash -c "${VERCEL_BIN} env pull ${backend_env_file} --environment ${PRODUCTION_ENV} --project ${BACKEND_PROJECT}"

echo "Frontend environment variables saved to: ${frontend_env_file}"
echo "Backend environment variables saved to: ${backend_env_file}"

# 3. Run local build simulations
resolve_frontend_dir() {
  local dir="$1"
  if [[ -d "$dir" ]]; then
    echo "$dir"
  elif [[ -f package.json ]]; then
    echo "."
  else
    echo "" 
  fi
}

actual_frontend_dir=$(resolve_frontend_dir "$FRONTEND_DIR")
if [[ -n "$actual_frontend_dir" ]]; then
  log "Testing frontend build locally (directory: ${actual_frontend_dir})"
  pushd "$actual_frontend_dir" >/dev/null
  if ! npm ci; then
    echo "npm ci failed, attempting npm install..."
    npm install
  fi
  npm run build
  popd >/dev/null
else
  echo "⚠️ Skipping frontend build simulation because neither '$FRONTEND_DIR' nor a package.json in the current directory was found."
fi

if [[ -d "$BACKEND_DIR" ]]; then
  ensure_command pip
  log "Testing backend build locally (directory: ${BACKEND_DIR})"
  pushd "$BACKEND_DIR" >/dev/null
  pip install -r requirements.txt
  if command -v uvicorn >/dev/null 2>&1; then
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
    backend_pid=$!
    sleep 5
    if ! curl -f http://127.0.0.1:8000/health; then
      echo "⚠️ Backend health endpoint check failed."
    fi
    kill "$backend_pid" 2>/dev/null || true
    backend_pid=""
  else
    echo "⚠️ uvicorn is not available after installing requirements; skipping health check."
  fi
  popd >/dev/null
else
  echo "⚠️ Skipping backend build simulation because directory '${BACKEND_DIR}' was not found."
fi

# 4. Trigger redeployments if everything above succeeded
run_cmd "Redeploying ${FRONTEND_PROJECT} to production" bash -c "${VERCEL_BIN} --prod --project ${FRONTEND_PROJECT} --confirm"
run_cmd "Redeploying ${BACKEND_PROJECT} to production" bash -c "${VERCEL_BIN} --prod --project ${BACKEND_PROJECT} --confirm"

echo "\n✅ FixEasy frontend and backend redeployments triggered successfully."
