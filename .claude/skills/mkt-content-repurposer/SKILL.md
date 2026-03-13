---
name: mkt-content-repurposer
description: Transform one long-form content piece (video transcript, book chapter, article) into 4-5 multi-format content pieces — Facebook posts, wisdom posts, short video scripts, reels. USE WHEN user says 'repurpose content', 'tách content', 'chuyển video thành nhiều content', 'repurpose transcript', '1 video thành nhiều bài', 'content repurpose', 'nhân bản content'.
---

# Content Repurposer

## Purpose
Force multiplier: take 1 long-form piece and produce 4-5 content pieces across different formats. Each piece is standalone and optimized for its platform.

## Input
- Video transcript (from `youtube-transcript` skill)
- Book excerpt or chapter
- Article text
- Expert content / podcast transcript

## Process

### Step 1: Extract standalone insights
Read the full source content and extract 5-8 standalone insights. Each insight must:
- Be understandable WITHOUT the full context
- Have a clear takeaway or action item
- Be interesting enough to stand alone as a post

### Step 2: Classify each insight
For each insight, determine the best content format:

| Insight Type | Best Format | Skill Format Reference |
|-------------|------------|------------------------|
| Quotable wisdom, pithy truth | Wisdom image post | `mkt-book-to-wisdom-posts` format |
| Actionable how-to, step-by-step | Facebook actionable post | `video-to-facebook-posts` format |
| Visual concept, demo-able | Short video script (60s) | `mkt-create-script-short-video` format |
| Emotional, inspirational | Reels text overlay (8s) | `mkt-create-video-reels-text-overlay` format |

### Step 3: Generate all outputs
For each insight, generate the content piece following the format rules of the target skill:

**For Wisdom Posts** (mkt-book-to-wisdom-posts format):
- 6 formats: Progressive Reduction, Never Too Late List, Contrast Pairs, Numbered Skills, Intangible Assets, Bold Statement
- Caption + image text layout

**For Facebook Posts** (video-to-facebook-posts format):
- 300-600 words, no emoji, line breaks for mobile
- Hook > Value > CTA + Last Dab
- Brand voice applied

**For Short Video Scripts** (mkt-create-script-short-video format):
- 60s max, Vietnamese conversational tone
- Before-After / Three Acts / Action structure
- Show result immediately, no intros

**For Reels Text Overlay** (mkt-create-video-reels-text-overlay format):
- Max 8 seconds
- Short, punchy Vietnamese text
- Mood/topic tags for video/music matching

### Step 4: Compile content pack
Bundle all generated pieces into a single file.

## Output
Master file at `workspace/content/repurposed/[slug]-content-pack.md`:

```markdown
# Content Pack: [Source Title]
**Source**: [URL or book name]
**Date**: [YYYY-MM-DD]
**Total pieces generated**: [N]

---

## Piece 1: [Format] — [Insight Title]
[Generated content]

---

## Piece 2: [Format] — [Insight Title]
[Generated content]

...
```

## Rules
1. **Each piece must stand alone** — no references to "the video" or "as I mentioned"
2. **Apply brand voice** — read `MY RESOURCES/BRANDVOICE.MD` before generating
3. **Vietnamese with full diacritics** — all output in Vietnamese, power words in English
4. **No emoji** — following brand guidelines
5. **Minimum 4 pieces** — if fewer than 4 insights are extractable, the source may not be suitable
6. **Diverse formats** — aim for at least 2 different format types per pack
