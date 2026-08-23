#!/bin/zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT_DIR/public/thinking"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
OUT_THINKING="$SCRIPT_DIR/public-thinking"

# Ensure directories exist
mkdir -p "$OUT_DIR"
mkdir -p "$OUT_THINKING"

# Copy the Thinking Zone as index in public-thinking/ for Firebase Hosting
cp "$SCRIPT_DIR/thinkOS.html" "$OUT_THINKING/index.html"
cp "$SCRIPT_DIR/thinkOS.html" "$OUT_THINKING/thinkOS.html"
cp "$SCRIPT_DIR/thinkos-ai.css" "$OUT_THINKING/thinkos-ai.css"
cp "$SCRIPT_DIR/thinkos-ai.js" "$OUT_THINKING/thinkos-ai.js"

# Copy to electron-app/ directory for local development
if [ -d "$SCRIPT_DIR/electron-app" ]; then
  cp "$SCRIPT_DIR/thinkOS.html" "$SCRIPT_DIR/electron-app/ThinkDashboard.html" 2>/dev/null || true
  cp "$SCRIPT_DIR/thinkos-ai.css" "$SCRIPT_DIR/electron-app/thinkos-ai.css" 2>/dev/null || true
  cp "$SCRIPT_DIR/thinkos-ai.js" "$SCRIPT_DIR/electron-app/thinkos-ai.js" 2>/dev/null || true
fi

# If root public/thinking directory exists and is writable, copy there too
if [ -d "$OUT_DIR" ] && [ -w "$OUT_DIR" ]; then
  cp "$SCRIPT_DIR/thinkOS.html" "$OUT_DIR/index.html" 2>/dev/null || true
  cp "$SCRIPT_DIR/thinkOS.html" "$OUT_DIR/thinkOS.html" 2>/dev/null || true
  cp "$SCRIPT_DIR/thinkos-ai.css" "$OUT_DIR/thinkos-ai.css" 2>/dev/null || true
  cp "$SCRIPT_DIR/thinkos-ai.js" "$OUT_DIR/thinkos-ai.js" 2>/dev/null || true
fi

# Note: Assets (manifest, icons, service-worker) are now 
# served from the root public/ directory using absolute paths.

echo "Built Thinking bundle in $OUT_DIR"
echo "Synced to $OUT_THINKING"
