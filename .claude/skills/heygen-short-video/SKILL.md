---
name: heygen-short-video
description: "Create HeyGen AI avatar video clips from a production plan. Takes production-plan.json + MP3 voiceover, splits audio into avatar chunks, uploads to HeyGen, generates lip-synced avatar videos, and downloads completed clips. This skill ONLY handles HeyGen avatar production — use plan-short-video-edit for planning and heygen-remotion-short-video-editor for final composition. USE WHEN user says 'tạo video heygen', 'heygen avatar clips', 'tạo avatar video', 'upload heygen', 'generate heygen clips', 'tạo clip avatar từ plan'."
---

# HeyGen Avatar Video Creator

Generate lip-synced AI avatar video clips from a production plan + MP3 voiceover.

```
production-plan.json + MP3 → Split audio (avatar segments only)
  → Upload chunks to HeyGen → Create avatar videos → Poll & Download
```

## Default Avatar Looks

| Look ID | Description |
|---------|-------------|
| `7ebc6e135f574dcdb943d309cb97806a` | Áo sơ mi xanh nhạt, cầm micro nhỏ, medium close-up, background be |
| `27776380b32d4b4aa4c5824571fc7117` | Áo sơ mi xanh nhạt + kính, laptop, medium shot, background tủ gỗ |


Rotate looks across avatar chunks for visual variety.

## Input

1. **production-plan.json path** (required) — from `plan-short-video-edit` skill
2. **MP3 voiceover path** (required) — original audio file
3. **SRT path** (required) — for audio splitting
4. **Avatar look IDs** (optional — auto-select from defaults above)
5. **Output directory** (optional — defaults to `<plan-folder>/../heygen_clips/`)

## Step 1: Read Plan & Extract Avatar Segments

Read `production-plan.json`, filter segments where `type === "avatar"`. These are the segments that need HeyGen avatar clips.

## Step 2: Split Audio

```bash
uv run .claude/skills/heygen-short-video/scripts/split_audio.py "<mp3_path>" "<srt_path>" \
  --avatars "7ebc6e135f574dcdb943d309cb97806a:talking-head micro,2e8a789bfbf847d38a03470efbe64f69:laptop desk,27776380b32d4b4aa4c5824571fc7117:dual monitor office" \
  --min-chunk-duration 8 --max-chunk-duration 20 \
  --output-dir "<output_dir>/chunks"
```

Only include avatar segments. Replace avatar IDs if user provided custom ones.

## Step 3: Upload & Submit to HeyGen

**IMPORTANT: Use audioAssetId for lip-sync — NOT script+voiceId (TTS).**

**MUST use HeyGen MCP tools — NEVER use curl for video creation or polling.**

### 3a: Upload audio chunks (curl — no MCP tool for asset upload)

Upload each chunk MP3 **in parallel**:
```bash
curl -X POST "https://upload.heygen.com/v1/asset" \
  -H "X-Api-Key: $HEYGEN_API_KEY" \
  -H "Content-Type: audio/mpeg" \
  --data-binary @"<chunk_path>"
```

### 3b: Create avatar videos via MCP (submit all chunks in parallel)

Use `mcp__heygen__create_avatar_video` MCP tool for EACH chunk:
```
mcp__heygen__create_avatar_video:
  avatarId: "<chunk.avatar_id>"
  audioAssetId: "<uploaded_asset_id>"
  aspectRatio: "9:16"
  title: "chunk_{index}"
```

Key parameters:
- `avatarId` — from default look IDs or user-specified
- `audioAssetId` — from Step 3a upload response
- NEVER use `script` + `voiceId` (that triggers TTS, not lip-sync)
- NEVER use `audioUrl` (use `audioAssetId` from upload)

## Step 4: Poll & Download via MCP

Use `mcp__heygen__get_video` MCP tool to poll each video (all concurrently):
```
mcp__heygen__get_video:
  videoId: "<video_id from step 3b>"
```

Poll every 15-20 seconds until `status === "completed"`.
When complete, download `video_url` to `<output_dir>/heygen_clips/chunk_XXX.mp4`:
```bash
curl -o "<output_dir>/heygen_clips/chunk_XXX.mp4" "<video_url>"
```

## Step 5: Output

```
<output_dir>/
├── chunks/           # Split MP3 files
│   ├── chunk_000.mp3
│   └── chunk_001.mp3
├── heygen_clips/     # Downloaded avatar videos
│   ├── chunk_000.mp4
│   └── chunk_001.mp4
└── heygen_manifest.json  # Mapping: chunk index → video_id, avatar_id, time range
```

### heygen_manifest.json

```json
{
  "clips": [
    {
      "index": 0,
      "segmentIndices": [1, 2],
      "avatarId": "7ebc6e135f574dcdb943d309cb97806a",
      "videoId": "abc123",
      "filePath": "heygen_clips/chunk_000.mp4",
      "startSec": 0.0,
      "endSec": 8.5
    }
  ]
}
```

Inform user:
> HeyGen avatar clips đã tạo xong. Dùng skill `heygen-remotion-short-video-editor` để ghép video cuối cùng.

## Audio Rules

- HeyGen avatar clips already contain lip-synced audio — NEVER overlay additional audio on them
- For visual/Grok segments, the original MP3 chunks serve as voiceover (handled by Remotion editor skill)
- NEVER set top-level `audioPath` when mixing avatar + visual clips
