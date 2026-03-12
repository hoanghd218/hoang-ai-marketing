#!/usr/bin/env bash
set -euo pipefail

# Reels Text Overlay Renderer — Remotion wrapper
# Same CLI interface as the legacy create_reels.py

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REMOTION_DIR="$SCRIPT_DIR/../remotion"
PUBLIC_DIR="$REMOTION_DIR/public"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"

# ── Parse arguments ────────────────────────────────────────────────────
MESSAGE="" VIDEO="" MUSIC="" OUTPUT="" WATERMARK="" DURATION=8

while [[ $# -gt 0 ]]; do
  case "$1" in
    --message|-m) MESSAGE="$2"; shift 2;;
    --video|-v)   VIDEO="$2"; shift 2;;
    --music)      MUSIC="$2"; shift 2;;
    --output|-o)  OUTPUT="$2"; shift 2;;
    --watermark|-w) WATERMARK="$2"; shift 2;;
    --duration|-d)  DURATION="$2"; shift 2;;
    *) echo "Unknown argument: $1" >&2; exit 1;;
  esac
done

# ── Validate ───────────────────────────────────────────────────────────
[[ -z "$MESSAGE" ]] && echo "Error: --message required" >&2 && exit 1
[[ -z "$VIDEO" ]]   && echo "Error: --video required" >&2 && exit 1
[[ -z "$OUTPUT" ]]  && echo "Error: --output required" >&2 && exit 1

# Resolve relative paths from repo root
if [[ ! "$VIDEO" = /* ]]; then
  VIDEO="$REPO_ROOT/$VIDEO"
fi
if [[ -n "$MUSIC" && ! "$MUSIC" = /* ]]; then
  MUSIC="$REPO_ROOT/$MUSIC"
fi
if [[ ! "$OUTPUT" = /* ]]; then
  OUTPUT="$REPO_ROOT/$OUTPUT"
fi

[[ ! -f "$VIDEO" ]] && echo "Error: Video not found: $VIDEO" >&2 && exit 1
[[ -n "$MUSIC" && ! -f "$MUSIC" ]] && echo "Error: Music not found: $MUSIC" >&2 && exit 1

# ── Install deps if needed ─────────────────────────────────────────────
if [[ ! -d "$REMOTION_DIR/node_modules" ]]; then
  echo "Installing Remotion dependencies..."
  (cd "$REMOTION_DIR" && npm install --silent)
fi

# ── Copy assets to public/ ─────────────────────────────────────────────
mkdir -p "$PUBLIC_DIR"

VIDEO_FILENAME="$(basename "$VIDEO" | tr ' ' '-')"
cp "$VIDEO" "$PUBLIC_DIR/$VIDEO_FILENAME"

MUSIC_FILENAME=""
if [[ -n "$MUSIC" ]]; then
  MUSIC_FILENAME="$(basename "$MUSIC" | tr ' ' '-')"
  cp "$MUSIC" "$PUBLIC_DIR/$MUSIC_FILENAME"
fi

# Copy fonts (Light, Regular, Medium)
FONT_DIR="$REPO_ROOT/workspace/assets/reels/fonts/Be_Vietnam_Pro"
for weight in Light Regular Medium; do
  FONT_FILE="$FONT_DIR/BeVietnamPro-${weight}.ttf"
  [[ -f "$FONT_FILE" ]] && cp "$FONT_FILE" "$PUBLIC_DIR/"
done

# ── Build props JSON ───────────────────────────────────────────────────
# Replace literal \n with actual newlines
MESSAGE_ESCAPED="$(echo "$MESSAGE" | sed 's/\\n/\n/g')"

# Use python3 for safe JSON encoding of the message
MESSAGE_JSON="$(printf '%s' "$MESSAGE_ESCAPED" | python3 -c 'import sys,json; print(json.dumps(sys.stdin.read()))')"

PROPS="{\"message\":$MESSAGE_JSON,\"videoSrc\":\"$VIDEO_FILENAME\""
[[ -n "$MUSIC_FILENAME" ]] && PROPS="$PROPS,\"musicSrc\":\"$MUSIC_FILENAME\""
[[ -n "$WATERMARK" ]] && PROPS="$PROPS,\"watermark\":\"$WATERMARK\""
PROPS="$PROPS,\"durationInSeconds\":$DURATION}"

# ── Ensure output directory exists ─────────────────────────────────────
mkdir -p "$(dirname "$OUTPUT")"

# ── Render ─────────────────────────────────────────────────────────────
echo "Rendering with Remotion..."
echo "  Video: $VIDEO_FILENAME"
echo "  Music: ${MUSIC_FILENAME:-none}"
echo "  Duration: ${DURATION}s"
echo "  Output: $OUTPUT"

(cd "$REMOTION_DIR" && npx remotion render ReelsTextOverlay \
  "$OUTPUT" \
  --props="$PROPS" \
  --codec h264 \
  --audio-codec aac \
  --crf 18)

# ── Cleanup copied assets ─────────────────────────────────────────────
rm -f "$PUBLIC_DIR/$VIDEO_FILENAME"
[[ -n "$MUSIC_FILENAME" ]] && rm -f "$PUBLIC_DIR/$MUSIC_FILENAME"
rm -f "$PUBLIC_DIR"/BeVietnamPro-*.ttf

echo "Done! Output: $OUTPUT"
