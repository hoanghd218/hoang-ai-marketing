# notebooklm-py Library Research Report

**Date**: 2025-02-25
**Library**: notebooklm-py (unofficial Google NotebookLM Python API)
**Repository**: https://github.com/teng-lin/notebooklm-py
**Status**: Active, async-first design, undocumented API (unstable)

---

## 1. Installation

```bash
# Basic installation
pip install notebooklm-py

# With browser login support (REQUIRED for first-time authentication)
pip install "notebooklm-py[browser]"
playwright install chromium
```

**Python Version**: 3.10+ required (3.13–3.14 tested)

---

## 2. Authentication

### Setup Process

1. **Initial Login** (one-time browser-based):
   ```bash
   notebooklm login
   ```
   - Opens browser → user logs into Google account
   - Stores authentication tokens in `~/.notebooklm/storage_state.json`

2. **Programmatic Use** (subsequent calls):
   ```python
   async with await NotebookLMClient.from_storage() as client:
       # Client automatically loads stored tokens
   ```

### Token Details

- **Storage Format**: Playwright storage state JSON (cookies + tokens)
- **Required Cookies**: Google auth cookies (SID, HSID, etc.) from `.google.com` domains
- **CSRF Token**: `SNlM0e` extracted from NotebookLM homepage on each session
- **Session ID**: `FdrFJe` extracted from NotebookLM homepage on each session
- **Auto-Refresh**: Client automatically refreshes tokens if expired during requests

### Authentication Classes

```python
from notebooklm import AuthTokens, NotebookLMClient

# Option 1: Load from stored credentials (recommended)
auth = await AuthTokens.from_storage()
async with NotebookLMClient(auth) as client:
    ...

# Option 2: Provide explicit path
auth = await AuthTokens.from_storage(path="/custom/path/storage_state.json")

# Option 3: Manual token initialization (advanced)
auth = AuthTokens(
    cookies={"SID": "...", "HSID": "..."},
    csrf_token="...",
    session_id="..."
)
```

---

## 3. Creating Notebooks

### Basic Creation

```python
async with await NotebookLMClient.from_storage() as client:
    # Create a new notebook
    notebook = await client.notebooks.create(title="My Research")
    print(notebook.id)  # UUID-format ID
    print(notebook.title)
```

### Notebook Object Structure

| Property | Type | Description |
|----------|------|-------------|
| `id` | str (UUID) | Unique notebook identifier |
| `title` | str | Notebook title |
| `created_at` | datetime | Creation timestamp |
| `source_count` | int | Number of sources added |

### Notebook Operations

| Operation | Method | Returns |
|-----------|--------|---------|
| Create | `create(title)` | `Notebook` |
| List all | `list()` | `list[Notebook]` |
| Get details | `get(notebook_id)` | `Notebook` |
| Rename | `rename(notebook_id, new_title)` | `Notebook` |
| Delete | `delete(notebook_id)` | `bool` |

---

## 4. Adding YouTube URLs as Sources

### Auto-Detection for YouTube

```python
# The library automatically detects YouTube URLs and uses appropriate handler
source = await client.sources.add_url(
    notebook_id=notebook.id,
    url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    wait=True,  # Wait for processing before returning
    wait_timeout=120.0  # Max 120 seconds
)
print(f"Source ID: {source.id}")
print(f"Status: {source.status}")  # READY, PROCESSING, ERROR, etc.
```

### YouTube URL Formats Supported

- Standard: `https://www.youtube.com/watch?v=VIDEO_ID`
- Short: `https://youtu.be/VIDEO_ID`
- Playlist: `https://www.youtube.com/playlist?list=PLAYLIST_ID`
- Channel: `https://www.youtube.com/c/CHANNEL_NAME`

### Source Processing

- **Automatic Detection**: Library extracts video ID and calls YouTube-specific handler
- **Processing Timeout**: Default 120 seconds, customizable via `wait_timeout`
- **Polling Strategy**: Exponential backoff (starts 1s, max 10s, factor 1.5)
- **Status Values**: `PROCESSING`, `READY`, `ERROR`, `PREPARING`

### Non-YouTube URL Sources

```python
# Web pages, PDFs, etc. - same add_url method works
source = await client.sources.add_url(
    notebook_id=notebook.id,
    url="https://en.wikipedia.org/wiki/AI",
    wait=True
)
```

### Other Source Types

