#!/usr/bin/env bash
PORT=${PORT:-3000}
echo "[start-dev.sh] Ensuring port $PORT is free..."
if command -v lsof >/dev/null 2>&1; then
  PIDS=$(lsof -t -i :$PORT || true)
elif command -v ss >/dev/null 2>&1; then
  PIDS=$(ss -ltnp "sport = :$PORT" 2>/dev/null | awk -F"pid=" '{for(i=2;i<=NF;i++){split($i,a,","); print a[1]}}' | sort -u || true)
else
  echo "[start-dev.sh] Warning: neither lsof nor ss found; cannot safely detect processes on port $PORT"
  PIDS=""
fi

if [ -n "$PIDS" ]; then
  echo "[start-dev.sh] Found PIDs: $PIDS. Killing..."
  for p in $PIDS; do
    kill -9 $p 2>/dev/null || echo "[start-dev.sh] failed to kill $p"
  done
  sleep 1
  echo "[start-dev.sh] Done."
else
  echo "[start-dev.sh] Port $PORT appears free."
fi

echo "[start-dev.sh] Starting dev server: npm run dev"
npm run dev
