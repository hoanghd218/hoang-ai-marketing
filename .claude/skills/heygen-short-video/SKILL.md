---
name: heygen-short-video
description: "Create knowledge-sharing short videos (TikTok/Reels) using HeyGen AI avatars + Grok visual videos + Remotion composition. Pipeline: MP3 audio input → Whisper transcription → analyze SRT & plan segments (avatar vs visual) → generate Grok video prompts for visual scenes → user creates Grok videos → split audio for avatar segments → HeyGen avatar clips → compose with Remotion (captions, effects, background music, progress bar). USE WHEN user says 'tạo video heygen', 'heygen short video', 'video avatar ngắn', 'avatar video from mp3', 'tạo video từ mp3 với avatar', 'heygen avatar video', 'video chia sẻ kiến thức avatar'."
---

# HeyGen Short Video Creator

Create short viral videos combining AI avatar (HeyGen) + AI visual scenes (Grok video) from MP3 audio input.

## Pipeline Overview

```
MP3 → Whisper SRT → Ask custom b-roll? → Analyze SRT & plan segments
  → Plan effects, BGM & generate Grok visual prompts (PAUSE for user)
  → User creates Grok videos & provides paths (RESUME)
  → ⚡ PARALLEL: Verify Grok/custom media | Render PromptTyping clips | Split audio + HeyGen avatar clips
  → Remotion compose (all clips + effects + captions) → Final MP4
```

## Default Avatar Looks

If user does NOT provide avatar/look IDs, auto-select from these:

| Look ID | Description |
|---------|-------------|
| `2e8a789bfbf847d38a03470efbe64f69` | Áo sơ mi xanh nhạt, cầm micro nhỏ, medium close-up, background be |
| `7ebc6e135f574dcdb943d309cb97806a` | Áo sơ mi xanh nhạt + kính, laptop, medium shot, background tủ gỗ |
| `27776380b32d4b4aa4c5824571fc7117` | Áo sơ mi xanh nhạt, ghế lưới hai màn hình, background tường đá xám |


**Selection strategy**: Rotate looks across avatar chunks for visual variety.

## Input

User provides:
1. **MP3 file path** — local audio file (any language)
2. **Avatar look IDs** (optional) — if not provided, auto-select from defaults above
3. **Optional**: SRT file (skip Whisper step)
4. **Optional**: Use Grok visual videos? (ask user at start)
   - **Yes** (default): Pipeline includes visual segments with Grok-generated videos
   - **No**: All segments are `avatar` type — skip Steps 3c/3d and Step 4 entirely
5. **Optional**: HeyGen duration limit (seconds) — max total HeyGen avatar time
6. **Optional**: Custom b-roll media manifest — user-provided images/videos to use as visual segments instead of (or alongside) Grok videos. See "Custom B-roll Media" below.

## Custom B-roll Media

Users often have specific images or videos they want shown at certain moments — screenshots of articles, GitHub repos, app UIs, product demos, etc. These replace Grok visual segments with user-provided media, giving more authentic and contextual visuals.

### When to ask

After Step 1 (transcription) and before Step 2 (segment planning), ask:

> Bạn có ảnh hoặc video nào muốn dùng làm cảnh trám không?
> (Ví dụ: screenshot bài báo, giao diện GitHub, demo app...)
> Nếu có, tạo 1 file text mô tả theo format sau rồi đưa path cho mình:
>
> ```
> /path/to/screenshot.png | Bài báo TechCrunch về Claude AI ra mắt tính năng mới
> /path/to/github-repo.png | Thư viện GitHub anthropic-sdk với 50k stars
> /path/to/demo.mp4 | Video demo chạy Claude Code trên terminal
> ```
>
> Mỗi dòng: `đường dẫn file | mô tả nội dung`. Mình sẽ tự động ghép vào đúng chỗ phù hợp trong video.

If user says no or skips, proceed normally with Grok-only visuals.

### Manifest format

One line per media item: `file_path | description`

- **file_path**: absolute or relative path to image (.png, .jpg, .jpeg, .webp) or video (.mp4, .mov)
- **description**: brief Vietnamese/English description of what the media shows and when it should appear

### How to match custom media to segments

After reading the SRT transcript in Step 2:

