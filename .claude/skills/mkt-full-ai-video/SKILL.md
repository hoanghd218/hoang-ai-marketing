---
name: mkt-full-ai-video
description: End-to-end AI video production workflow — finalized script → MP3 voiceover → SRT + segments → production plan → HeyGen avatar clips → Remotion composition → final MP4. Expects a ready-to-voice short video script as input (script writing is handled upstream). Handles MP3 voiceover and SRT extraction directly, then delegates planning and editing to specialized sub-agents (video-ai-planner, video-ai-editor) with user checkpoints between phases. USE WHEN user says 'tạo video AI', 'full video pipeline', 'video end to end', 'tạo video hoàn chỉnh từ script', 'full AI video', 'video từ script đến render', 'tạo video ngắn hoàn chỉnh', 'pipeline video đầy đủ', 'sản xuất video AI từ script', 'make full video', 'produce complete video', 'full ai video workflow'.
---
# Full AI Video Production Workflow

End-to-end pipeline: finalized short video script → MP3 voiceover → SRT + word-level segments → production plan → HeyGen avatar clips → Remotion composition → final MP4.

Skill này điều phối một pipeline dài, nên chia ra các phase có **user checkpoint** giữa từng bước. Script được nhập trực tiếp (không viết lại), MP3 và SRT extraction xử lý ngay trong skill (nhẹ, cần user review). Planning và editing delegate sang specialized agents (`video-ai-planner`, `video-ai-editor`) để tránh nhồi 40KB+ context vào conversation chính.

---

## When to Use

- User đã có một **script ngắn hoàn chỉnh** (TikTok/Reels/Shorts) và muốn đi từ script tới MP4 hoàn chỉnh
- User đã có một phần pipeline (MP3, SRT, plan) và muốn tiếp tục tới cuối
- User cần pipeline tự động nhưng vẫn giữ điểm dừng để duyệt

Đừng dùng skill này nếu:
- User chưa có script và cần viết kịch bản → dùng `mkt-create-script-short-video` trước
- User chỉ muốn một bước đơn lẻ → gợi ý skill chuyên biệt (`mkt-video-script-to-mp3`, `mkt-ai-video-extract-srt-segment`, `plan-short-video-edit`, `heygen-remotion-short-video-editor`, ...)

---

## Pipeline Overview

```
Script (đã có) ──► Step 1: Input Script
                  │
                  ▼
            Step 2: Generate MP3 ── (checkpoint: voiceover OK?)
                  │
                  ▼
            Step 3: Extract SRT + Segments
                  │
                  ▼
            Step 4: Spawn video-ai-planner agent
                  │
                  ▼
            Step 5: Plan Review ── (checkpoint: plan OK?)
                  │
                  ▼
            Step 6: Spawn video-ai-editor agent (preview only)
                  │
                  ▼
            Step 7: User Review & Render ── (checkpoint: render?)
                  │
                  ▼
            Step 8: Final Report
```

Mỗi checkpoint là một điểm buộc phải chờ user xác nhận. KHÔNG tự bỏ qua — user muốn kiểm soát từng chặng vì một quyết định sai ở đầu pipeline tốn thời gian sửa ở cuối.

---

## Task Tracking (BẮT BUỘC)

Dùng `TodoWrite` để track progress 8 steps. Tạo tất cả ngay khi bắt đầu:

```
1. Input Script - nhận script đã finalized
2. Generate MP3 Voiceover (+ user review)
3. Extract SRT + Segments
4. Spawn video-ai-planner agent
5. Plan Review Checkpoint
6. Spawn video-ai-editor agent (preview)
7. User Review & Render
8. Final Report
```

**Khi hoàn tất mỗi step:** Mark task `completed` NGAY LẬP TỨC trước khi chuyển qua step kế tiếp. Không batch nhiều completions.

**Khi user request chỉnh sửa:** Mark task liên quan back to `in_progress`, thực hiện chỉnh sửa, rồi mark `completed` lại.

---

## Required Subagents & Skills (MANDATORY)

