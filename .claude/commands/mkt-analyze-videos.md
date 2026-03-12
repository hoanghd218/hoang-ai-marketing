---
description: Phân tích danh sách video YouTube do người dùng cung cấp — lấy transcript, bóc insight, đẩy Notion
argument-hint: [video URLs or IDs, space-separated]
allowed-tools: Bash(python3:*), Bash(uv:*), Bash(mkdir:*), Bash(curl:*), Read, Write, Task, Skill
---

# Analyze YouTube Videos

Phân tích danh sách video YouTube do người dùng cung cấp: lấy metadata, transcript, bóc insight, đẩy Notion.

**Input:** $ARGUMENTS — danh sách YouTube URLs hoặc video IDs, cách nhau bằng dấu cách hoặc xuống dòng.

Ví dụ:
- `https://www.youtube.com/watch?v=abc123 https://youtu.be/def456`
- `abc123 def456 ghi789`

## Output Structure

```
workspace/content/YYYY-MM-DD/
├── videos.json          # Danh sách video với metadata + Notion page IDs
├── transcripts/         # Transcript từng video
│   ├── <slug>.txt
│   └── <slug>.txt
├── images/              # Thumbnail từng video
│   ├── <slug>.jpg
│   └── <slug>.jpg
```

## Slug Convention

Tên file lưu xuống dùng **slug của tên video** (không dùng video_id):

- Chuyển title thành lowercase, bỏ dấu tiếng Việt, thay khoảng trắng và ký tự đặc biệt bằng `-`, bỏ dấu `--` thừa, giới hạn 80 ký tự
- Ví dụ: "Claude Code HACKS từ Founder Anthropic" → `claude-code-hacks-tu-founder-anthropic`
- Dùng slug này cho tất cả file: transcript, thumbnail, insights, content

## Workflow

### Phase 1: Parse input & fetch video metadata

1. Parse `$ARGUMENTS` to extract video IDs:
   - From full URLs: `https://www.youtube.com/watch?v=VIDEO_ID`, `https://youtu.be/VIDEO_ID`
   - From bare IDs: `VIDEO_ID`
   - Strip any query params after `&`

2. For each video ID, fetch metadata using YouTube API:

```bash
python3 -c "
import requests, os, json, sys
from dotenv import load_dotenv
load_dotenv()
api_key = os.getenv('YOUTUBE_API_KEY')
video_ids = sys.argv[1]
url = f'https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id={video_ids}&key={api_key}'
r = requests.get(url)
print(json.dumps(r.json(), ensure_ascii=False, indent=2))
" "VIDEO_ID1,VIDEO_ID2,..."
```

3. Build video list from API response with: `video_id`, `title`, `channel`, `views`, `published_at`, `thumbnail_url`

4. If no valid videos found, report "Không tìm thấy video hợp lệ" and stop.

5. Create today's output folders:

```bash
mkdir -p workspace/content/$(date +%Y-%m-%d)/{transcripts,images}
```

### Phase 2: Download thumbnails & extract transcripts (parallel)

Spawn **parallel sub-agents** (max 5 concurrent) — one `general-purpose` sub-agent per video with this prompt:

```
Process this YouTube video: download thumbnail and extract transcript.

**Video:** <title>
**URL:** <youtube_url>
**Video ID:** <video_id>
**Slug:** <slug>
**Thumbnail URL:** <thumbnail_url>
**Date folder:** <YYYY-MM-DD>

Slug convention: title → lowercase, bỏ dấu tiếng Việt, thay khoảng trắng và ký tự đặc biệt bằng `-`, bỏ `--` thừa, giới hạn 80 ký tự.

Step 1: Download thumbnail
Run: curl -sL "<thumbnail_url>" -o "workspace/content/<YYYY-MM-DD>/images/<slug>.jpg"

Step 2: Extract transcript
Run: uv run .claude/skills/youtube-transcript/scripts/get_transcript.py "<youtube_url>"

If transcript extraction succeeds, save it to: workspace/content/<YYYY-MM-DD>/transcripts/<slug>.txt

Return JSON result:
{
  "status": "success" or "partial" or "skip",
  "video_id": "<video_id>",
  "slug": "<slug>",
  "title": "<title>",
  "thumbnail_saved": true/false,
  "transcript_saved": true/false,
  "reason": "<if partial or skip>"
}
```

Rules:
- Spawn all sub-agents in a **single message** (parallel tool calls)
- Max 5 concurrent — batch if more videos
- Each sub-agent is independent
- If one fails, others continue

### Phase 3: Extract insights from transcripts (parallel)

Spawn **parallel sub-agents** (max 5 concurrent) — one `general-purpose` sub-agent per video that has a successful transcript.

