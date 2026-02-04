---
name: youtube-subtitle-extractor
description: Extract subtitles and transcripts from YouTube videos given a URL. Use when working with YouTube video content, generating captions, extracting text for LLM analysis, content repurposing, or creating SRT files for video editing.
---

# YouTube Subtitle Extractor

Extract subtitles/transcripts from YouTube videos in multiple formats.

## Quick Start

Run the extraction script:

```bash
python3 scripts/extract_subtitles.py "<youtube_url>" [options]
```

### Options

| Flag | Description |
|------|-------------|
| `--format`, `-f` | Output format: `text`, `srt`, `json` (default: text) |
| `--lang`, `-l` | Preferred language code (e.g., `en`, `vi`) |
| `--translate-to`, `-t` | Translate to target language |
| `--output`, `-o` | Save to file instead of stdout |

### Examples

```bash
# Plain text (for LLM analysis)
python3 scripts/extract_subtitles.py "https://youtu.be/VIDEO_ID"

# SRT format (for video editors)
python3 scripts/extract_subtitles.py "https://youtu.be/VIDEO_ID" -f srt -o subtitles.srt

# JSON format (for data processing)
python3 scripts/extract_subtitles.py "https://youtu.be/VIDEO_ID" -f json

# Vietnamese transcript
python3 scripts/extract_subtitles.py "https://youtu.be/VIDEO_ID" -l vi

# Translate to Vietnamese
python3 scripts/extract_subtitles.py "https://youtu.be/VIDEO_ID" --translate-to vi
```

## Supported URL Formats

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- Direct video ID

## Output Formats

| Format | Use Case |
|--------|----------|
| **text** | LLM analysis, content repurposing |
| **srt** | Video editing, subtitling |
| **json** | Data processing, custom applications |

## Requirements

```bash
pip3 install youtube-transcript-api
```

## Limitations

- Requires video to have captions enabled (manual or auto-generated)
- Does not work on private or age-restricted videos
- Bulk extraction may trigger rate limiting