Pipeline này **BẮT BUỘC** delegate qua sub-agents cho 2 phases nặng để tránh nhồi context. Các phase khác xử lý trực tiếp trong main context hoặc qua Skill tool vì cần user review liên tục.

| Phase                       | Handler                                | Requirement                          |
| --------------------------- | -------------------------------------- | ------------------------------------ |
| Input Script (Step 1)       | —                                      | Direct execution (main context)      |
| MP3 (Step 2)                | —                                      | Direct execution (bash script)       |
| SRT + Segments (Step 3)     | `mkt-ai-video-extract-srt-segment`     | Via **Skill tool**                   |
| Planning (Step 4)           | `video-ai-planner`                     | **MUST** spawn via Agent tool        |
| Editing (Step 6)            | `video-ai-editor`                      | **MUST** spawn via Agent tool        |
| Render (Step 7)             | `video-ai-editor` (re-invoked)         | **MUST** spawn via Agent tool        |

**CRITICAL ENFORCEMENT:**

- Step 4, 6, 7 **MUST** dùng Agent tool để spawn subagents — KHÔNG trực tiếp gọi `plan-short-video-edit` hoặc `heygen-remotion-short-video-editor` trong main context
- DO NOT implement planning, editing, hoặc rendering logic yourself — DELEGATE cho subagent
- Nếu workflow kết thúc Step 4, 6, hoặc 7 mà có 0 Agent tool calls → workflow INCOMPLETE
- Pattern: `Agent(subagent_type="video-ai-planner", description="[brief]", prompt="[task]")`

---

## Step 1: Input Script

Pipeline này **KHÔNG** viết script — user phải đưa vào một script đã finalized. Xác định user đang có gì để không làm lại công việc đã xong:

| User có                    | Bắt đầu từ               |
| -------------------------- | ---------------------------- |
| Script (paste hoặc file)   | Step 2 (tạo MP3)             |
| Đã có MP3 voiceover        | Step 3 (extract SRT)         |
| Đã có SRT + segments       | Step 4 (planner)             |
| Đã có production plan      | Step 6 (editor)              |

Nếu user chưa có script, KHÔNG viết hộ — dừng lại, gợi ý họ chạy skill `mkt-create-script-short-video` trước rồi quay lại đây với script hoàn chỉnh.

**Xác định output directory:**

Tạo slug từ topic/tiêu đề chính (vd `tao-ai-agent-5-phut`). Output directory mặc định:

```
workspace/content/{YYYY-MM-DD}/video-short/<slug>/
```

Lưu slug và output directory để dùng xuyên suốt các step sau.

**Lưu script:**

Ghi script của user vào:

```
<output-dir>/script.txt
```

Nếu user paste script trong chat, viết nguyên văn vào file này. Nếu user trỏ tới một file có sẵn, copy nội dung qua `<output-dir>/script.txt` để các step sau có chuẩn path.

Confirm lại ngắn gọn với user (vd: "Đã lưu script vào `<path>`. Tiếp tục tạo voiceover.") rồi chuyển sang Step 2. KHÔNG cần present lại toàn bộ script — giả định script đã được review ở skill upstream.

---

## Step 2: Generate MP3 Voiceover

Nếu user chưa có MP3, chạy TTS:

```bash
uv run .claude/skills/mkt-video-script-to-mp3/scripts/text_to_mp3.py \
  --file <output-dir>/script.txt \
  -o <output-dir>/voiceover.mp3
```

Sau khi xong, báo cho user:

- Path MP3
- Duration (giây)
- File size

### Step 2b: Voiceover Review Checkpoint (BẮT BUỘC)

Chờ user xác nhận trước khi tiếp tục. Template:

> **MP3 voiceover đã sẵn sàng!**
>
> - Path: `<output-dir>/voiceover.mp3`
> - Duration: `<X>s`
> - File size: `<Y> MB`
>
> Nghe thử và nói "OK" để tiếp tục extract SRT, hoặc cho biết cần chỉnh voice/model/nhịp.

