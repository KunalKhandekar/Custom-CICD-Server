#!/bin/bash
set -e

NEED_INSTALL=$1

echo "-------------------------------------------"
echo "     Starting Client Deployment"
echo "-------------------------------------------"

PROJECT_DIR="$CLIENT_PROJECT_DIR"
DIST_DIR="$PROJECT_DIR/dist"

echo "Navigating to client directory..."
cd "$PROJECT_DIR"

# Step 0 — Pull latest changes
echo "Pulling latest server changes from Git..."
git pull origin main
echo "Git pull completed."

# Step 1 — Install dependencies (if needed)
if [ "$NEED_INSTALL" = "true" ]; then
  echo "Installing client dependencies (npm ci)..."
  npm ci --no-audit --no-fund
else
  echo "Skipping dependency installation (no package changes detected)."
fi

# Step 2 — Build client
echo "Building client application..."
npm run build
echo "Build completed successfully."

# Step 3 — Sync build to S3
echo "Uploading build files to S3 bucket: $S3_BUCKET"
aws s3 sync "$DIST_DIR/" "s3://$S3_BUCKET" --delete
echo "S3 sync completed."

# Step 4 — CloudFront cache invalidation
echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id "$CF_DISTRIBUTION_ID" \
  --paths "/index.html"
echo "CloudFront invalidation completed."

echo "----------------------------------------------"
echo "   Client Deployment Completed Successfully"
echo "----------------------------------------------"
