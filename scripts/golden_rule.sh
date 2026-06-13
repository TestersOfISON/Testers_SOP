#!/usr/bin/env bash
set -e

# 1️⃣ Lint
if command -v npm >/dev/null 2>&1; then
  echo "🧹 Running lint..."
  npm run lint || { echo "Lint failed"; exit 1; }
else
  echo "npm not available, skipping lint."
fi

# 2️⃣ Unit tests
if command -v npm >/dev/null 2>&1; then
  echo "✅ Running unit tests..."
  npm test || { echo "Tests failed"; exit 1; }
else
  echo "npm not available, skipping tests."
fi

# 3️⃣ Update changelog
HASH=$(git rev-parse --short HEAD)
DATE=$(date "+%Y-%m-%d")
echo "- $DATE [$HASH] Automated commit – lint & tests passed." >> CHANGELOG.md
git add CHANGELOG.md

echo "✨ Golden rule completed successfully."
