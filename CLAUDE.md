# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hoang's AI Marketing content system — a workspace for producing Vietnamese AI & automation content (YouTube, TikTok, Reels). Combines brand voice guidelines, customer personas, 35+ Claude Code skills, Python scripts for API integration, and structured planning workflows. Skills are organized around 5 Content Pillars: P1 AI Demo & Tutorials (40%), P2 One Person Business (25%), P3 AI News & Trends (15%), P4 Mindset & CĐS (10%), P5 Behind-the-scenes (10%).

## Environment Setup

```bash
cp .env.example .env   # then fill in actual API keys
```

Required API keys (see `.env.example`):
- `YOUTUBE_API_KEY` — YouTube Data API v3 (trend search, video metadata)
- `NOTION_API_KEY` + `NOTION_DATABASE_VIDEO_TREND_ID` + `NOTION_DATASOURCE_VIDEO_TREND_ID` — Notion sync
- `XAI_API_KEY` — xAI Grok API for X.com trending posts
- `OPENROUTER_API_KEY` — OpenRouter for LLM calls

No central `package.json` or `requirements.txt`. Each skill manages dependencies independently. Scripts use either `python3` (with `requests`, `python-dotenv`) or `uv run --script` (PEP 723 inline deps).

Python venv for skills: `~/.claude/skills/.venv/bin/python3`

## Running Scripts

YouTube trend search:
```bash
python3 .claude/skills/youtube-trend-finder/scripts/search_trends.py "KEYWORD" --date week --max-results 20 --format json
```

YouTube transcript extraction:
```bash
uv run .claude/skills/youtube-transcript/scripts/get_transcript.py VIDEO_ID_OR_URL [--timestamps]
```

X.com trending posts:
```bash
uv run .claude/skills/x-trending-posts/scripts/search_x_posts.py "TOPIC" --period week --limit 10
```

## Content Production Pipeline

The skills compose into a 6-stage pipeline:

1. **Discover** — `youtube-trend-finder`, `breakout-video-finder`, `x-trending-posts`, `mkt-ai-news-aggregator`
2. **Extract** — `youtube-transcript`, `youtube-subtitle-extractor`
3. **Analyze** — `script-storytelling-analyzer`, `insight-extractor`, `content-format-analyzer`, `mkt-competitor-video-strategy-analyzer`, `mkt-news-to-content-brief`
4. **Create** — `storytelling-script-creator`, `video-script-creator`, `desire-hook`, `mkt-content-repurposer`, `mkt-build-in-public-post-creator`
5. **Distribute** — `video`, `image-post-creator`, `video-to-facebook-posts`
6. **Archive** — `notion-video-trend-sync`, `notebooklm-video-analyzer`, `mkt-content-knowledge-compiler`

## Skill Locations

All skills live in `.claude/skills/`. Key ones by function:

| Skill | Purpose | Output Location |
|-------|---------|-----------------|
| `youtube-trend-finder` | Search trending videos (YouTube API v3) | `research/youtube/trends/[slug]/` |
| `breakout-video-finder` | Find viral videos (2x+ view/sub ratio) | `research/youtube/breakout/[slug]/` |
| `youtube-transcript` | Extract transcripts (dual-method fallback) | stdout or file |
| `storytelling-script-creator` | Full YouTube scripts (6 Callaway techniques) | `workspace/content/` |
| `video-script-creator` | Short-form scripts (TikTok/Reels/Shorts) | `workspace/content/` |
| `notion-video-trend-sync` | Push video data to Notion database | Notion API |
| `x-trending-posts` | Search trending X.com posts via Grok AI | stdout or file |
| `mkt-competitor-video-strategy-analyzer` | Analyze competitor video strategy (title, hook, structure, thumbnail) | `research/youtube/strategy/` |
| `mkt-content-knowledge-compiler` | Compile learnings into persistent knowledge base | `workspace/foundations/knowledge-base/` |
| `mkt-ai-news-aggregator` | Aggregate AI news from Perplexity, GitHub, X.com | `research/ai-news/[date]/` |
| `mkt-news-to-content-brief` | Filter & rank news into content briefs | `workspace/content/news-briefs/` |
| `mkt-content-repurposer` | 1 long-form → 4-5 multi-format content pieces | `workspace/content/repurposed/` |
| `mkt-build-in-public-post-creator` | Build-in-public Facebook posts (5 templates) | stdout |