Họ có thể muốn re-record, đổi voice, hoặc chỉnh nhịp. Nếu user yêu cầu đổi voice/model, chạy lại script với params mới (xem `mkt-video-script-to-mp3/SKILL.md` để biết options). KHÔNG qua Step 3 cho tới khi user duyệt rõ ràng ("OK", "tiếp tục", "được rồi", "go", ...).

---

## Step 3: Extract SRT + Segments

Sau khi user OK voiceover, gọi skill `mkt-ai-video-extract-srt-segment` qua **Skill tool** để transcribe MP3 thành SRT + word-level segments JSON.

**Quan trọng:** Output directory phải là `<output-dir>/plan/` để file nằm đúng nơi video-ai-planner và các step sau trông tìm. Truyền cho skill:

- MP3 path: `<output-dir>/voiceover.mp3`
- Output dir: `<output-dir>/plan/`
- Language: `vi` (Vietnamese) — hoặc `en` nếu script tiếng Anh
- Model: `base` (mặc định; dùng `small` nếu voiceover khó nghe)

Nếu skill hỗ trợ script-based correction, truyền thêm `<output-dir>/script.txt` để fix các thuật ngữ English bị Whisper đọc nhầm.

Sau khi skill chạy xong, confirm cả 2 file đã tồn tại:

- `<output-dir>/plan/voiceover.srt`
- `<output-dir>/plan/voiceover_segments.json`

Báo lại ngắn gọn cho user (số segments, tổng duration) rồi chuyển sang Step 4 — KHÔNG cần checkpoint user ở đây vì SRT là artifact trung gian; nếu có lỗi text sẽ được sửa ở Plan Review.

---

## Step 4: Spawn video-ai-planner Agent

Đây là bước delegate đầu tiên. Dùng Agent tool với `subagent_type: "video-ai-planner"`. Không trực tiếp gọi `plan-short-video-edit` skill trong main context vì nó load nhiều reference files.

Planner **KHÔNG** còn extract SRT nữa — truyền trực tiếp path SRT + segments đã có từ Step 3.

**Agent tool call:**

```
subagent_type: "video-ai-planner"
description: "Plan short video production"
prompt: |
  Tạo production plan cho video ngắn.

  Input (SRT đã được extract upstream — KHÔNG re-run Whisper):
  - MP3 voiceover: <output-dir>/voiceover.mp3
  - Script: <output-dir>/script.txt
  - SRT (đã extract): <output-dir>/plan/voiceover.srt
  - Segments JSON (đã extract, word-level): <output-dir>/plan/voiceover_segments.json
  - Slug: <slug>

  Chạy pipeline: classify segments → plan effects/BGM/Grok prompts → pre-cut chunks → augment plan.
  Lưu output vào <output-dir>/plan/
```

Agent sẽ trả về paths tới:

- `<output-dir>/plan/production-plan.json` — plan chính (với slug, voiceoverChunks, chunk paths)
- `<output-dir>/plan/voiceover.srt` — SRT (đã có từ Step 3)
- `<output-dir>/plan/grok-prompts.md` — prompts cho Grok visuals
- `<output-dir>/plan/chunks/` — pre-cut HeyGen chunks + manifest

Chờ hoàn tất (không poll). Khi agent return, chuyển qua Step 5.

---

## Step 5: Plan Review Checkpoint

Report deliverables của planner cho user:

> **Production plan đã sẵn sàng!**
>
> - Script: `<path>/script.txt`
> - Audio: `<path>/voiceover.mp3`
> - SRT: `<path>/plan/voiceover.srt`
> - Plan: `<path>/plan/production-plan.json`
> - Grok Prompts: `<path>/plan/grok-prompts.md`
>
> Grok visual videos sẽ được tạo **tự động** qua 79ai API trong bước production.
> Nói "tiếp tục" để bắt đầu sản xuất video.

KHÔNG qua Step 6 cho tới khi user xác nhận rõ ràng. Đây là checkpoint quan trọng nhất vì Step 6 sẽ đốt HeyGen credits và mất thời gian render.

