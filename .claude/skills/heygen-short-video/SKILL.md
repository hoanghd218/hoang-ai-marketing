---
name: heygen-short-video
description: "Create knowledge-sharing short videos (TikTok/Reels) using HeyGen AI avatars + Grok visual videos + Remotion composition. Pipeline: MP3 audio input → Whisper transcription → analyze SRT & plan segments (avatar vs visual) → generate Grok video prompts for visual scenes → user creates Grok videos → split audio for avatar segments → HeyGen avatar clips → compose with Remotion (captions, effects, background music, progress bar). USE WHEN user says 'tạo video heygen', 'heygen short video', 'video avatar ngắn', 'avatar video from mp3', 'tạo video từ mp3 với avatar', 'heygen avatar video', 'video chia sẻ kiến thức avatar'."
---

# HeyGen Short Video Creator

Create short viral videos combining AI avatar (HeyGen) + AI visual scenes (Grok video) from MP3 audio input.

## Pipeline

```
MP3 → Whisper SRT → Analyze SRT & plan segments
→ Analyze effects, BGM & generate Grok visual prompts (PAUSE)
→ User creates Grok videos & provides paths (RESUME)
→ Split audio for avatar-only chunks → HeyGen avatar clips → Download
→ Remotion compose (all clips + effects + captions) → Final MP4
```

## Default Avatar Looks

If user does NOT provide avatar/look IDs, auto-select from these:

| Look ID | Description |
|---------|-------------|
| `7ebc6e135f574dcdb943d309cb97806a` | Áo sơ mi xanh nhạt, ngồi trước background be, ghế lưới phía sau, cầm micro nhỏ, medium close-up talking-head |
| `2e8a789bfbf847d38a03470efbe64f69` | Áo sơ mi xanh nhạt + đeo kính, ngồi trước bàn với laptop, medium shot, background phòng tủ gỗ tường sáng |
| `27776380b32d4b4aa4c5824571fc7117` | Áo sơ mi xanh nhạt, ghế lưới trước bàn hai màn hình, medium close-up, background tường đá xám phòng làm việc |
| `b6b2968fadf5432cb7ebc104da63808f` | Áo sơ mi xanh nhạt, cầm micro nhỏ khi nói, medium close-up, background tường be đơn giản |

**Selection strategy**: Rotate looks across avatar chunks for visual variety. Pick looks that match segment mood (e.g., laptop look for demo segments, micro look for direct-to-camera hooks/CTA).

## Input

User provides:
1. **MP3 file path** — local audio file (any language)
2. **Avatar look IDs** (optional) — if not provided, auto-select from Default Avatar Looks above
3. **Optional**: SRT file (skip Whisper step)
4. **Optional**: Use Grok visual videos? (ask user at start)
   - **Yes** (default): Pipeline includes visual segments with Grok-generated videos as B-roll scenes
   - **No**: All segments are `avatar` type — no visual scenes, no PAUSE step. Skip Steps 3c/3d and Step 4 entirely. Step 3 only plans effects, captions, and BGM.

## Step 1: Transcribe MP3 → SRT

Skip if user provides SRT.

```bash
uv run .claude/skills/heygen-short-video/scripts/transcribe_mp3.py "<mp3_path>" --language vi --model base
```

Output: `<stem>.srt` + `<stem>_segments.json` next to MP3.

**Word-level timestamps**: The segments JSON now includes a `words` array per segment with precise timing for each word:
```json
{
  "id": 0, "start": 0.0, "end": 2.8,
  "text": "Bạn không biết bán gì online",
  "words": [
    {"word": "Bạn", "start": 0.0, "end": 0.35},
    {"word": "không", "start": 0.35, "end": 0.55},
    {"word": "biết", "start": 0.55, "end": 0.75}
  ]
}
```
Use word timestamps to place SFX, zoom pulses, and music cues at exact word boundaries. When building `captions` in props JSON, copy the `words` array into each `CaptionSegment` for precise word-by-word rendering.

**Language detection**: Check filename for language hints. Use `--language en` for English, `--language vi` for Vietnamese. Use `--model small` or `--model medium` for better accuracy (slower).

## Step 2: Analyze SRT & Plan Segment Types

Read the SRT transcript and classify each segment into two types:

### Segment Types

| Type | When to use | Source |
|------|-------------|--------|
| `avatar` | Direct speaking, personal opinions, CTA, hooks, explanations | HeyGen avatar clip (lip-sync) |
| `visual` | Concepts, demos, scenarios, metaphors, processes being described | Grok AI-generated video (6s) |
| `prompt-typing` | Speaker reads/shows a prompt, command, or text input | Remotion PromptTyping composition (auto-rendered) |

