---
name: mkt-full-short-video-from-transcript
description: "End-to-end short video creation pipeline: write script → generate MP3 voiceover → produce HeyGen avatar + Grok visual video. Orchestrates 3 skills (mkt-create-script-short-video, mkt-video-script-to-mp3, heygen-short-video) with user checkpoints between phases. Input is a topic, content idea, or transcript excerpt. Output is a final MP4 video ready for TikTok/Reels/Shorts. USE WHEN user says 'tạo video từ đầu đến cuối', 'full video pipeline', 'video end to end', 'tạo video hoàn chỉnh', 'full short video', 'video từ ý tưởng', 'tạo video ngắn từ topic', 'end to end video', 'pipeline video ngắn', 'tạo video từ chủ đề'."
---

# Full Short Video Pipeline

Create a complete short video from topic → script → MP3 → HeyGen avatar video, orchestrating 3 skills with user confirmation between phases.

```
Topic/Idea → [Script] → ⏸️ confirm → [MP3] → ⏸️ confirm → [HeyGen+Grok+Remotion] → Final MP4
```

## Phase 1: Generate Script

Load and follow `.claude/skills/mkt-create-script-short-video/SKILL.md`.

1. Use the user's topic/idea as input
2. Follow the skill's full workflow (gather info → select structure → write script)
3. Present the final script

**⏸️ CHECKPOINT**: Confirm script before proceeding.

```
Script hoàn tất! Bạn muốn:
1. ✅ Duyệt script → tiếp tục tạo audio
2. ✏️ Chỉnh sửa (cho mình biết cần sửa gì)
```

Wait for user response. If edits requested, revise and re-confirm.

## Phase 2: Generate MP3 Voiceover

After script confirmed:

1. Save script to `workspace/content/{YYYY-MM-DD}/video-short/<slug>/script.txt`
2. Generate MP3:

```bash
uv run .claude/skills/mkt-video-script-to-mp3/scripts/text_to_mp3.py \
  --file workspace/content/{YYYY-MM-DD}/video-short/<slug>/script.txt \
  -o workspace/content/{YYYY-MM-DD}/video-short/<slug>/voiceover.mp3
```

3. Report duration and file size

**⏸️ CHECKPOINT**: Confirm audio before proceeding.

```
Audio đã tạo! (duration: Xs, size: XKB)
Bạn muốn:
1. ✅ Audio OK → tiếp tục tạo video
2. 🔄 Tạo lại (chỉnh speed/voice)
```

## Phase 3: Create Video

After audio confirmed, load and follow `.claude/skills/heygen-short-video/SKILL.md` with:

- **MP3 input**: `workspace/content/{YYYY-MM-DD}/video-short/<slug>/voiceover.mp3`
- Follow the heygen-short-video pipeline exactly (it has its own pause points for Grok videos)

## Output

All deliverables in `workspace/content/{YYYY-MM-DD}/video-short/<slug>/`:

| File | Description |
|------|-------------|
| `script.txt` | Confirmed script |
| `voiceover.mp3` | TTS audio |
| `<slug>.mp4` | Final rendered video |
| `chunks/` | Split audio chunks |
| `heygen_clips/` | Avatar clips |
| `grok_visuals/` | Grok visual videos |

## Slug Convention

Generate from topic: lowercase, hyphenated, max 5 words. Example: "AI agent tự động" → `ai-agent-tu-dong`
