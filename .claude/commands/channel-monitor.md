---
description: Monitor subscribed channels for today's videos → transcript → summarize → Notion
argument-hint: [topic tag]
allowed-tools: Bash, Read, Write, Glob, Grep, Task, Skill, mcp__claude_ai_Notion__notion-create-pages, mcp__claude_ai_Notion__notion-search
---

# Channel Monitor

Monitor videos published today from subscribed channels, extract transcripts, summarize & extract insights, and push to Notion.

## Config

Channel list: @context/monitored-channels.json

## Workflow

### Phase 1: Search today's videos from all channels

Read the channel list from the config above. Extract all channel IDs into a comma-separated string.

Determine the topic tag:
- If user provided `$ARGUMENTS`, use that as the topic tag
- Otherwise, default to `Chua xem`

Available Topic tags: `OpenClaw`, `Vibe coding`, `Claude code`, `Antigravity`, `Chua xem`

Run search:
```bash
~/.claude/skills/.venv/bin/python3 .claude/skills/youtube-trend-finder/scripts/search_trends.py \
  --channel-ids "ID1,ID2,ID3,..." \
  --date today \
  --order date \
  --max-results 50 \
  --format json
```

Note: no keyword needed — searching by channel + date only.

Parse the JSON output. If no videos found, report "No new videos today" and stop.

### Phase 2: Parallel video processing

Spawn **parallel sub-agents** (max 5 concurrent, batch if more) — one `general-purpose` sub-agent per video with this prompt:

```
Process this YouTube video and push to Notion.

**Video data:**
- Title: <title>
- URL: <youtube_url>
- Video ID: <video_id>
- View count: <view_count>
- Channel: <channel_name>
- Thumbnail: <thumbnail_url>
- Topic tag: <topic_tag>
- Today: <YYYY-MM-DD>

**Step 1: Extract transcript**
Run: uv run .claude/skills/youtube-transcript/scripts/get_transcript.py "<YOUTUBE_URL>"
If fails, return: {"status": "skip", "reason": "transcript failed", "title": "<title>"}

**Step 2: Summarize & extract insights**
From the transcript, generate:
- Summary (3-5 sentences): main topic, key message, frameworks/tools mentioned. Write in English.
- Key Insights (5-10): each with insight + why it matters + how to apply. Write in English.

**Step 3: Push to Notion**
Use Notion MCP `notion-create-pages` with:
- data_source_id: 885a44e0-6843-479c-9b2d-eafdb31720ae
- Properties: Title, Video Link, Views Count, Topic (as "[\"<topic_tag>\"]"), Summary, date:Created At:start (YYYY-MM-DD), date:Created At:is_datetime (0)
- Content body: ## Summary + ## Key Insights + ## Transcript (full text)
Save returned page_id.

**Step 4: Set thumbnail**
Run:
~/.claude/skills/.venv/bin/python3 -c "
from dotenv import load_dotenv
import os, requests
load_dotenv()
page_id = '<PAGE_ID>'
thumb_url = '<THUMBNAIL_URL>'
r = requests.patch(
    f'https://api.notion.com/v1/pages/{page_id}',
    json={'properties': {'Thumbnail': {'files': [{'type': 'external', 'name': 'Thumbnail', 'external': {'url': thumb_url}}]}}},
    headers={'Authorization': f'Bearer {os.getenv(\"NOTION_API_KEY\")}', 'Content-Type': 'application/json', 'Notion-Version': '2022-06-28'}
)
print(f'Thumbnail set: {r.status_code == 200}')
"

**Return result as:** {"status": "success"|"skip", "title": "<title>", "reason": "<if skip>"}
```

Rules:
- Spawn all sub-agents in a **single message** (parallel tool calls)
- Max 5 concurrent — batch if more videos
- Each sub-agent is independent
- If one fails, others continue

### Phase 3: Report

Aggregate all sub-agent results and report:

```
**Channel Monitor Report**
**Date:** YYYY-MM-DD
**Topic:** <topic_tag>
**Channels scanned:** <count>
**Videos found:** <count>
**Transcripts extracted:** <success>/<total>
**Pushed to Notion:** <count>
**Skipped:** <count> (reasons)
**Notion DB:** https://www.notion.so/6fa63945025a4ab8bf276a754bd0ed22
```
