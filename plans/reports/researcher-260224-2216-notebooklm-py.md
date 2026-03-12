# Research Report: notebooklm-py

**Date:** 2026-02-24
**Repo:** https://github.com/teng-lin/notebooklm-py
**Version:** 0.3.2 | Stars: 2.2k | License: MIT

---

## Executive Summary

`notebooklm-py` is an unofficial Python SDK + CLI for Google NotebookLM, exposing programmatic access to features that the web UI does not offer (batch downloads, structured exports, programmatic sharing). Built on Google's **undocumented internal batchexecute RPC protocol** — stable for prototyping and automation, but not suitable for production systems with strict SLA requirements. Authentication via Google cookies, stored locally or injected via env var (CI/CD-friendly). Full async Python API + CLI + Claude Code skill integration.

---

## 1. Purpose & Features

### Core Purpose
Automate Google NotebookLM: create notebooks, add sources, chat with AI, generate artifacts (audio, video, quizzes, etc.), and download results — all without the web browser.

### Feature Matrix

| Category | Capabilities |
|---|---|
| **Notebook mgmt** | Create, list, rename, delete, share (public/invite/permissions) |
| **Sources** | URL, YouTube, PDF, Google Drive, local files, pasted text, audio/video/images |
| **Research agents** | Web research, Drive research, auto-import |
| **Chat** | Ask questions, select source subsets, chat history, configure mode |
| **Generate artifacts** | Audio overview (4 formats, 3 lengths, 50+ langs), Video (2 formats, 9 styles), slide decks, quizzes, flashcards, infographics, data tables, mind maps, reports |
| **Download** | Single or batch (`--all`), format conversion (JSON/Markdown/HTML/CSV) |
| **Beyond web UI** | Batch downloads, quiz/flashcard structured export, mind map JSON, source fulltext, programmatic sharing |
| **Claude Code** | Built-in skill install (`notebooklm skill install`) for natural language usage |

---

## 2. Installation

```bash
# Minimal (API + CLI only)
pip install notebooklm-py

# With browser-based login support
pip install "notebooklm-py[browser]"
playwright install chromium
```

**Python:** 3.10–3.14
**Build system:** hatchling

---

## 3. Dependencies

### Runtime (always installed)
| Package | Version | Purpose |
|---|---|---|
| `httpx` | ≥0.27.0 | Async HTTP client for RPC calls |
| `click` | ≥8.0.0 | CLI framework |
| `rich` | ≥13.0.0 | Terminal formatting |

### Optional: `[browser]`
| Package | Version | Purpose |
|---|---|---|
| `playwright` | ≥1.40.0 | Browser automation for `notebooklm login` |

### Dev dependencies (not installed by default)
`pytest`, `pytest-asyncio`, `pytest-httpx`, `pytest-cov`, `mypy`, `ruff`, `vcrpy`, `python-dotenv`

---

## 4. Authentication Setup

### Step 1 — Login (interactive, one-time)
```bash
notebooklm login
# Opens Chromium → sign into Google → cookies saved to ~/.notebooklm/storage_state.json
```

Requires `[browser]` extra + `playwright install chromium`.

### Required Google cookies
`SID`, `HSID`, `SSID`, `APISID`, `SAPISID`, `__Secure-1PSID`, `__Secure-3PSID`

### Auth precedence (highest → lowest)
1. `--storage PATH` flag
2. `NOTEBOOKLM_AUTH_JSON` env var (inline JSON — CI/CD)
3. `$NOTEBOOKLM_HOME/storage_state.json`
4. `~/.notebooklm/storage_state.json` (default)

### CI/CD setup (no browser)
```bash
# Extract cookies from a browser session → store as JSON
export NOTEBOOKLM_AUTH_JSON='{"cookies":[...]}'
```
Sessions expire every 1–2 weeks; must be refreshed manually.

### Multiple accounts
Use separate `NOTEBOOKLM_HOME` dirs or `--storage` flags per account.

---

## 5. Configuration

### Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `NOTEBOOKLM_HOME` | `~/.notebooklm/` | Base dir for all config/auth files |
| `NOTEBOOKLM_AUTH_JSON` | — | Inline auth JSON (CI/CD) |
| `NOTEBOOKLM_LOG_LEVEL` | `WARNING` | Logging verbosity |
| `NOTEBOOKLM_DEBUG_RPC` | — | RPC debug logging |

### Storage layout
```
~/.notebooklm/
├── storage_state.json      # Auth cookies
├── context.json            # Active notebook/conversation
└── browser_profile/        # Chromium user data
```

---

## 6. Usage Examples

