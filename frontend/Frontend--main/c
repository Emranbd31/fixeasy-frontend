#!/bin/bash
echo "🧹 Cleaning FixEasy frontend environment..."

# Stop any running dev servers
pkill -f "next dev" 2>/dev/null

# Remove heavy or duplicated folders
rm -rf node_modules .next .vercel
rm -rf public/images/* public/hero/*

# Recreate clean folders
mkdir -p public/images

# Re-download default clean images
echo "📸 Downloading fresh images..."
curl -L -o public/images/plumber.jpg https://images.unsplash.com/photo-1581092918390-14a07f23c9e0?auto=format
curl -L -o public/images/cleaner.jpg https://images.unsplash.com/photo-1581574209460-cad2d9c15828?auto=format
curl -L -o public/images/electrician.jpg https://images.unsplash.com/

