#!/bin/bash

# Render build script with proper cache handling
set -e

echo "🧹 Cleaning environment..."
rm -rf node_modules package-lock.json

echo "🗑️  Clearing npm cache..."
npm cache clean --force || true

echo "📦 Installing dependencies with legacy peer deps..."
npm install --legacy-peer-deps --no-audit --no-fund

echo "🔧 Running postinstall scripts..."
npm run postinstall || true

echo "🏗️  Building application..."
npm run build

echo "✅ Build completed successfully!"

