---
name: telegram-notifier
description: Send messages, photos, and files to Telegram via Bot API. USE WHEN user says 'gửi telegram', 'send telegram', 'thông báo telegram', 'notify telegram', 'gửi tin nhắn telegram', 'báo cho tôi qua telegram', 'telegram notification', 'push to telegram', 'gửi file telegram', 'gửi ảnh telegram', or when a task completes and user wants notification. Also use after completing daily summaries, research reports, or any task where the user wants results delivered to Telegram.
---

# Telegram Notifier

Send messages, photos, and files to Hoang's personal Telegram chat via Bot API.

## Setup

Required environment variables in `.env`:
- `TELEGRAM_BOT_TOKEN` — Bot token from @BotFather
- `TELEGRAM_CHAT_ID` — Your personal chat ID

If `TELEGRAM_CHAT_ID` is missing, run the helper script first:
```bash
uv run .claude/skills/telegram-notifier/scripts/get_chat_id.py
```

## Usage

### Send text message
```bash
uv run .claude/skills/telegram-notifier/scripts/send_telegram.py "Your message here"
```

### Send with Markdown formatting
```bash
uv run .claude/skills/telegram-notifier/scripts/send_telegram.py "**Bold** and _italic_" --markdown
```

### Send with HTML formatting
```bash
uv run .claude/skills/telegram-notifier/scripts/send_telegram.py "<b>Bold</b> and <i>italic</i>" --html
```

### Send a photo with caption
```bash
uv run .claude/skills/telegram-notifier/scripts/send_telegram.py --photo path/to/image.png --caption "Description"
```

### Send a file/document
```bash
uv run .claude/skills/telegram-notifier/scripts/send_telegram.py --file path/to/report.pdf --caption "Daily report"
```

### Pipe content from stdin
```bash
echo "Hello" | uv run .claude/skills/telegram-notifier/scripts/send_telegram.py --stdin
```

## Common Patterns

### After completing a task
When a task finishes (research, content creation, etc.), send a summary:
```bash
uv run .claude/skills/telegram-notifier/scripts/send_telegram.py "✅ Task hoàn thành: [task name]. Kết quả: [brief summary]"
```

### Daily summary
Format the day's work as a structured message:
```bash
uv run .claude/skills/telegram-notifier/scripts/send_telegram.py "📊 Daily Summary $(date +%d/%m/%Y)

✅ Completed:
- Task 1
- Task 2

📌 Pending:
- Task 3

📈 Key metrics:
- Videos researched: X
- Scripts created: Y" --html
```

### Send generated files
After creating content (scripts, reports, images), send the file directly:
```bash
uv run .claude/skills/telegram-notifier/scripts/send_telegram.py --file workspace/content/script.md --caption "New video script ready for review"
```

## Message Length Limit

Telegram messages have a 4096 character limit. For longer content, either split into multiple messages or send as a file attachment.

## Error Handling

The script exits with code 1 on any error and prints a descriptive message. Common issues:
- Missing TELEGRAM_BOT_TOKEN → check .env
- Missing TELEGRAM_CHAT_ID → run get_chat_id.py
- Connection timeout → check internet connection
- 400 Bad Request with MarkdownV2 → escape special characters: `_*[]()~>#+=|{}.!-`
