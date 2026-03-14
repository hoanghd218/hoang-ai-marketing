---
name: heygen-short-video
description: "Create knowledge-sharing short videos (TikTok/Reels) using HeyGen AI avatars + Remotion composition. Pipeline: MP3 audio input → Whisper transcription → split into segments → upload audio to HeyGen → generate avatar clips with lip-sync → download → compose final video with Remotion (visual effects, animated emoji, text effects, captions, B-roll overlays, background music with multi-track & dynamic volume, progress bar). USE WHEN user says 'tạo video heygen', 'heygen short video', 'video avatar ngắn', 'avatar video from mp3', 'tạo video từ mp3 với avatar', 'heygen avatar video', 'video chia sẻ kiến thức avatar'."
---

# HeyGen Short Video Creator

Create short viral videos with AI avatar rotation from MP3 audio input.

## Pipeline

```
MP3 + Avatar IDs → Whisper SRT → Split chunks → Upload MP3 to HeyGen → Avatar clips (lip-sync) → Download → Analyze transcript → Remotion compose (effects + captions) → Final MP4
```

## Input

User provides:
1. **MP3 file path** — local audio file (any language)
2. **Avatar list** — avatar/look IDs with view/pose descriptions
3. **Optional**: SRT file (skip Whisper step)

## Step 1: Transcribe MP3 → SRT

Skip if user provides SRT.

```bash
uv run .claude/skills/heygen-short-video/scripts/transcribe_mp3.py "<mp3_path>" --language vi --model base
```

Output: `<stem>.srt` + `<stem>_segments.json` next to MP3.

**Language detection**: Check filename for language hints. Use `--language en` for English, `--language vi` for Vietnamese. Use `--model small` or `--model medium` for better accuracy (slower).

## Step 2: Split Audio into Chunks

```bash
uv run .claude/skills/heygen-short-video/scripts/split_audio.py "<mp3_path>" "<srt_path>" \
  --avatars "id1:front view,id2:side angle,id3:full body" \
  --min-chunk-duration 8 --max-chunk-duration 20 \
  --output-dir "<working_dir>/chunks"
```

Output: `chunks/manifest.json` + `chunk_XXX.mp3` files.

## Step 3: Upload Audio & Submit to HeyGen

**IMPORTANT: Use audioAssetId for lip-sync — NOT script+voiceId (TTS).**

1. Upload each chunk MP3:
```bash
curl -X POST "https://upload.heygen.com/v1/asset" \
  -H "X-Api-Key: $HEYGEN_API_KEY" \
  -H "Content-Type: audio/mpeg" \
  --data-binary @"<chunk_path>"
```

2. Create video with `audioAssetId`:
```
mcp__heygen__create_video:
  avatarId: chunk.avatar_id
  audioAssetId: <uploaded_asset_id>
  aspectRatio: "9:16"
  title: "chunk_{index}"
```

## Step 4: Poll & Download

```
For each video_id:
  mcp__heygen__get_video(videoId) → wait until status="completed"
  Download video_url to <working_dir>/heygen_clips/chunk_XXX.mp4
```

## Step 5: Analyze Transcript & Plan Visual Effects

### Caption Style Types

| Style | When to use | Visual |
|-------|-------------|--------|
| `hook` | Opening 1-2 sentences | Red bg, 44px bold, gold accent |
| `pain` | Pain points, problems | Black bg + red border/glow |
| `solution` | Benefits, solutions | Dark green bg + green glow |
| `cta` | Call-to-action (last) | Purple gradient + bouncing arrow |
| `normal` | Everything else | Black semi-transparent bg |

### Enhancement Checklist