| Type | Method | Example |
|------|--------|---------|
| YouTube/Web | `add_url(url, wait=True)` | URLs auto-detected |
| Text/Paste | `add_text(title, content)` | Direct text content |
| PDF/Files | `add_file(file_path)` | Local file upload |
| Google Drive | `add_drive_file(doc_id)` | Docs, Slides, Sheets |

### Batch Source Addition (No Wait)

```python
# Add multiple sources fast, then wait for all at once
sources = []
for url in urls:
    source = await client.sources.add_url(notebook_id, url, wait=False)
    sources.append(source)

# Now wait for all to process
await client.sources.wait_for_sources(
    notebook_id=notebook.id,
    source_ids=[s.id for s in sources],
    timeout=300.0
)
```

---

## 5. Query/Get Summaries and Insights

### Chat-Based Querying

```python
# Ask a question about notebook sources
result = await client.chat.ask(
    notebook_id=notebook.id,
    question="What are the key themes in this video?"
)

print(f"Answer: {result.answer}")
print(f"Conversation ID: {result.conversation_id}")
print(f"Turn Number: {result.turn_number}")
print(f"References: {result.references}")  # List of source citations
```

### Follow-Up Questions (Conversation History)

```python
# Use same conversation_id for follow-ups
result2 = await client.chat.ask(
    notebook_id=notebook.id,
    question="Can you elaborate on that?",
    conversation_id=result.conversation_id  # Continue same conversation
)
```

### Get Notebook Summary/Description

```python
# Get AI-generated description + suggested topics
description = await client.notebooks.get_description(notebook_id=notebook.id)

print(f"Summary: {description.summary}")
print(f"Suggested Topics: {description.suggested_topics}")

# Each topic has:
# - question: str
# - topic_id: str (for further queries)
```

### Query Result Structure

| Property | Type | Description |
|----------|------|-------------|
| `answer` | str | AI-generated answer |
| `conversation_id` | str (UUID) | Conversation thread ID |
| `turn_number` | int | Position in conversation |
| `is_follow_up` | bool | Whether this is follow-up question |
| `references` | list[ChatReference] | Sources cited in answer |

### Query Specific Sources (Optional)

```python
# Query only specific sources instead of all
result = await client.chat.ask(
    notebook_id=notebook.id,
    question="...",
    source_ids=["source-id-1", "source-id-2"]  # Limit to specific sources
)
```

---

## 6. Getting Notebook URL/Link

### Sharing Setup & URL Generation

```python
# Enable public sharing
share_status = await client.sharing.set_public(notebook_id, public=True)

# Get sharing details including URL
print(f"Share URL: {share_status.share_url}")
print(f"Is Public: {share_status.is_public}")
print(f"Access Level: {share_status.access}")  # ANYONE_WITH_LINK or RESTRICTED
```

### Share Status Structure

| Property | Type | Description |
|----------|------|-------------|
| `share_url` | str \| None | Public URL if public=True |
| `is_public` | bool | Whether public sharing enabled |
| `access` | ShareAccess | ANYONE_WITH_LINK or RESTRICTED |
| `view_level` | ShareViewLevel | FULL_NOTEBOOK or CHAT_ONLY |
| `shared_users` | list[ShareUser] | Users with explicit access |

### Sharing Permissions

```python
from notebooklm.types import SharePermission, ShareViewLevel

# Set what viewers can do
await client.sharing.set_view_level(
    notebook_id=notebook.id,
    level=ShareViewLevel.FULL_NOTEBOOK  # or CHAT_ONLY
)

# Share with specific user
await client.sharing.add_user(
    notebook_id=notebook.id,
    email="user@example.com",
    permission=SharePermission.VIEWER,  # VIEWER or EDITOR
    notify=True,
    welcome_message="Check out my research!"
)
```

### URL Format

- **Public URL**: `https://notebooklm.google.com/notebooks/{notebook_id}/...`
- **Direct Access**: Provided in `share_status.share_url` after enabling public sharing

---

## 7. Complete Workflow Example