Nếu user yêu cầu chỉnh plan (vd "bớt avatar segment", "thêm b-roll"), edit `production-plan.json` trực tiếp theo yêu cầu rồi present lại.

---

## Step 6: Spawn sub agent video-ai-editor Agent

Delegate sang `video-ai-editor` để chạy HeyGen + Remotion. Dùng Agent tool với `subagent_type: "video-ai-editor"`.

**Agent tool call:**

```
subagent_type: "video-ai-editor"
description: "Produce video from plan"
prompt: |
  Produce video từ production plan.

  Input:
  - Production plan: <output-dir>/plan/production-plan.json
  - MP3 voiceover: <output-dir>/voiceover.mp3
  - SRT: <output-dir>/plan/voiceover.srt
  - Grok/custom videos: <output-dir>/grok_visuals/ (nếu có)

  Chạy full pipeline: HeyGen avatar clips → Remotion composition → preview.
  KHÔNG render MP4 cho đến khi user approve.
```

Chờ agent return. Agent sẽ dừng ở bước preview, KHÔNG auto-render.

---

## Step 7: User Review & Render

Relay output từ editor cho user:

> **Video đã sẵn sàng preview!**
> Mở Remotion Studio: http://localhost:3000
>
> Nói "render" khi hài lòng, hoặc cho biết cần chỉnh sửa gì.

Đợi user:

- **"render"** → tiếp tục spawn video-ai-editor lần nữa với prompt "render MP4 cuối cùng" (hoặc follow hướng dẫn của editor agent trong response trước)
- **Yêu cầu chỉnh sửa** (vd "text overlay quá nhanh", "cut đoạn 0:15-0:20") → relay lại cho editor qua agent call mới, hoặc edit props trực tiếp nếu sửa đơn giản

KHÔNG tự ý render. Lý do: final MP4 lock lại effects và captions — sửa sau khi render phải render lại mất thời gian.

---

## Step 8: Final Report

Sau khi render xong, báo tổng kết:

> **Video production hoàn tất!**
>
> - Script: `<output-dir>/script.txt`
> - Audio: `<output-dir>/voiceover.mp3`
> - SRT: `<output-dir>/plan/voiceover.srt`
> - Plan: `<output-dir>/plan/production-plan.json`
> - HeyGen clips: `<output-dir>/heygen_clips/`
> - Final MP4: `<output-dir>/final.mp4`
>
> Sẵn sàng upload TikTok/Reels/YouTube Shorts.

Nếu user muốn tạo caption/description cho post, gợi ý các skill tiếp theo như `mkt-content-repurposer` hoặc `video-to-facebook-posts`.

---

## Critical Rules

1. **Skill này KHÔNG viết script** — user phải cung cấp script đã finalized. Nếu chưa có, dừng và gợi ý `mkt-create-script-short-video`.
2. **MP3, SRT xử lý trực tiếp trong skill này** — không delegate cho planner. Lý do: cần review voiceover, SRT là artifact trung gian nhẹ.
3. **Planner chỉ làm planning, KHÔNG còn extract SRT** — classification, effects/BGM/Grok prompts, chunking, props. SRT truyền vào sẵn từ Step 3.
4. **Luôn dùng specialized agents cho planning và editing** — đừng gọi `plan-short-video-edit` hoặc `heygen-remotion-short-video-editor` skill trực tiếp trong main context. Lý do: context isolation.
5. **Grok visuals auto-generate** — video-ai-editor chạy `generate_grok_visuals.py` qua 79ai API. Không cần user bấm nút.
6. **Không bao giờ auto-render** — final MP4 chỉ tạo sau khi user approve explicit ở Step 7.
7. **Luôn có outro end card** — mỗi video Remotion phải kết với outro profile image + CTA (đã cấu hình sẵn trong editor skill, nhưng check lại final preview).
8. **User checkpoint là bắt buộc** — không "chạy tất một lèo" dù user nói "tự động đi". Checkpoint chính: voiceover OK (Step 2b), plan OK (Step 5), render OK (Step 7).
9. **Skip forward khi input đã có** — nếu user đã có plan, nhảy thẳng Step 6. Đừng làm lại MP3/SRT/plan khi user nói rõ là đã có.

