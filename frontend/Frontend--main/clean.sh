#!/bin/bash
echo "🧹 Cleaning FixEasy frontend..."

# Stop any running dev servers
pkill -f "next dev" 2>/dev/null

# Remove caches & duplicates
rm -rf node_modules .next .vercel

# Keep images, just clean the rest
echo "📦 Reinstalling dependencies..."
npm install

echo "🚀 Starting FixEasy frontend..."
npm run dev
