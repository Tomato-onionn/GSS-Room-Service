@echo off
REM Deploy script for be-room API to Render (Windows)

echo 🚀 Deploying be-room API to Render...

REM Check if we're in a git repository
if not exist ".git" (
    echo ❌ Error: Not in a git repository.
    exit /b 1
)

REM Commit any changes
echo 📝 Committing changes...
git add .
git commit -m "Deploy: Ready for Render deployment"

REM Push to main branch
echo 📤 Pushing to GitHub...
git push origin main

echo ✅ Code pushed successfully!
echo.
echo 🔗 Next: Go to https://render.com
echo 📋 Steps: New + → Blueprint → Connect repo: room-service
echo 🔑 Set 3 env vars: DB_PASSWORD, AGORA_APP_ID, AGORA_APP_CERTIFICATE
echo 🎯 URL: https://be-room-api.onrender.com

pause