### Planning Rules

1. Read full SRT transcript to understand the story flow
2. Identify segments where **visual illustration** would be more powerful than a talking head
3. Good candidates for `visual`: describing a scenario, explaining a process, painting a picture ("imagine...", "while you sleep...", "the AI automatically...")
4. Keep `avatar` for: personal statements, opinions, hooks, CTAs, transitions
5. Use `prompt-typing` when: speaker reads a prompt verbatim, shows a command, or dictates text input
6. Aim for 3-6 visual/prompt-typing segments per 60s video (don't overdo)
7. Each visual segment should cover 4-8 seconds of audio
8. Visual segments can span multiple SRT entries — group by semantic meaning

### Output: Segment Plan Table

Present to user as a numbered table:

```
| # | Time | Type | SRT text (summary) | Grok prompt / Avatar note |
|---|------|------|--------------------|---------------------------|
| 1 | 0.0-3.5s | avatar | Hook: "Bạn có biết..." | Avatar front view, energetic |
| 2 | 3.5-9.0s | visual | "...AI tự động chạy trong lúc bạn ngủ" | [Grok prompt here] |
| 3 | 9.0-15.0s | avatar | "Đây là cách mình làm..." | Avatar side angle |
| ... | | | | |
```

## Step 3: Analyze Effects, BGM & Generate Grok Visual Prompts

Based on the segment plan from Step 2, analyze the full SRT to plan ALL production elements in one pass: visual effects, caption styles, background music, sound effects, AND Grok video prompts.

### 3a: Plan Visual Effects & Captions per Segment

For each segment (both `avatar` and `visual`), determine:

1. **style** — `hook`, `pain`, `normal`, `solution`, `cta`
2. **highlights** — key words to highlight in accent color (max 2-3)
3. **visual overlay** — animated emoji, b-roll GIF, OR tech logo (max 6-7 per video total)
   - **Emoji**: `@remotion/animated-emoji` name → set `emoji` field. See [references/animated-emoji-map.md](references/animated-emoji-map.md)
   - **B-roll GIF**: matching GIF from catalog → set as `bRollOverlays` entry. Read `workspace/assets/reels/broll_gifs/_catalog.json` to find by mood/tags/emotion
   - **Tech Logo**: when mentioning a specific tool/platform → set as `bRollOverlays` entry with `position: "bottom"`. Read `workspace/assets/reels/logos/_catalog.json` to match caption keywords → logo file
   - **IMPORTANT**: Segments using Grok visual video (`visual` type) must NOT have emoji, GIF, or logo overlays — the Grok video itself IS the visual. Only assign overlays to `avatar` segments.
4. **textEffect** — choose from 7 effects. **Mix different effects across segments** to avoid repetitive feel:
   - `word-by-word` — smooth fade-up per word (classic, clean)
   - `typewriter` — sharp cut reveal like typing, with blinking cursor (techy, snappy)
   - `slam` — words drop in with scale bounce from above (dramatic, impactful)
   - `wave` — words ripple in with continuous sine-wave motion (playful, energetic)
   - `deep-glow` — highlights pulse with multi-layer glow (premium, cinematic)
   - `flicker` — highlights oscillate opacity (mysterious, edgy)
   - `none` — plain text, no animation
   See [references/text-effects.md](references/text-effects.md)

   **Hook Style Recipes** — rotate across videos to keep content fresh:

   | Recipe | textEffect | Paired SFX | Best for |
   |--------|-----------|-----------|----------|
   | **Tech/AI** | `typewriter` | keyboard click or digital beep | Demo, tutorial hooks |
   | **Bold/Shock** | `slam` | SUDDEN SUSPENSE or boom | Data hooks, bold statements |
   | **Fun/Energy** | `wave` | whoosh or snap | Lifestyle, casual hooks |

5. **soundEffect** — meme sound at caption start (optional, max 3-5). See [references/meme-sounds.md](references/meme-sounds.md) and [references/sound-design-patterns.md](references/sound-design-patterns.md)

### Caption Style Types

| Style | When to use | Visual |
|-------|-------------|--------|
| `hook` | Opening 1-2 sentences | Red bg, 44px bold, gold accent |
| `pain` | Pain points, problems | Black bg + red border/glow |
| `solution` | Benefits, solutions | Dark green bg + green glow |
| `cta` | Call-to-action (last) | Purple gradient + bouncing arrow |
| `normal` | Everything else | Black semi-transparent bg |

### Visual Overlay Selection Guide (avatar segments only)

**Animated Emoji** (for emotions/reactions):

| Context | Emoji Name |
|---------|-----------|
| Shock | `mind-blown`, `screaming` |
| Sleep/bored | `sleep`, `yawn` |
| Pain | `weary`, `distraught`, `cross-mark` |
| Idea | `light-bulb`, `thinking-face` |
| Success | `check-mark`, `sparkles`, `fire`, `muscle` |
| CTA | `bell`, `wave`, `index-finger` |

**B-roll GIF** (for concrete concepts — read catalog for full list):

| Segment topic | Catalog category | Example tags |
|---------------|-----------------|--------------|
| Money/revenue | `01_tien_bac` | money, revenue, profit |
| Growth/success | `02_tang_truong` | growth, chart, rocket |
| AI/tech | `04_AI_cong_nghe` | AI, robot, automation |
| Work/productivity | `05_lam_viec` | typing, laptop, team |
| Time/speed | `08_toc_do` | fast, clock, running |

**Tech Logo** (when mentioning specific tools — read `workspace/assets/reels/logos/_catalog.json`):

| Caption mentions | Logo file | Label |
|-----------------|-----------|-------|
| claude, anthropic | `claude.webp` | Claude |
| claude code | `claude code.jpeg` | Claude Code |
| chatgpt, gpt, openai | `chatgpt.png` | ChatGPT |
| gemini, google ai | `gemini.svg` | Gemini |
| excel, spreadsheet | `excel.jpg` | Excel |
| nano banana, nano | `nano banana.jpg` | Nano Banana |

Usage: add as `bRollOverlays` entry with `position: "bottom"`, same as GIF. To add more logos, place image files in `workspace/assets/reels/logos/` and update `_catalog.json`.

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

### 3b: Select Background Music

Music library: `workspace/assets/reels/background music/`

#### Available Tracks

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

#### Music Selection Guidelines

- **Default volume**: `0.12` (subtle, won't compete with avatar speech)
- **Max volume**: `0.15` (hard cap in code — values above 0.15 are clamped)
- **Multiple tracks**: Switch tracks to match mood shifts (e.g., calm intro → intense middle → uplifting CTA)
- **Fade**: Default `fadeInSec: 1`, `fadeOutSec: 2` — increase fadeOut to 3-4s for smoother endings

#### Music Matching by Video Section

| Section | Recommended Track | Volume |
|---------|------------------|--------|
| Hook (0-3s) | `Fortitude` or `Chase Velocity` | 0.15 |
| Pain point | `Chase Velocity` or `Epic Emotional` | 0.12 |
| Solution/Demo | `Miracle` or `Aluminum` | 0.10 |
| Climax/Result | `Ascension` or `The Last Hero` | 0.15 |
| CTA | `Rising Star` | 0.15 |

### 3c: Generate Grok Video Prompts

For each `visual` segment, generate a cinematic Grok video prompt.

#### Prompt Template

```
[Cinematic scene description matching the spoken content]. [Visual details: lighting, camera, atmosphere]. [Camera movement]. Ultra realistic, cinematic depth of field, 6 second video
```

#### Prompt Guidelines

- Describe the scene that **illustrates** what the speaker is talking about
- Include: setting, action, lighting, camera movement, atmosphere
- Always end with: `ultra realistic, cinematic depth of field, 6 second video`
- Match the emotional tone of the segment (calm, intense, futuristic, etc.)
- Use specific visual details, not abstract concepts
- For tech/AI topics: show screens, dashboards, automation workflows, glowing interfaces
- For business topics: show workspaces, entrepreneurs, results on screens

#### Prompt Examples

**Segment: "AI tự động chạy trong lúc bạn ngủ"**
```
A cinematic night scene of a young entrepreneur sleeping peacefully in a modern bedroom while a laptop on a desk continues running AI automation tasks. The screen shows dashboards, notifications, and automation workflows moving. The room is dim with soft blue monitor light illuminating the scene. Outside the window the sky slowly transitions from night to early morning. Slow camera push-in, calm atmosphere, realistic lighting, cinematic depth of field, ultra realistic, 6 second video
```

**Segment: "Email tự phân loại nhờ AI"**
```
A futuristic email dashboard where hundreds of emails automatically sort themselves into categories using artificial intelligence. Labels like urgent, reply, and spam appear while messages move into folders automatically. Dark mode interface glowing on a laptop screen in a modern workspace. Smooth UI animation, camera slowly zooming toward the screen, cinematic tech atmosphere, 5 second video
```

### 3d: Output — Present Full Analysis to User

Present the complete analysis as one unified table + Grok prompts:

```
## Production Plan

| # | Time | Type | SRT summary | Style | Highlights | Visual/Emoji | TextEffect | SFX |
|---|------|------|-------------|-------|------------|-------------|------------|-----|
| 1 | 0.0-3.5s | avatar | Hook: "Bạn có biết..." | hook | ["biết"] | mind-blown | word-by-word | camera-flash |
| 2 | 3.5-9.0s | visual | "AI chạy lúc bạn ngủ" | normal | ["AI"] | — (Grok video) | none | — |
| 3 | 9.0-15.0s | avatar | "Đây là cách mình làm" | normal | ["cách"] | light-bulb | none | — |

BGM: Fortitude (0-10s, vol 0.15) → Miracle (10-30s, vol 0.12) → Rising Star (30s+, vol 0.15)

## Grok Video Prompts

**Visual 1** (3.5s-9.0s): "AI chạy tự động lúc ngủ"
> [prompt text]

**Visual 2** (15.0s-20.5s): "Dashboard phân tích dữ liệu"
> [prompt text]
```

Then instruct user:
> Hãy tạo các video bằng Grok với prompt trên (mỗi video 6s).
> Lưu vào folder `workspace/assets/reels/grok_visuals/` với tên:
> `1.mp4`, `2.mp4`, `3.mp4`...
> Sau khi xong, đưa path folder cho mình để tiếp tục.

**PAUSE HERE** — Wait for user to create Grok videos and provide paths.

## Step 4: Resume — User Provides Grok Videos

User provides path to Grok video files (e.g., `workspace/assets/reels/grok_visuals/`).

Verify files exist: `1.mp4`, `2.mp4`, etc. matching the number of visual segments planned.

Grok videos are 6s each. Trim if needed to match segment duration:
```bash
ffmpeg -i "<grok_video>" -t <segment_duration> -c copy "<output_path>"
```

## Step 4b: Render Prompt Typing Segments

For each `prompt-typing` segment, render a Remotion PromptTyping composition to MP4.

1. Create props JSON:
```json
{
  "text": "Tôi muốn bạn hiểu rõ về tôi, tôi đang làm công việc... Hãy đặt cho tôi mọi câu hỏi bạn cần để hiểu rõ mục tiêu, khách hàng, sản phẩm và kỳ vọng của tôi.",
  "durationSeconds": 12,
  "title": "Prompt"
}
```

Props:
- `text` — the prompt/command text to display (typing animation)
- `durationSeconds` — must match the audio segment duration
- `title` (optional) — label above input box (default "Prompt")
- `startDelaySec` (optional) — delay before typing starts (default 0.5)
- `endPauseSec` (optional) — pause after typing finishes (default 1.0)

2. Render:
```bash
cd workspace/video-projects/remotion-studio
npx remotion render src/index.ts PromptTyping out/prompt-1.mp4 --props=props/prompt-typing.json
```

3. Use output MP4 as a regular clip in the HeyGenShort composition (same as Grok videos).

**Visual**: Dark grid background + glassmorphism card + character-by-character typing with blinking cursor. Looks like typing into a chat input.

## Step 5: Split Audio & Generate Avatar Clips

Only split and submit to HeyGen the **avatar-type segments** (not visual segments).

### 5a: Split Audio for Avatar Chunks

```bash
uv run .claude/skills/heygen-short-video/scripts/split_audio.py "<mp3_path>" "<srt_path>" \
  --avatars "7ebc6e135f574dcdb943d309cb97806a:talking-head micro,2e8a789bfbf847d38a03470efbe64f69:laptop desk,27776380b32d4b4aa4c5824571fc7117:dual monitor office,b6b2968fadf5432cb7ebc104da63808f:micro simple bg" \
  --min-chunk-duration 8 --max-chunk-duration 20 \
  --output-dir "<working_dir>/chunks"
```

Replace avatar IDs above with user-provided IDs if given. Otherwise use the default looks.

**Important**: Only include avatar segments in the split. Visual segments will use Grok videos with the original audio playing underneath.

### 5b: Upload Audio & Submit to HeyGen

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

### 5c: Poll & Download

```
For each video_id:
  mcp__heygen__get_video(videoId) → wait until status="completed"
  Download video_url to <working_dir>/heygen_clips/chunk_XXX.mp4
```

## Step 6: Compose with Remotion

Component: `src/templates/HeyGenShort.tsx` (imports from `src/templates/heygen-short/`)

### Assembling Clips

The `clips` array contains BOTH avatar clips (HeyGen) and visual clips (Grok) in timeline order:

```json
{
  "clips": [
    { "videoPath": "media/heygen/chunk_000.mp4", "durationSeconds": 3.5 },
    { "videoPath": "media/grok/1.mp4", "durationSeconds": 5.5 },
    { "videoPath": "media/heygen/chunk_001.mp4", "durationSeconds": 6.0 },
    { "videoPath": "media/grok/2.mp4", "durationSeconds": 5.0 },
    { "videoPath": "media/heygen/chunk_002.mp4", "durationSeconds": 8.0 }
  ]
}
```

**Key**: Interleave avatar and Grok clips in the order they appear in the script timeline.

### Props structure (`props/heygen-short.json`):

```json
{
  "clips": [
    { "videoPath": "media/heygen/chunk_000.mp4", "durationSeconds": 3.5 },
    { "videoPath": "media/grok/1.mp4", "durationSeconds": 5.5 },
    { "videoPath": "media/heygen/chunk_001.mp4", "durationSeconds": 15.0 }
  ],
  "captions": [
    {
      "text": "Opening hook text here",
      "startSec": 0.0, "endSec": 3.44,
      "style": "hook",
      "highlights": ["key phrase"],
      "emoji": "mind-blown",
      "textEffect": "word-by-word",
      "captionPosition": 55,
      "words": [
        {"word": "Một", "start": 0.0, "end": 0.2},
        {"word": "mình", "start": 0.2, "end": 0.45},
        {"word": "mà", "start": 0.45, "end": 0.6}
      ]
    }
  ],
  "soundEffects": [
    { "audioPath": "media/sfx/SUDDEN SUSPENSE.mp3", "startSec": 0.0, "volume": 0.6 }
  ],
  "zoomPulses": [
    { "timeSec": 0.0, "scale": 1.15, "type": "hold", "durationFrames": 10, "holdSec": 2.5 }
  ],
  "bRollOverlays": [
    { "mediaPath": "media/broll/money-rain.gif", "startSec": 5.0, "endSec": 8.0, "position": "bottom", "borderRadius": 20 }
  ],
  "backgroundMusic": [
    { "audioPath": "media/bgm/Aluminum - Roie Shpigler.mp3", "startSec": 0, "volume": 0.12, "fadeInSec": 1, "fadeOutSec": 2 },
    { "audioPath": "media/bgm/Rising Star - Song by TURPAK.mp3", "startSec": 30, "volume": 0.15, "fadeInSec": 1, "fadeOutSec": 3 }
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
8. **Visual overlays** — animated emoji or b-roll GIF at bottom position with spring bounce/fade
9. **Caption position** — configurable top% (default 55, near neck area)
10. **Progress bar** — gradient bar at top
11. **CTA arrow** — animated pointing finger for call-to-action
12. **Sound effects** — meme sounds at specific timestamps
13. **Style-based caption boxes** — different bg/border/glow per style type
14. **Background music** — multi-track with per-track volume, fade in/out, loop

### Setup & Render

1. Copy clips and assets to Remotion public folder:
```bash
mkdir -p workspace/video-projects/remotion-studio/public/media/{heygen,grok,sfx,broll,bgm,logos}
cp <working_dir>/heygen_clips/*.mp4 workspace/video-projects/remotion-studio/public/media/heygen/
cp workspace/assets/reels/grok_visuals/*.mp4 workspace/video-projects/remotion-studio/public/media/grok/
cp "workspace/assets/reels/MEME SOUND/<chosen_sound>.mp3" workspace/video-projects/remotion-studio/public/media/sfx/
cp "workspace/assets/reels/background music/<chosen_track>.mp3" workspace/video-projects/remotion-studio/public/media/bgm/
cp "workspace/assets/reels/broll_gifs/<category>/<chosen_gif>.gif" workspace/video-projects/remotion-studio/public/media/broll/
```

### Grok visual video handling

- Grok generates 6s videos. Trim with `ffmpeg -t <needed_duration>` if segment is shorter
- Place trimmed Grok videos in `public/media/grok/1.mp4`, `2.mp4`...
- Grok clips appear as full-screen video in the clips timeline (same as avatar clips)
- Captions still overlay on top of Grok visual clips — this creates a "voiceover + visual" effect
- Use fewer emoji/GIF overlays on Grok visual segments since the visual is already rich

### Visual overlay GIF selection from catalog

When using b-roll GIF as visual overlay (instead of emoji), read `workspace/assets/reels/broll_gifs/_catalog.json`:

1. Match segment **mood/emotion** → category `emotion` field
2. Match segment **topic keywords** → file `tags` field
3. Match segment **intent** → file `best_for` field
4. Use `position: "bottom"` to place GIF at same position as emoji
5. Time `startSec`/`endSec` to match the caption's timing

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
├── heygen_clips/        # Downloaded avatar clips
└── grok_visuals/        # Grok-generated visual videos
```