### CLI Workflow
```bash
# Authenticate
notebooklm login

# Create notebook and set as active
notebooklm create "AI Research 2026"
notebooklm use <notebook-id>

# Add sources
notebooklm source add "https://example.com/article"
notebooklm source add "https://youtube.com/watch?v=..."
notebooklm source add ./my-document.pdf

# Web research agent
notebooklm source add-research "AI automation 2026" --mode deep --import-all

# Chat
notebooklm ask "What are the key themes?"
notebooklm ask "Compare approaches" -s src1 -s src2   # limit to specific sources

# Generate artifacts (async by default; --wait blocks until done)
notebooklm generate audio "Make it engaging" --format debate --wait
notebooklm generate video --style whiteboard --wait
notebooklm generate quiz --difficulty hard --wait
notebooklm generate mind-map          # synchronous

# Download
notebooklm download audio ./podcast.mp4 --latest
notebooklm download quiz --format markdown ./quiz.md
notebooklm download mind-map ./map.json

# Check status
notebooklm status
```

### Python API (async)
```python
import asyncio
from notebooklm import NotebookLMClient

async def main():
    async with await NotebookLMClient.from_storage() as client:
        # Create notebook
        nb = await client.notebooks.create("Research 2026")

        # Add sources
        src = await client.sources.add_url(nb.id, "https://example.com")
        await client.sources.wait(nb.id, src.id)

        # Chat
        result = await client.chat.ask(nb.id, "Summarize key points")
        print(result.answer)
        # result.references → ChatReference objects with citations

        # Generate audio overview
        task = await client.artifacts.generate_audio(nb.id, description="Focus on insights")
        artifact = await client.artifacts.wait(nb.id, task.id)

        # Source fulltext extraction
        fulltext = await client.sources.get_fulltext(nb.id, src.id)

asyncio.run(main())
```

### Claude Code Skill
```bash
# Install skill into Claude Code
notebooklm skill install

# Then use natural language in Claude Code sessions
# e.g. "Create a notebook about AI trends and add this URL..."
```

---

## 7. NotebookLM Integration Details

### Architecture
```
CLI (click)
    └── Python async client (httpx + asyncio)
            └── RPC layer (Google batchexecute protocol)
                    └── Google NotebookLM internal APIs
```

### RPC Layer
- Uses Google's internal `batchexecute` RPC protocol
- Method IDs in `src/notebooklm/rpc/types.py` are **obfuscated and undocumented**
- Google can change them at any time without notice → library may break silently
- Community-maintained reverse engineering required for updates

### Async design rationale
Google's APIs are slow (artifact generation takes minutes). Full async enables concurrent operations and non-blocking downloads.

### Key API namespaces
- `client.notebooks.*` — Notebook CRUD + sharing
- `client.sources.*` — Source management + fulltext
- `client.chat.*` — Chat, history, configure
- `client.artifacts.*` — Generate, poll, download, export
- `client.research.*` — Research agent control

---

## 8. Limitations & Risks

| Risk | Severity | Notes |
|---|---|---|
| Undocumented APIs | High | Google can break any RPC method silently |
| Session expiry | Medium | Cookies expire every 1–2 weeks; manual refresh needed |
| Rate limiting | Medium | Google may throttle automated requests |
| No Google affiliation | Low | Not an official SDK; no SLA or support |
| Production use | High | Not recommended for production with strict reliability needs |

---

## 9. Resources

- Repo: https://github.com/teng-lin/notebooklm-py
- CLI Reference: https://github.com/teng-lin/notebooklm-py/blob/main/docs/cli-reference.md
- Configuration: https://github.com/teng-lin/notebooklm-py/blob/main/docs/configuration.md
- RPC Reference: https://github.com/teng-lin/notebooklm-py/blob/main/docs/rpc-reference.md
- Troubleshooting: https://github.com/teng-lin/notebooklm-py/blob/main/docs/troubleshooting.md
- PyPI: `pip install notebooklm-py`

---

## Unresolved Questions

1. **Auth refresh automation** — Is there a programmatic way to refresh cookies without browser interaction? (No evidence found in docs)
2. **Rate limits** — Exact rate limit thresholds not documented; behavior under heavy automation unknown
3. **MCP server integration** — The MCP server used in this project (`mcp__notebooklm-mcp__*` tools) appears to wrap `notebooklm-py` — exact mapping between MCP tools and Python API methods not confirmed
4. **Session token format** — `NOTEBOOKLM_AUTH_JSON` exact schema not documented publicly (must be extracted from a live browser session)
5. **v0.3.2 changelog** — What changed from v0.2.0 not fully fetched; releases page not read
