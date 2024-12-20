#!/bin/bash

# Exit on errors
set -e

echo "Navigating to lambda directory..."
cd lambda

echo "Running npm build..."
npm run build

echo "Generating Prisma client..."
npx prisma generate

echo "Navigating to dist/src directory..."
cd dist/src

# Function to create a zip file
zip_lambda() {
  local filename=$1
  echo "Creating zip for $filename..."
  zip -r "${filename}.zip" "${filename}.js" ./services ./utils node_modules
}

# Create zip files for each lambda
zip_lambda "createSchedule"
zip_lambda "getSchedules"
zip_lambda "deleteSchedule"
zip_lambda "updateTaskType"

echo "Zipping completed successfully!"