For each caption segment, determine:
1. **style** — `hook`, `pain`, `normal`, `solution`, `cta`
2. **highlights** — key words to highlight in accent color (max 2-3)
3. **emoji** — `@remotion/animated-emoji` name (optional, max 6-7 per video). See [references/animated-emoji-map.md](references/animated-emoji-map.md)
4. **textEffect** — `word-by-word`, `deep-glow`, `flicker`, or `none`. See [references/text-effects.md](references/text-effects.md)
5. **soundEffect** — meme sound at caption start (optional, max 3-5). See [references/meme-sounds.md](references/meme-sounds.md) and [references/sound-design-patterns.md](references/sound-design-patterns.md)

### Animated Emoji (top picks)

| Context | Emoji Name |
|---------|-----------|
| Shock | `mind-blown`, `screaming` |
| Sleep/bored | `sleep`, `yawn` |
| Pain | `weary`, `distraught`, `cross-mark` |
| Idea | `light-bulb`, `thinking-face` |
| Success | `check-mark`, `sparkles`, `fire`, `muscle` |
| CTA | `bell`, `wave`, `index-finger` |

### Text Effect Recommendations

| Style | Effect | Why |
|-------|--------|-----|
| `hook` | `word-by-word` | Max attention in first 3s |
| `pain` | `flicker` | Visual unease on negative keywords |
| Key numbers | `deep-glow` | Makes results impressive |
| `cta` | `word-by-word` | Ensures CTA text is read |
| `normal` | `none` | Keeps info-dense sections clean |

### Hook Optimization (first 10s)

- Set `hookBoostSec: 10` for auto-zoom boost (1.08x with quadratic falloff)
- Use aggressive `zoomPulses` (type: `hold` or `punch`) in first 10s
- Add camera-flash SFX at 0.0s
- Use `textEffect: "word-by-word"` on hook caption

## Step 5b: Select Background Music

Music library: `workspace/assets/reels/background music/`

### Available Tracks

| File | Mood | Best for |
|------|------|----------|
| `Aluminum - Roie Shpigler.mp3` | Reflective, ambient | Thoughtful content, AI insights, calm explanation |
| `Ascension - Creative Cut - Orchestra Song.mp3` | Orchestral, uplifting | Success stories, achievement reveals, climactic moments |
| `Chase Velocity - FableForte - Cinematic.mp3` | Fast-paced, intense | Urgency, competition, "you're falling behind" sections |
| `Epic Emotional Music - Lux-Inspira - Liberation.mp3` | Epic, emotional | Transformation stories, before/after, breakthroughs |
| `Fortitude (Shorter Version).mp3` | Short, determined | Quick hooks, punchy intros (short track ~20s) |
| `Miracle - Roman P - Cinematic.mp3` | Cinematic, wonder | Demos, "magic moment" reveals, wow factor |
| `Rising Star - Song by TURPAK.mp3` | Rising energy, motivational | Build-up sections, growing momentum, CTA buildup |
| `The Last Hero - Veaceslav Draganov.mp3` | Heroic, cinematic | Bold statements, overcoming obstacles, empowerment |

### Music Selection Guidelines

