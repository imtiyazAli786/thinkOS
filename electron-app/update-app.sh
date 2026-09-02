#!/bin/bash
# ─────────────────────────────────────────────────────────────────
# update-app.sh — Sync latest thinkOS.html into the Electron app
# Run this whenever you update thinkOS.html
# ─────────────────────────────────────────────────────────────────

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE="$SCRIPT_DIR/../thinkOS.html"
APP_BUNDLE="$SCRIPT_DIR/dist/mac-arm64/thinkOS.app"

echo "🔄 Syncing thinkOS.html and AI assets..."
cp "$SOURCE" "$SCRIPT_DIR/thinkOS.html"
cp "$SOURCE" "$SCRIPT_DIR/ThinkDashboard.html"
cp "$SCRIPT_DIR/../thinkos-ai.css" "$SCRIPT_DIR/thinkos-ai.css"
cp "$SCRIPT_DIR/../thinkos-ai.js" "$SCRIPT_DIR/thinkos-ai.js"
echo "✅ electron-app files updated"

# Optionally rebuild
if [[ "$1" == "--build" ]]; then
  echo "🔨 Rebuilding .app bundle..."
  cd "$SCRIPT_DIR"
  rm -rf "$SCRIPT_DIR/dist"
  npm run build
  echo "✅ Build complete: dist/mac-arm64/thinkOS.app"
fi

# Optionally install to Applications
if [[ "$1" == "--install" || "$2" == "--install" ]]; then
  echo "📦 Installing to Applications..."
  # Clean old Thinking Zone
  rm -rf "/Applications/Thinking Zone.app" 2>/dev/null || true
  rm -rf "$HOME/Applications/Thinking Zone.app" 2>/dev/null || true
  
  TARGET_DIR="$HOME/Applications"
  if [ -w "/Applications" ]; then
    TARGET_DIR="/Applications"
  fi
  
  rm -rf "$TARGET_DIR/thinkOS.app"
  cp -R "$APP_BUNDLE" "$TARGET_DIR/thinkOS.app"
  /System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -f "$TARGET_DIR/thinkOS.app" 2>/dev/null || true
  /System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -u "$TARGET_DIR/Thinking Zone.app" 2>/dev/null || true
  /System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -u "$APP_BUNDLE" 2>/dev/null || true
  # Clean temporary build directory so Raycast/Spotlight only indexes the installed app
  rm -rf "$SCRIPT_DIR/dist"
  echo "✅ Installed: $TARGET_DIR/thinkOS.app (build cache cleaned)"
  open "$TARGET_DIR/thinkOS.app"
fi

echo ""
echo "Quick commands:"
echo "  ./update-app.sh              — sync HTML only (restart Electron to see changes)"
echo "  ./update-app.sh --build      — sync + rebuild .app"
echo "  ./update-app.sh --install    — install current .app to /Applications"
echo "  ./update-app.sh --build --install — full rebuild + install"
