#!/bin/bash

echo "🚀 Auto-deploying FixEasy frontend..."

git add .
git commit -m "Auto build & deploy"
git push origin main

echo "🔄 Waiting for Vercel GitHub integration to build & deploy https://fixeasy.irish..."

echo "✅ FixEasy changes pushed! Vercel will publish the production build automatically."