1. **Parse the manifest** — read each line, split by `|`, validate file exists
2. **Semantic matching** — compare each media description against SRT text to find the best-fit segment. Look for keyword overlap, topic alignment, and contextual relevance. For example:
   - Media: "Thư viện GitHub claude-code" → matches segment discussing "claude-code trên GitHub"
   - Media: "Bài báo về AI Agent" → matches segment mentioning "tin tức mới về AI Agent"
3. **Mark matched segments as `custom`** type (not `visual`/`grok`) in the plan table
4. **Remaining visual segments** (unmatched by custom media) become Grok prompts as usual
5. If the user provides more custom media than visual segments, add extra visual segments where contextually appropriate (split longer avatar segments)

### Handling in production

- **Images**: Convert to a clip with static display. In Remotion props, use `imagePath` instead of `videoPath`:
  ```json
  { "imagePath": "media/custom/screenshot-1.png", "durationSeconds": 5.5 }
  ```
  Remotion displays the image full-screen (object-fit: cover) for the segment duration with the same zoom/effects as video clips.

- **Videos**: Trim to segment duration with ffmpeg, same as Grok videos:
  ```bash
  ffmpeg -i "<custom_video>" -t <segment_duration> -c copy "<output_path>"
  ```

- **Audio**: Same rule as Grok segments — custom media clips have no useful audio. Split the original MP3 for voiceover on these segments.

- **Copy to Remotion**: Place in `public/media/custom/` alongside heygen and grok folders:
  ```bash
  mkdir -p workspace/video-projects/remotion-studio/public/media/custom
  cp <custom_files> workspace/video-projects/remotion-studio/public/media/custom/
  ```

## Duration Constraints

### Rule 1: HeyGen ≤ 50% total duration
Total avatar segment time must NOT exceed 50% of the video's total duration. If initial planning exceeds 50%, convert avatar segments to visual segments (more Grok scenes) until the ratio is met.

### Rule 2: Short video limits (≤ 40s total)
When total video duration ≤ 40s:
- **≤ 30s**: Max 2 HeyGen avatar segments (≤ 15s total avatar time). Fill remaining with Grok visual scenes.
- **31-40s**: Max 3 HeyGen avatar segments (≤ 20s total avatar time). Fill remaining with Grok visual scenes.

When converting avatar → visual to meet these limits, prioritize keeping avatar for: **hook** (first segment) and **CTA** (last segment). Convert middle segments to visual first.

### Rule 3: Audio source
- **HeyGen avatar clips**: Already contain lip-synced audio. NEVER overlay `audioPath` on avatar clips — their built-in audio IS the voiceover.
- **Grok visual clips**: Have NO useful audio (mute them). For Grok segments, split the original MP3 into segment chunks and set each chunk as the audio source for that segment only.
- **`audioPath`** (top-level prop): ONLY set this when there are Grok/visual segments that need voiceover audio. When set, it mutes ALL clips including HeyGen avatars — so NEVER use it when video is all-avatar.
- **Mixed avatar + Grok videos**: Do NOT use `audioPath`. Instead, let HeyGen clips play their own audio, and attach MP3 segment chunks to Grok-only clips via per-clip `audioPath` or compose audio tracks per segment in Remotion.
- **All-avatar videos (no Grok)**: Do NOT set `audioPath` at all. Each HeyGen clip plays its own lip-synced audio natively.

## Step 1: Transcribe MP3 → SRT

Skip if user provides SRT.

```bash
uv run .claude/skills/heygen-short-video/scripts/transcribe_mp3.py "<mp3_path>" --language vi --model base
```

Output: `<stem>.srt` + `<stem>_segments.json` next to MP3.

**Word-level timestamps**: The segments JSON includes a `words` array per segment with `{word, start, end}` for each word. Use word timestamps to place SFX, zoom pulses, and music cues at exact word boundaries. Copy `words` array into each `CaptionSegment` for precise word-by-word rendering.

**Language detection**: Use `--language en` for English, `--language vi` for Vietnamese. Use `--model small` or `--model medium` for better accuracy.

## Step 2: Analyze SRT & Plan Segment Types

Read the SRT transcript and classify each segment:

