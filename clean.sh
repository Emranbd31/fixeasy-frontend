#!/bin/bash
set -euo pipefail

echo "🧹 Cleaning FixEasy frontend..."

FRONTEND_DIR="frontend/Frontend--main"

# Stop any running dev servers
pkill -f "next dev" 2>/dev/null || true

pushd "$FRONTEND_DIR" >/dev/null

# Remove caches & duplicates
rm -rf node_modules .next .vercel

# Keep images, just clean the rest
echo "📦 Reinstalling dependencies..."
npm install

echo "🚀 Starting FixEasy frontend..."
npm run dev

popd >/dev/null