---

## Output Directory Structure

Sau khi pipeline hoàn tất, `<output-dir>` chứa:

```
workspace/content/{YYYY-MM-DD}/video-short/<slug>/
├── script.txt                      # Step 1
├── voiceover.mp3                   # Step 2
├── plan/
│   ├── voiceover.srt               # Step 3
│   ├── voiceover_segments.json     # Step 3
│   ├── production-plan.json        # Step 4
│   ├── grok-prompts.md             # Step 4
│   └── chunks/                     # Step 4 (pre-cut HeyGen chunks)
│       ├── chunk_*.mp3
│       └── manifest.json
├── grok_visuals/                   # auto-generated by editor
│   └── *.mp4
├── heygen_clips/                   # Step 6
│   └── *.mp4
├── remotion/                       # Step 6 (props + composition)
│   └── props.json
└── final.mp4                       # Step 7
```

---

## Troubleshooting

| Vấn đề                                   | Giải pháp                                                                            |
| ------------------------------------------- | -------------------------------------------------------------------------------------- |
| User chưa có script                        | Dừng pipeline, gợi ý chạy `mkt-create-script-short-video` trước                     |
| MP3 quá dài (>90s)                          | Yêu cầu user sửa script rồi re-run Step 2. Short video tốt nhất ở 45-75s             |
| Whisper đọc sai thuật ngữ English           | Trong Step 3, truyền thêm `script.txt` cho skill extract để script-based correction   |
| video-ai-planner fail khi classify segments | Check SRT có đúng ngôn ngữ không — nếu sai ngữ, chạy lại Step 3 với `--language` khác |
| HeyGen credit cạn                           | Dừng pipeline ở Step 6, báo user nạp credits rồi tiếp                                 |
| Remotion preview sai ảnh avatar             | Check outro end card config trong editor skill, re-run Step 6                          |
| User muốn đổi voice sau khi plan xong       | Re-run Step 2 với voice mới, rồi Step 3 (SRT mới), rồi Step 4 (plan mới)            |

---

## Ví dụ Sử dụng

**Ví dụ 1 — Từ script đã có (flow chuẩn):**

```
User: "Đây là script của mình [paste]. Làm video hoàn chỉnh giúp mình."
→ Step 1: Lưu script vào script.txt
→ Step 2: Generate MP3 → Step 2b: Present cho user OK
→ Step 3: Call mkt-ai-video-extract-srt-segment skill → SRT + segments
→ Step 4: Spawn video-ai-planner (với SRT path)
→ Step 5: Present plan, chờ "tiếp tục"
→ Step 6: Spawn video-ai-editor
→ Step 7: Preview, chờ "render"
→ Step 8: Final report
```

**Ví dụ 2 — Từ file script:**

```
User: "Script ở workspace/content/2026-04-09/video-short/demo/script.txt. Chạy full pipeline."
→ Step 1: Xác nhận script tồn tại, set output-dir
→ Step 2 → Step 8 như bình thường
```

**Ví dụ 3 — Từ MP3 đã có:**

```
User: "Mình đã có voiceover.mp3 ở workspace/content/2026-04-09/video-short/demo-vibe-coding/. Tiếp tục giúp mình."
→ Step 1: Xác định đã có MP3 + script
→ Skip Step 2
→ Step 3: Extract SRT
→ tiếp tục Step 4-8
```

**Ví dụ 4 — Chưa có script:**

```
User: "Tạo video AI về Claude Code cho người mới"
→ Step 1: Phát hiện chưa có script
→ DỪNG: "Skill này cần script đã finalized. Bạn có thể chạy skill `mkt-create-script-short-video` trước để viết script, rồi quay lại đây để chạy full pipeline."
```
