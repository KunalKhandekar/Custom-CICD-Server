#!/bin/bash
set -e

NEED_INSTALL=$1

echo "------------------------------------------"
echo "        Starting Server Deployment"
echo "------------------------------------------"

echo "Navigating to server directory..."
cd "$SERVER_PROJECT_DIR"

# Step 1 — Pull latest changes
echo "Pulling latest server changes from Git..."
git pull origin main
echo "Git pull completed."

# Step 2 — Install dependencies (if needed)
if [ "$NEED_INSTALL" = "true" ]; then
  echo "Installing server dependencies (npm ci)..."
  npm ci --no-audit --no-fund
  echo "Dependency installation completed."
else
  echo "Skipping dependency installation (no package changes detected)."
fi

# Step 3 — Reload backend with PM2
echo "Reloading backend application with PM2..."
pm2 reload Storemystuff
echo "Server is live."

echo "---------------------------------------------"
echo "   Server Deployment Completed Successfully"
echo "---------------------------------------------"