```python
import asyncio
from notebooklm import NotebookLMClient

async def main():
    async with await NotebookLMClient.from_storage() as client:
        # 1. Create notebook
        nb = await client.notebooks.create("YouTube Research")
        print(f"Created: {nb.title} ({nb.id})")

        # 2. Add YouTube source and wait for processing
        video_url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        source = await client.sources.add_url(
            nb.id, video_url, wait=True
        )
        print(f"Added video source: {source.id} ({source.status})")

        # 3. Get notebook description
        desc = await client.notebooks.get_description(nb.id)
        print(f"Summary: {desc.summary}")
        print(f"Topics: {[t.question for t in desc.suggested_topics]}")

        # 4. Ask questions about the content
        result = await client.chat.ask(
            nb.id,
            "What are the main insights from this video?"
        )
        print(f"Answer: {result.answer}")

        # 5. Follow-up question
        result2 = await client.chat.ask(
            nb.id,
            "How can I apply these insights?",
            conversation_id=result.conversation_id
        )
        print(f"Follow-up: {result2.answer}")

        # 6. Enable sharing and get public URL
        share = await client.sharing.set_public(nb.id, public=True)
        print(f"Public URL: {share.share_url}")

        # 7. List all notebooks
        all_nbs = await client.notebooks.list()
        print(f"Total notebooks: {len(all_nbs)}")

asyncio.run(main())
```

---

## 8. API Overview

### Client Structure (Namespaced Sub-APIs)

```python
async with await NotebookLMClient.from_storage() as client:
    client.notebooks      # Create, list, rename, delete, summarize
    client.sources        # Add, list, delete, refresh sources
    client.chat          # Ask questions, manage conversations
    client.artifacts     # Generate audio/video/quiz/etc.
    client.research      # Web/Drive research agents
    client.notes         # Manage user notes
    client.settings      # Language, preferences
    client.sharing       # Public/private sharing, permissions
```

### Key Features Beyond Web UI

✅ **Batch operations** (add multiple sources, download multiple artifacts)
✅ **Programmatic access** to source fulltext content
✅ **Quiz/Flashcard export** as JSON/Markdown/HTML
✅ **Mind map data extraction** as JSON
✅ **Data table CSV export**
✅ **Full permission management** without web interface

---

## 9. Important Caveats

### ⚠️ Stability Warnings

- **Undocumented APIs**: Uses internal Google RPC endpoints that can change without notice
- **No Official Support**: Not affiliated with Google; community-driven project
- **Rate Limiting**: Heavy usage may be throttled by Google
- **Best For**: Prototypes, research projects, personal automation (NOT production systems)

### Error Handling

```python
from notebooklm.exceptions import (
    SourceAddError,
    SourceTimeoutError,
    ChatError,
    ArtifactNotReadyError
)

try:
    source = await client.sources.add_url(nb_id, url, wait=True)
except SourceTimeoutError as e:
    print(f"Source processing took too long: {e}")
except SourceAddError as e:
    print(f"Failed to add source: {e}")
```

### Session Management

```python
# Always use context manager for proper cleanup
async with await NotebookLMClient.from_storage() as client:
    # Operations here
    pass
# Connection automatically closed on exit

# Or explicit close
client = await NotebookLMClient.from_storage()
await client.__aenter__()
try:
    # Operations
    pass
finally:
    await client.__aexit__(None, None, None)
```

---

## 10. Installation & Quick Start Commands

```bash
# 1. Install with browser support
pip install "notebooklm-py[browser]"
playwright install chromium

# 2. Authenticate (one-time)
notebooklm login

# 3. CLI quick test
notebooklm create "Test Notebook"
notebooklm use <notebook_id>
notebooklm source add "https://www.youtube.com/watch?v=VIDEO_ID"
notebooklm ask "Summarize the video"
notebooklm generate audio --wait
notebooklm download audio ./podcast.mp3
```

---

## Summary

| Aspect | Detail |
|--------|--------|
| **Installation** | `pip install notebooklm-py[browser]` |
| **Auth** | Browser-based one-time login; auto-stored in `~/.notebooklm/` |
| **Create Notebook** | `await client.notebooks.create(title)` |
| **Add YouTube** | `await client.sources.add_url(nb_id, youtube_url, wait=True)` |
| **Query Content** | `await client.chat.ask(nb_id, question)` → `AskResult.answer` |
| **Get Summary** | `await client.notebooks.get_description(nb_id)` |
| **Get URL** | `await client.sharing.set_public(nb_id, True)` → `share_url` |
| **API Style** | Async-first (uses `async`/`await`) |
| **Stability** | Undocumented Google APIs; use for prototypes only |

---

## Unresolved Questions

None at this time. The library is well-documented with clear examples and comprehensive error handling. All six requirements are fully satisfied.
