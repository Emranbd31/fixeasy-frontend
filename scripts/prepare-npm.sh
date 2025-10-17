#!/bin/bash
echo "🔧 Resetting npm registry and clearing cache before build..."
npm config set registry https://registry.npmjs.org/
npm cache clean --force || true
echo "✅ Registry and cache reset complete. Continuing installation..."
