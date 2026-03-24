#!/usr/bin/env bash
# release.sh — Build and sync the free plugin to the SVN working copy.
#
# Usage:
#   ./release.sh          Full release: syncs to trunk/ + creates tags/{VERSION}
#   ./release.sh --beta   Beta release: syncs to trunk/ only, Stable tag unchanged
#
# After running, review the SVN diff, then commit manually:
#   cd ~/Documents/wordpress-plugins/wc-ajax-product-filter
#   svn commit -m "Release {VERSION}"

set -e

BETA=false
if [[ "$1" == "--beta" ]]; then
  BETA=true
fi

PLUGIN_SLUG="wc-ajax-product-filter"
PLUGIN_DIR="$(cd "$(dirname "$0")" && pwd)"
SVN_DIR="$HOME/Documents/wordpress-plugins/$PLUGIN_SLUG"
PLUGIN_FILE="$PLUGIN_DIR/$PLUGIN_SLUG.php"

# ── Validate ──────────────────────────────────────────────────────────────────

if [ ! -f "$PLUGIN_FILE" ]; then
  echo "ERROR: Plugin file not found at $PLUGIN_FILE"
  exit 1
fi

if [ ! -d "$SVN_DIR" ]; then
  echo "ERROR: SVN directory not found at $SVN_DIR"
  exit 1
fi

VERSION=$(grep -m1 "^.*Version:" "$PLUGIN_FILE" | awk -F': ' '{print $2}' | tr -d '[:space:]')
if [ -z "$VERSION" ]; then
  echo "ERROR: Could not read version from $PLUGIN_FILE"
  exit 1
fi

echo ""
echo "Plugin : $PLUGIN_SLUG"
echo "Version: $VERSION"
if $BETA; then
  echo "Mode   : BETA (trunk only, Stable tag unchanged)"
else
  echo "Mode   : RELEASE (trunk + tags/$VERSION)"
fi
echo ""

# ── Build ─────────────────────────────────────────────────────────────────────

echo "→ Building admin JS..."
npm run build

echo "→ Building frontend CSS..."
npx gulp frontendCss --gulpfile gulpfile.mjs

echo "→ Building frontend JS..."
npx gulp frontendJs --gulpfile gulpfile.mjs

echo "→ Generating README.md..."
npm run readme

echo "→ Generating POT file..."
if command -v wp &>/dev/null; then
  wp i18n make-pot . "languages/$PLUGIN_SLUG.pot" \
    --exclude=src,node_modules,vendor,tests \
    --ignore-domain
  echo "  POT generated via WP-CLI."
else
  npm run i18n
  echo "  POT generated via Grunt (WP-CLI not on PATH)."
  echo "  TIP: Re-run from Local's Site Shell for more accurate JS string extraction."
fi

# ── Create distributable zip ──────────────────────────────────────────────────

echo "→ Creating plugin zip..."
npm run plugin-zip
ZIP_FILE="$PLUGIN_DIR/$PLUGIN_SLUG.zip"

if [ ! -f "$ZIP_FILE" ]; then
  echo "ERROR: Expected zip not found at $ZIP_FILE"
  exit 1
fi

# ── Sync to SVN trunk ─────────────────────────────────────────────────────────

echo "→ Syncing to SVN trunk..."
TEMP_DIR=$(mktemp -d)
unzip -q "$ZIP_FILE" -d "$TEMP_DIR"

rsync -a --delete \
  "$TEMP_DIR/$PLUGIN_SLUG/" \
  "$SVN_DIR/trunk/"

rm -rf "$TEMP_DIR"
rm "$ZIP_FILE"

# Handle SVN adds and deletes
cd "$SVN_DIR"

SVN_NEW=$(svn status trunk/ | grep "^?" | awk '{print $2}')
SVN_GONE=$(svn status trunk/ | grep "^!" | awk '{print $2}')

if [ -n "$SVN_NEW" ]; then
  echo "$SVN_NEW" | xargs svn add
fi

if [ -n "$SVN_GONE" ]; then
  echo "$SVN_GONE" | xargs svn delete
fi

# ── Tag (full release only) ───────────────────────────────────────────────────

if ! $BETA; then
  TAG_DIR="$SVN_DIR/tags/$VERSION"

  if [ -d "$TAG_DIR" ]; then
    echo "WARNING: SVN tag $VERSION already exists — skipping tag creation."
  else
    echo "→ Creating SVN tag $VERSION..."
    svn copy trunk/ "tags/$VERSION"
  fi
fi

# ── Summary ───────────────────────────────────────────────────────────────────

echo ""
echo "────────────────────────────────────────────"
echo "SVN working copy prepared. Review the diff:"
echo "  cd $SVN_DIR"
echo "  svn diff --summarize"
echo ""
if $BETA; then
  echo "When ready, commit the beta:"
  echo "  svn commit -m \"Beta $VERSION\""
else
  echo "When ready, commit the release:"
  echo "  svn commit -m \"Release $VERSION\""
fi
echo "────────────────────────────────────────────"
