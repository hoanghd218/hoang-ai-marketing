---
name: mkt-create-video-reels-text-overlay
description: >
  Create short Reels/TikTok/Shorts videos (max 8s) with Vietnamese text overlay on cinematic background video + background music.
  Input is a knowledge-sharing message. The skill selects matching video and music from the asset catalog based on message mood/topic,
  then renders a Remotion composition (React/TypeScript) to produce the final 1080x1920 MP4.
  USE WHEN user says 'tạo reels', 'tạo video reels', 'video text overlay', 'tạo video ngắn có chữ',
  'reels chia sẻ kiến thức', 'tạo clip quote', 'video quote', 'make reels', 'create reels video',
  'tạo video có text', 'video ngắn motivational', 'render video text'.
---

# Reels Text Overlay Video Creator

Create short-form videos (max 8 seconds) with text overlaid on cinematic background video + music. Output is 1080x1920 (9:16 portrait) MP4.

## Visual Style Reference

- White bold text, centered vertically (slightly below center)
- Multi-directional dark shadow for readability on any background
- Optional watermark top-right (e.g. `@hoang.ai`)
- Fade in/out transitions on both video and text
- Dark/moody cinematic background video

## Workflow

### 1. Analyze the message

Parse the user's knowledge message. Identify:
- **Mood**: calm, motivational, tech, reflective, energetic
- **Topic tags**: coding, AI, productivity, life, business

### 2. Select video from catalog

Read `workspace/assets/reels/videos/catalog.json`. Match based on mood and tags.

```json
{
  "id": "coding-laptop-dark",
  "file": "coding-laptop-dark.mp4",
  "description": "Tay gõ laptop trong phòng tối",
  "mood": ["focused", "productive", "tech"],
  "tags": ["coding", "laptop", "tech", "work", "dark"],
  "duration_sec": 12
}
```

### 3. Select music from catalog

Read `workspace/assets/reels/music/catalog.json`. Match based on mood.

```json
{
  "id": "lo-fi-chill-beat",
  "file": "lo-fi-chill-beat.mp3",
  "description": "Lo-fi chill beat nhẹ nhàng",
  "mood": ["calm", "reflective", "chill"],
  "tags": ["lofi", "chill", "ambient"],
  "bpm": 85
}
```

### 4. Render the video (Remotion)

```bash
bash .claude/skills/mkt-create-video-reels-text-overlay/scripts/render_reels.sh \
  --message "Bạn không cần nỗ lực, thứ bạn cần là:\n1. Một mục tiêu đủ lớn\n2. Hành động nhỏ lặp lại hàng ngày\n3. Nhớ phải làm nhanh, làm mạnh mẽ\n4. Nếu sai, thì cứ gạt đi và đi tiếp" \
  --video workspace/assets/reels/videos/coding-laptop-dark.mp4 \
  --music workspace/assets/reels/music/lo-fi-chill-beat.mp3 \
  --watermark "@hoang.ai" \
  --output workspace/content/reels-output.mp4
```

**Parameters:**
- `--message` / `-m`: Vietnamese text to overlay. Use `\n` for line breaks.
- `--video` / `-v`: Path to background .mp4
- `--music`: Path to background .mp3 (optional)
- `--output` / `-o`: Output .mp4 path
- `--watermark` / `-w`: Watermark text, top-right (optional)
- `--duration` / `-d`: Max duration in seconds (default: 8)

### 5. Output

Final MP4 saved to specified output path. Report the file path and duration to the user.

## Asset Management

### Adding new videos

1. Place `.mp4` files in `workspace/assets/reels/videos/`
2. Add entry to `workspace/assets/reels/videos/catalog.json` with: id, file, description, mood[], tags[], duration_sec

### Adding new music

1. Place `.mp3` files in `workspace/assets/reels/music/`
2. Add entry to `workspace/assets/reels/music/catalog.json` with: id, file, description, mood[], tags[], bpm

### Custom fonts

Place `.ttf` or `.otf` files in `workspace/assets/reels/fonts/`. The script auto-detects fonts in this directory.
Vietnamese-compatible fonts recommended: Be Vietnam Pro, Montserrat, Inter.

## Prerequisites

- Node.js 18+ (`brew install node`)
- `ffmpeg` installed (`brew install ffmpeg`) — used internally by Remotion
- Dependencies auto-installed on first run via `npm install`

## Text Formatting Tips

- Keep messages under 5 lines for readability at 1080px
- Use numbered lists for step-by-step content (like the reference image)
- First line = hook/title, remaining = supporting points
- Use `\n` to control line breaks precisely