## Agents

Five agents in `.claude/agents/`:

- **`trend-researcher`** — Orchestrates full YouTube research pipeline: search → parallel transcript extraction (max 5 concurrent) → summarize → push to Notion. Trigger with keyword + date filter.
- **`mcp-finder`** — Discovers and configures MCP servers.
- **`mkt-pillar1-ai-demo-researcher`** — Full Pillar 1 pipeline: fetch AI channel videos → transcript → strategy analysis → insight extraction → knowledge compilation → Notion sync → Telegram notification.
- **`mkt-daily-ai-news-scout`** — Daily Pillar 3 pipeline: aggregate news from 3 sources (Perplexity, GitHub, X.com) → merge → content briefs → Telegram top 3.
- **`mkt-full-short-video-from-transcript`** — End-to-end short video pipeline: script → MP3 voiceover → HeyGen avatar video. Phase 3 runs in isolated sub-agent to manage 40KB context of heygen-short-video skill.

## Workspace Structure

```
workspace/content/     # Published and draft scripts, hooks, calendar
workspace/foundations/  # Core frameworks and research
workspace/journal/      # Session notes and learnings
context/business/       # Company info, offers, client profiles, positioning
context/learning/       # Research and learning materials
research/youtube/       # Generated trend research and transcripts
plans/reports/          # Agent exploration reports
```

## Business Identity

- **Founder**: Hoang — Chuyên gia AI, chia sẻ kiến thức xây dựng AI Agent (Claude.ai, Claude Code, OpenClaw)
- **Positioning**: One Person Business powered by AI — xây dựng đội ngũ bot làm việc 24/7, tạo freedom & dòng tiền thụ động
- **Products**: Khóa học AI Agent, Vibe Coding, phần mềm, AI Agent solutions
- **Community**: AI Freedom Builders — `tranvanhoang.com/aifdc`
- **Default CTA**: Kêu gọi tham gia cộng đồng AI Freedom Builders
- **Vision**: Trở thành YouTuber chuyên chia sẻ kiến thức AI hàng đầu Việt Nam → sau đó chuyển sang vai trò Investor đầu tư vào các cá nhân/startup khởi nghiệp trong lĩnh vực AI, Robotics, AIaaS

### Distribution Channels

| Channel | Role | Goal |
|---------|------|------|
| **YouTube** | Nền tảng chính — video dài chia sẻ kiến thức chuyên sâu | 50K subs |
| **Facebook** | Lan tỏa nhanh — content tách từ video YouTube | 300K followers |
| **TikTok** | Lan tỏa nhanh — content tách từ video YouTube | 300K followers |

## Key Content Resources

### Brand Voice (`MY RESOURCES/BRANDVOICE.MD`)
- **Language**: Vietnamese; persona = "Hoang" / "minh", address audience as "ban" / "cac ban"
- **Tone**: Conversational expert, 7/10 energy — confident but not hype
- **Hook patterns**: Data/Shock, One Person Power, Statistic + Counter-intuition, Bold Statement/Myth Busting
- **Content structure**: Hook > Context > But (conflict) > Therefore (solution) > But (new conflict) > Resolution > Last Dab + CTA
- **Core rule**: Write the Last Dab (closing punchline) FIRST, then the hook, then fill the middle
- **Power words (keep in English)**: System, Automation, One Person, AI, Framework, Workflow, No-code, Prompt, Template

### Customer Persona (`MY RESOURCES/WHO10X TECH.MD`)
- **Target**: Vietnamese SME owners, managers, office workers (28-45, TP.HCM/Ha Noi)
- **Core pain**: Repetitive manual tasks, too many tools with no clear roadmap, no programming background
- **Desired outcome**: 70-80% time savings via AI & Automation without needing to code
- **Decision drivers**: Live demos, before/after case studies, ready-to-use templates, proven ROI

## Notion Integration

**🎬 YouTube Videos database** (ID: `31bab9e5e7408006998edd545ae23695`):
- Fields: Name, Link, Views, Thumbnail, Summary, Transcript Link, Insight, Status, Date
- Status options: `Ngân hàng`, `Sử dụng làm content`
- Data source ID: `31bab9e5-e740-80c1-9176-000b44bf2aed`

## Content Language

All content output is Vietnamese. Skill and script technical internals use English. Always apply brand voice guidelines when generating scripts or hooks.