| Type | When to use | Source |
|------|-------------|--------|
| `avatar` | Direct speaking, opinions, CTA, hooks, explanations | HeyGen avatar clip (lip-sync) |
| `visual` | Concepts, demos, scenarios, metaphors, processes | Grok AI-generated video (6s) |
| `custom` | User-provided b-roll matching this segment's content | User image/video from manifest |
| `prompt-typing` | Speaker reads/shows a prompt, command, text input | Remotion PromptTyping composition |

### Planning Rules

1. Read full SRT to understand story flow
2. Calculate total video duration from SRT
3. **Apply duration constraints** (see Duration Constraints above):
   - Calculate max allowed avatar time (50% of total, or stricter if ≤ 40s)
   - Plan avatar segments within this budget
   - If budget is tight, keep avatar for hook + CTA only, convert all middle segments to visual
4. Identify where **visual illustration** > talking head ("imagine...", "while you sleep...", "the AI automatically...")
5. Keep `avatar` for: personal statements, hooks, CTAs, transitions (within budget)
6. Use `prompt-typing` when: speaker reads a prompt verbatim or shows a command
7. Aim for 3-6+ visual/prompt-typing segments — more visual scenes for shorter videos
8. Each visual segment: 4-8 seconds of audio
9. Visual segments can span multiple SRT entries — group by semantic meaning
10. **Show duration budget** in plan: `Avatar: X.Xs / Y.Ys budget (Z%)`

Output as numbered table:

```
| # | Time | Type | SRT text (summary) | Grok prompt / Avatar note |
|---|------|------|--------------------|---------------------------|
| 1 | 0.0-3.5s | avatar | Hook: "Bạn có biết..." | Avatar front view, energetic |
| 2 | 3.5-9.0s | visual | "...AI tự động chạy..." | [Grok prompt here] |
```

## Step 3: Plan Production Elements

Based on segment plan, analyze ALL production elements in one pass.

### 3a: Effects & Captions per Segment

For each segment determine:

1. **style** — `hook`, `pain`, `normal`, `solution`, `cta`
2. **highlights** — key words to highlight (max 2-3)
3. **visual overlay** — emoji, b-roll GIF, OR tech logo (max 6-7 total, avatar segments only!)
   - See [references/visual-overlays.md](references/visual-overlays.md) for selection guide
   - **IMPORTANT**: `visual` type segments must NOT have overlays — Grok video IS the visual
4. **textEffect** — mix across segments to avoid repetition:
   - `word-by-word` (classic), `typewriter` (techy), `slam` (dramatic), `wave` (playful), `deep-glow` (premium), `flicker` (edgy), `none`
   - See [references/text-effects.md](references/text-effects.md) for details
5. **soundEffect** — meme sound (optional, max 3-5). See [references/meme-sounds.md](references/meme-sounds.md) and [references/sound-design-patterns.md](references/sound-design-patterns.md)

**Hook recipes** (rotate across videos):

| Recipe | textEffect | SFX | Best for |
|--------|-----------|-----|----------|
| Tech/AI | `typewriter` | keyboard click / digital beep | Demo, tutorial |
| Bold/Shock | `slam` | SUDDEN SUSPENSE / boom | Data hooks |
| Fun/Energy | `wave` | whoosh / snap | Casual hooks |

**Text effect by style**: `hook` → `word-by-word`, `pain` → `flicker`, key numbers → `deep-glow`, `cta` → `word-by-word`, `normal` → `none`

**Hook optimization (first 10s)**: Set `hookBoostSec: 10`, aggressive `zoomPulses`, camera-flash SFX at 0.0s.

### 3b: Background Music

See [references/bgm-selection.md](references/bgm-selection.md) for track library and matching guidelines.

### 3c: Grok Video Prompts

For each `visual` segment, generate a cinematic prompt. See [references/grok-prompts.md](references/grok-prompts.md) for template and examples.

### 3d: Present Full Plan to User

Present unified table + Grok prompts:

