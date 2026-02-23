# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Hoàng's AI Marketing content system — a workspace for producing Vietnamese AI & automation content (YouTube, TikTok, Reels). It combines brand voice guidelines, customer personas, Claude Code skills, and structured workspaces for content production.

## Skill Locations

There are **two separate skill directories** with different purposes:

- **`.claude/skills/`** — Claude Code skills (invoked via the Skill tool in Claude Code)
- **`.agent/skills/`** — Agent/workflow skills with richer references and scripts (used directly in sessions)

### `.claude/skills/` (Claude Code)
- `breakout-video-finder` — Find YouTube breakout videos (2x+ view/subscriber ratio); 4-phase workflow with approval gates; outputs to `research/youtube/breakout/[slug]/`
- `youtube-trend-finder` — Find trending YouTube videos by keyword + date filter (today/week/month); calls YouTube Data API v3 via `scripts/search_trends.py`; returns title, URL, thumbnail, view count; outputs to `research/youtube/trends/`

### `.agent/skills/` (Agent Framework)
- `storytelling-script-creator` — Full YouTube script production (Title → Intro → Script → CTA) using 6 Callaway storytelling techniques; outputs `.md` file
- `video-script-creator` — Short-form scripts (TikTok/Reels/Shorts) using Before-After, Three Acts, or Action structure; Vietnamese language
- `content-format-analyzer` — Classifies content into 4A framework (Actionable/Analytical/Aspirational/Anthropological) + 220 viral formats
- `script-storytelling-analyzer` — Evaluates script storytelling quality
- `notion-content-sync` — Syncs CSV data (URL, Title, VideoFile, Transcript) to Notion database; requires Notion MCP server
- `desire-hook` — Hook writing using desire/tension frameworks
- `youtube-subtitle-extractor` — Extracts subtitles from YouTube videos via `scripts/extract_subtitles.py`
- `infographic_generator` — Creates infographics
- `brand-guidelines` — Applies brand consistency
- `video` — FFmpeg/Remotion video editing (stitching, captions, transitions, teasers)

## Workspace Structure

```
workspace/
├── content/      # Published and draft content (scripts, hooks, calendar)
├── docs/         # Documentation assets
├── foundations/  # Core frameworks and research
└── journal/      # Session notes and learnings

context/
├── business/     # Company info, offers, client profiles, positioning
└── learning/     # Research and learning materials
```

Content artifacts (scripts, research reports) go into `workspace/content/` by default unless a skill specifies otherwise (e.g., breakout-video-finder → `research/youtube/breakout/[slug]/`).

## Key Content Resources

### Brand Voice (`MY RESOURCES/BRANDVOICE.MD`)
- **Language**: Vietnamese; persona = "Hoàng" / "mình", address audience as "bạn" / "các bạn"
- **Tone**: Conversational expert, 7/10 energy — confident but not hype
- **Hook patterns**: Data/Shock, One Person Power, Statistic + Counter-intuition, Bold Statement/Myth Busting
- **Content structure**: Hook → Context → But (conflict) → Therefore (solution) → But (new conflict) → Resolution → Last Dab + CTA
- **Core rule**: Write the Last Dab (closing punchline) FIRST, then the hook, then fill the middle
- **Rhythm**: Mix short/medium/long sentences; read aloud to check cadence
- **Power words (keep in English)**: System, Automation, One Person, AI, Framework, Workflow, No-code, Prompt, Template

### Customer Persona (`MY RESOURCES/WHO10X TECH.MD`)
- **Target**: Vietnamese SME owners, managers, office workers (28–45, TP.HCM/Hà Nội)
- **Core pain**: Repetitive manual tasks, too many tools with no clear roadmap, no programming background
- **Desired outcome**: 70–80% time savings via AI & Automation without needing to code
- **Decision drivers**: Live demos, before/after case studies, ready-to-use templates, proven ROI

## Notion MCP Integration

The `notion-content-sync` skill requires the Notion MCP server to be configured. Database schema expected:
- `Topic` (title) ← CSV Title
- `Source` (url) ← CSV URL
- `Status` (status) ← Fixed value "Ngân hàng"

Extract Database ID from Notion URL before calling the API (insert dashes into UUID format).

## Content Language

All content output is Vietnamese. Skill and script technical internals use English. Always apply brand voice guidelines when generating scripts or hooks.