- **Default volume**: `0.12` (subtle, won't compete with avatar speech)
- **Louder moments** (up to `0.25–0.35`): Use during transitions, pauses between sentences, or emotional peaks
- **Multiple tracks**: Switch tracks to match mood shifts (e.g., calm intro → intense middle → uplifting CTA)
- **Fade**: Default `fadeInSec: 1`, `fadeOutSec: 2` — increase fadeOut to 3-4s for smoother endings

### Music Matching by Video Section

| Section | Recommended Track | Volume |
|---------|------------------|--------|
| Hook (0-3s) | `Fortitude` or `Chase Velocity` | 0.15–0.20 |
| Pain point | `Chase Velocity` or `Epic Emotional` | 0.12–0.18 |
| Solution/Demo | `Miracle` or `Aluminum` | 0.10–0.15 |
| Climax/Result | `Ascension` or `The Last Hero` | 0.20–0.30 |
| CTA | `Rising Star` | 0.15–0.20 |

## Step 6: Compose with Remotion

Component: `src/templates/HeyGenShort.tsx` (imports from `src/templates/heygen-short/`)

### Props structure (`props/heygen-short.json`):

```json
{
  "clips": [
    { "videoPath": "media/heygen/chunk_000.mp4", "durationSeconds": 18.83 }
  ],
  "captions": [
    {
      "text": "Opening hook text here",
      "startSec": 0.0, "endSec": 3.44,
      "style": "hook",
      "highlights": ["key phrase"],
      "emoji": "mind-blown",
      "textEffect": "word-by-word",
      "captionPosition": 55
    }
  ],
  "soundEffects": [
    { "audioPath": "media/sfx/SUDDEN SUSPENSE.mp3", "startSec": 0.0, "volume": 0.6 }
  ],
  "zoomPulses": [
    { "timeSec": 0.0, "scale": 1.15, "type": "hold", "durationFrames": 10, "holdSec": 2.5 }
  ],
  "bRollOverlays": [
    { "mediaPath": "media/broll/screenshot.png", "startSec": 5.0, "endSec": 8.0, "position": "center", "borderRadius": 20, "label": "Amazon KDP" }
  ],
  "backgroundMusic": [
    { "audioPath": "media/bgm/Aluminum - Roie Shpigler.mp3", "startSec": 0, "volume": 0.12, "fadeInSec": 1, "fadeOutSec": 2 },
    { "audioPath": "media/bgm/Rising Star - Song by TURPAK.mp3", "startSec": 30, "volume": 0.20, "fadeInSec": 1, "fadeOutSec": 3 }
  ],
  "durationSeconds": 39.11,
  "crossFadeFrames": 10,
  "showProgressBar": true,
  "hookBoostSec": 10,
  "defaultCaptionPosition": 55
}
```

### Built-in visual effects

1. **Zoom in/out per clip** — scale 1.0→1.05 entry, 1.05→1.0 exit
2. **Hook boost** — extra 1.08x zoom in first N seconds (`hookBoostSec`)
3. **Flash transition** — white flash between avatar clips
4. **Vignette overlay** — radial gradient darkening edges
5. **Spring-animated captions** — slide up with spring physics
6. **Text effects** — word-by-word fade, deep-glow pulse, flicker on highlights
7. **Keyword highlights** — accent-colored bold text within captions
8. **Animated emoji** — `@remotion/animated-emoji` with spring bounce (auto-detects animated vs Unicode fallback)
9. **Caption position** — configurable top% (default 55, near neck area)
10. **Progress bar** — gradient bar at top
11. **CTA arrow** — animated pointing finger for call-to-action
12. **B-roll overlays** — images/videos with rounded corners, fade in/out
13. **Sound effects** — meme sounds at specific timestamps
14. **Style-based caption boxes** — different bg/border/glow per style type
15. **Background music** — multi-track with per-track volume, fade in/out, loop

### Setup & Render

1. Copy clips and assets to Remotion public folder:
```bash
mkdir -p workspace/video-projects/remotion-studio/public/media/{heygen,sfx,broll,bgm}
cp <working_dir>/heygen_clips/*.mp4 workspace/video-projects/remotion-studio/public/media/heygen/
cp "workspace/assets/reels/MEME SOUND/<chosen_sound>.mp3" workspace/video-projects/remotion-studio/public/media/sfx/
cp "workspace/assets/reels/background music/<chosen_track>.mp3" workspace/video-projects/remotion-studio/public/media/bgm/
```

2. Create props JSON at `workspace/video-projects/remotion-studio/props/heygen-short.json`

3. Render:
```bash
cd workspace/video-projects/remotion-studio
npx remotion render src/index.ts HeyGenShort out/heygen-short.mp4 --props=props/heygen-short.json
```

## Step 7: Save Output

```
workspace/content/{YYYY-MM-DD}/video-short/
├── <slug>.mp4           # Final video
├── manifest.json        # Pipeline manifest
├── chunks/              # Split MP3s
└── heygen_clips/        # Downloaded avatar clips
```
