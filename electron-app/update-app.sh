#!/bin/bash
# ─────────────────────────────────────────────────────────────────
# update-app.sh — Sync latest ThinkDashboard.html into the Electron app
# Run this whenever you update ThinkDashboard.html
# ─────────────────────────────────────────────────────────────────

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE="$SCRIPT_DIR/../thinkOS.html"
DEST="$SCRIPT_DIR/ThinkDashboard.html"
APP_BUNDLE="$SCRIPT_DIR/dist/mac-arm64/Thinking Zone.app"

echo "🔄 Syncing thinkOS.html..."
cp "$SOURCE" "$DEST"
cp "$SCRIPT_DIR/../thinkos-ai.css" "$SCRIPT_DIR/thinkos-ai.css"
cp "$SCRIPT_DIR/../thinkos-ai.js" "$SCRIPT_DIR/thinkos-ai.js"
echo "✅ electron-app files updated"

# Optionally rebuild
if [[ "$1" == "--build" ]]; then
  echo "🔨 Rebuilding .app bundle..."
  cd "$SCRIPT_DIR"
  npm run build
  echo "✅ Build complete: dist/mac-arm64/Thinking Zone.app"
fi

# Optionally install to /Applications
if [[ "$1" == "--install" || "$2" == "--install" ]]; then
  echo "📦 Installing to /Applications..."
  if [ -d "/Applications/Thinking Zone.app" ]; then
    rm -rf "/Applications/Thinking Zone.app"
  fi
  cp -R "$APP_BUNDLE" "/Applications/Thinking Zone.app"
  echo "✅ Installed: /Applications/Thinking Zone.app"
  open "/Applications/Thinking Zone.app"
fi

echo ""
echo "Quick commands:"
echo "  ./update-app.sh              — sync HTML only (restart Electron to see changes)"
echo "  ./update-app.sh --build      — sync + rebuild .app"
echo "  ./update-app.sh --install    — install current .app to /Applications"
echo "  ./update-app.sh --build --install — full rebuild + install"
