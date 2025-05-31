#!/bin/bash

# LeafIQ Deployment Script
# This script handles version management and deployment with build timestamps

set -e  # Exit on any error

echo "🚀 LeafIQ Deployment Script"
echo "=========================="

# Get current version
CURRENT_VERSION=$(npm pkg get version | tr -d '"')
echo "📋 Current version: v$CURRENT_VERSION"

# Get current git branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "🌿 Current branch: $CURRENT_BRANCH"

# Generate build timestamp
BUILD_TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
echo "⏰ Build timestamp: $BUILD_TIMESTAMP"

# Set build environment variables
export VITE_BUILD_TIMESTAMP="$BUILD_TIMESTAMP"
export VITE_VERSION="$CURRENT_VERSION"
export VITE_GIT_BRANCH="$CURRENT_BRANCH"

echo ""
echo "🔧 Building application..."

# Build the application
npm run build

echo ""
echo "✅ Build completed successfully!"
echo ""
echo "📦 Build Info:"
echo "   Version: v$CURRENT_VERSION"
echo "   Timestamp: $BUILD_TIMESTAMP"
echo "   Branch: $CURRENT_BRANCH"
echo ""

# Optional: Add your deployment commands here
# Examples:
# - Upload to S3/CDN
# - Deploy to Vercel/Netlify
# - Update database
# - Notify team

echo "🎉 Deployment process completed!"

# Optionally tag the release in git
read -p "🏷️  Tag this release in git? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git tag -a "v$CURRENT_VERSION" -m "Release v$CURRENT_VERSION - $(date)"
    echo "✅ Tagged release v$CURRENT_VERSION"
    
    read -p "🚀 Push tag to remote? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push origin "v$CURRENT_VERSION"
        echo "✅ Pushed tag to remote"
    fi
fi

echo ""
echo "🏁 All done! Your LeafIQ deployment is ready." 