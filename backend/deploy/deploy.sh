#!/bin/bash
set -e
cd /srv/backend
echo "🔁 Pulling latest image..."
docker compose pull
echo "🚀 Restarting backend..."
docker compose up -d
echo "✅ FixEasy backend updated successfully at $(date)"