First, read the insight types reference:
```
.claude/skills/insight-extractor/references/insight-types.md
```

Then spawn sub-agents with this prompt:

```
Extract insights from this YouTube video transcript using the 5-type framework.

**Video:** <title>
**Video ID:** <video_id>
**Slug:** <slug>
**Transcript path:** workspace/content/<YYYY-MM-DD>/transcripts/<slug>.txt

## Insight Types

1. **Framework** — Repeatable, teachable system (step-by-step process)
2. **Paradigm Shift** — Mental model flip, belief change
3. **Warning** — Mistake to avoid, costly trap
4. **Diagnosis** — Root cause behind a symptom
5. **Principle** — Universal truth, timeless rule

## Instructions

1. Read the transcript file
2. Identify the content type (tutorial, opinion, cautionary, mixed)
3. Extract up to 10 insights matching the 5 types
4. Write a summary under 200 words: What is it about? Who is it for? 2-3 biggest takeaways
5. Skip filler, intros, CTAs, sponsor segments — substance only
6. Write in Vietnamese if transcript is Vietnamese, English if English

## Return JSON

{
  "video_id": "<video_id>",
  "summary": "Under 200 words summary...",
  "insights": [
    {
      "type": "Framework|Paradigm Shift|Warning|Diagnosis|Principle",
      "title": "One-liner title",
      "explanation": "1-2 sentence explanation"
    }
  ]
}
```

Rules:
- Spawn all sub-agents in a **single message** (parallel tool calls)
- Max 5 concurrent — batch if more videos
- Only spawn for videos with successful transcripts
- If extraction fails, return `{"video_id": "<id>", "summary": null, "insights": []}`

### Phase 4: Save videos.json & output report

After all processing complete, create `workspace/content/<YYYY-MM-DD>/videos.json` with this structure:

```json
{
  "date": "YYYY-MM-DD",
  "total": 3,
  "videos": [
    {
      "video_id": "abc123",
      "slug": "video-title",
      "title": "Video Title",
      "url": "https://www.youtube.com/watch?v=abc123",
      "channel": "Channel Name",
      "views": 1234,
      "published_at": "2026-03-06T12:00:00Z",
      "image": "images/video-title.jpg",
      "transcript": "transcripts/video-title.txt",
      "summary": "Under 200 words summary of the video content...",
      "insights": [
        {
          "type": "Framework",
          "title": "The 3-step content system",
          "explanation": "First extract ideas from calls, then batch produce, finally distribute across channels."
        }
      ],
      "notion_page_id": null,
      "notion_url": null
    }
  ]
}
```

Notes:
- `image` and `transcript` paths are relative to the date folder
- `notion_page_id` and `notion_url` are initially `null`, updated in Phase 5 after Notion push
- If transcript failed, set `"transcript": null`, `"summary": null`, `"insights": []`
- `type` must be one of: `Framework`, `Paradigm Shift`, `Warning`, `Diagnosis`, `Principle`

### Phase 5: Push to Notion

Use the `notion-video-trend-sync` skill to save all videos to Notion database.

**Database:** 🎬 YouTube Videos
**Data Source ID:** `31bab9e5-e740-80c1-9176-000b44bf2aed`

For each video:

1. **Format insights** as bullet list:
   ```
   • Framework: Title — Explanation
   • Warning: Title — Explanation
   ```

2. **Create Notion pages** — call `notion-create-pages` with batch of all videos:

```json
{
  "parent": {
    "data_source_id": "31bab9e5-e740-80c1-9176-000b44bf2aed"
  },
  "pages": [
    {
      "properties": {
        "Name": "Video Title",
        "Link": "https://www.youtube.com/watch?v=VIDEO_ID",
        "Views": 125000,
        "Summary": "Under 200 words summary...",
        "Insight": "• Framework: Title — Explanation\n• Warning: Title — Explanation",
        "Status": "Ngân hàng",
        "date:Date:start": "2026-03-06",
        "date:Date:is_datetime": 0
      }
    }
  ]
}
```

Rules:
- Batch all videos into a single `notion-create-pages` call (max 100)
- Set `Status` to `Ngân hàng` by default
- Set `Date` to video's `published_at` date

### Phase 6: Output report

Output a markdown summary table:

```
## Video phân tích — YYYY-MM-DD

| # | Video | Kênh | Views | Insights | Notion |
|---|-------|------|-------|----------|--------|
| 1 | [Title](url) | Channel | 1,234 | 3 insights | ✅ |

**Folder:** workspace/content/YYYY-MM-DD/
**Tổng:** X video, Y transcript, Z insights, W saved to Notion
```
