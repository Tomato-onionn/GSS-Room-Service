#!/bin/bash

# Deploy script for be-room API to Render

echo "🚀 Deploying be-room API to Render..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository."
    exit 1
fi

# Commit any changes
echo "📝 Committing changes..."
git add .
git commit -m "Deploy: Ready for Render deployment"

# Push to main branch
echo "📤 Pushing to GitHub..."
git push origin main

echo "✅ Code pushed successfully!"
echo ""
echo "🔗 Next: Go to https://render.com"
echo "📋 Steps: New + → Blueprint → Connect repo: room-service"
echo "🔑 Set 3 env vars: DB_PASSWORD, AGORA_APP_ID, AGORA_APP_CERTIFICATE"
echo "🎯 API URL: https://gss-room-service.onrender.com"
echo "📖 Swagger UI: https://gss-room-service.onrender.com/api-docs"
echo "🔍 Health check: https://gss-room-service.onrender.com/health"