```
## Production Plan

| # | Time | Type | SRT summary | Style | Highlights | Visual/Emoji | TextEffect | SFX |
|---|------|------|-------------|-------|------------|-------------|------------|-----|
| 1 | 0.0-3.5s | avatar | Hook: "Bạn có biết..." | hook | ["biết"] | mind-blown | word-by-word | camera-flash |
| 2 | 3.5-9.0s | visual | "AI chạy lúc bạn ngủ" | normal | ["AI"] | — (Grok) | none | — |

BGM: Fortitude (0-10s, vol 0.15) → Miracle (10-30s, vol 0.12) → Rising Star (30s+, vol 0.15)

## Grok Video Prompts
**Visual 1** (3.5s-9.0s): > [prompt text]
```

Then instruct user:
> Hãy tạo các video bằng Grok với prompt trên (mỗi video 6s).
> Lưu vào folder `workspace/assets/reels/grok_visuals/` với tên: `1.mp4`, `2.mp4`...
> Sau khi xong, đưa path folder cho mình để tiếp tục.

**⏸️ PAUSE HERE** — Wait for user to provide Grok video paths.

## Step 4: Resume — Parallel Production ⚡

After user provides Grok videos, run these **3 tracks in parallel** (they have NO dependencies on each other):

### Track A: Verify & Trim Grok Videos

Verify files exist (`1.mp4`, `2.mp4`...). Trim if needed:
```bash
ffmpeg -i "<grok_video>" -t <segment_duration> -c copy "<output_path>"
```

### Track B: Render PromptTyping Segments

For each `prompt-typing` segment:

1. Create props JSON:
```json
{
  "text": "The prompt text to display...",
  "durationSeconds": 12,
  "title": "Prompt"
}
```
Optional: `startDelaySec` (default 0.5), `endPauseSec` (default 1.0)

2. Render:
```bash
cd workspace/video-projects/remotion-studio
npx remotion render src/index.ts PromptTyping out/prompt-1.mp4 --props=props/prompt-typing.json
```

### Track C: Split Audio & Generate Avatar Clips

#### C1: Split Audio

```bash
uv run .claude/skills/heygen-short-video/scripts/split_audio.py "<mp3_path>" "<srt_path>" \
  --avatars "7ebc6e135f574dcdb943d309cb97806a:talking-head micro,2e8a789bfbf847d38a03470efbe64f69:laptop desk,27776380b32d4b4aa4c5824571fc7117:dual monitor office,b6b2968fadf5432cb7ebc104da63808f:micro simple bg" \
  --min-chunk-duration 8 --max-chunk-duration 20 \
  --output-dir "<working_dir>/chunks"
```

Only include avatar segments. Replace avatar IDs if user provided custom ones.

#### C2: Upload & Submit to HeyGen (parallel per chunk)

**IMPORTANT: Use audioAssetId for lip-sync — NOT script+voiceId (TTS).**

Upload each chunk MP3 **in parallel**:
```bash
curl -X POST "https://upload.heygen.com/v1/asset" \
  -H "X-Api-Key: $HEYGEN_API_KEY" \
  -H "Content-Type: audio/mpeg" \
  --data-binary @"<chunk_path>"
```

Create video with `audioAssetId` **in parallel** (submit all chunks concurrently):
```
mcp__heygen__create_video:
  avatarId: chunk.avatar_id
  audioAssetId: <uploaded_asset_id>
  aspectRatio: "9:16"
  title: "chunk_{index}"
```

#### C3: Poll & Download (parallel per video)

```
For each video_id (poll all concurrently):
  mcp__heygen__get_video(videoId) → wait until status="completed"
  Download video_url to <working_dir>/heygen_clips/chunk_XXX.mp4
```

## Step 5: Compose with Remotion

After all 3 parallel tracks complete, compose the final video.

See [references/remotion-composition.md](references/remotion-composition.md) for full props structure, built-in effects, setup, and render commands.

Key steps:
1. Copy all clips + assets to `workspace/video-projects/remotion-studio/public/media/`
2. Build props JSON with interleaved clips, captions, effects, BGM
3. Render: `npx remotion render src/index.ts HeyGenShort out/heygen-short.mp4 --props=props/heygen-short.json`

## Step 6: Save Output

```
workspace/content/{YYYY-MM-DD}/video-short/
├── <slug>.mp4           # Final video
├── manifest.json        # Pipeline manifest
├── chunks/              # Split MP3s
├── heygen_clips/        # Downloaded avatar clips
└── grok_visuals/        # Grok-generated visual videos
```
