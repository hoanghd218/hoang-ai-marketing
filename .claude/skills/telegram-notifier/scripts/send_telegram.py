# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "requests",
#     "python-dotenv",
# ]
# ///
"""
Send messages to Telegram via Bot API.

Usage:
  # Send text message
  uv run .claude/skills/telegram-notifier/scripts/send_telegram.py "Hello from Claude!"

  # Send with Markdown formatting
  uv run .claude/skills/telegram-notifier/scripts/send_telegram.py "**Bold** and _italic_" --markdown

  # Send a photo with caption
  uv run .claude/skills/telegram-notifier/scripts/send_telegram.py --photo path/to/image.png --caption "Check this out"

  # Send a file/document
  uv run .claude/skills/telegram-notifier/scripts/send_telegram.py --file path/to/report.pdf --caption "Daily report"

  # Send to a specific chat (override .env)
  uv run .claude/skills/telegram-notifier/scripts/send_telegram.py "Hello" --chat-id 123456789

  # Read message from stdin (pipe)
  echo "Hello" | uv run .claude/skills/telegram-notifier/scripts/send_telegram.py --stdin
"""

import argparse
import os
import sys
import json
import requests
from dotenv import load_dotenv

# Load .env from project root
env_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', '.env')
env_path = os.path.abspath(env_path)
load_dotenv(env_path)

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
DEFAULT_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

BASE_URL = f"https://api.telegram.org/bot{BOT_TOKEN}"


def send_message(chat_id: str, text: str, parse_mode: str = None) -> dict:
    """Send a text message."""
    payload = {"chat_id": chat_id, "text": text}
    if parse_mode:
        payload["parse_mode"] = parse_mode
    resp = requests.post(f"{BASE_URL}/sendMessage", json=payload, timeout=30)
    return resp.json()


def send_photo(chat_id: str, photo_path: str, caption: str = None, parse_mode: str = None) -> dict:
    """Send a photo with optional caption."""
    data = {"chat_id": chat_id}
    if caption:
        data["caption"] = caption
    if parse_mode:
        data["parse_mode"] = parse_mode
    with open(photo_path, "rb") as f:
        resp = requests.post(f"{BASE_URL}/sendPhoto", data=data, files={"photo": f}, timeout=60)
    return resp.json()


def send_document(chat_id: str, file_path: str, caption: str = None, parse_mode: str = None) -> dict:
    """Send a document/file."""
    data = {"chat_id": chat_id}
    if caption:
        data["caption"] = caption
    if parse_mode:
        data["parse_mode"] = parse_mode
    with open(file_path, "rb") as f:
        resp = requests.post(f"{BASE_URL}/sendDocument", data=data, files={"document": f}, timeout=120)
    return resp.json()


def main():
    parser = argparse.ArgumentParser(description="Send messages to Telegram")
    parser.add_argument("message", nargs="?", help="Text message to send")
    parser.add_argument("--markdown", action="store_true", help="Parse message as MarkdownV2")
    parser.add_argument("--html", action="store_true", help="Parse message as HTML")
    parser.add_argument("--photo", help="Path to photo file to send")
    parser.add_argument("--file", help="Path to document/file to send")
    parser.add_argument("--caption", help="Caption for photo or file")
    parser.add_argument("--chat-id", help="Override chat ID from .env")
    parser.add_argument("--stdin", action="store_true", help="Read message from stdin")
    parser.add_argument("--silent", action="store_true", help="Send silently (no notification)")

    args = parser.parse_args()

    if not BOT_TOKEN:
        print("❌ TELEGRAM_BOT_TOKEN not found in .env")
        sys.exit(1)

    chat_id = args.chat_id or DEFAULT_CHAT_ID
    if not chat_id:
        print("❌ TELEGRAM_CHAT_ID not found. Run get_chat_id.py first.")
        sys.exit(1)

    parse_mode = None
    if args.markdown:
        parse_mode = "MarkdownV2"
    elif args.html:
        parse_mode = "HTML"

    try:
        # Send photo
        if args.photo:
            if not os.path.exists(args.photo):
                print(f"❌ Photo not found: {args.photo}")
                sys.exit(1)
            result = send_photo(chat_id, args.photo, args.caption, parse_mode)

        # Send document
        elif args.file:
            if not os.path.exists(args.file):
                print(f"❌ File not found: {args.file}")
                sys.exit(1)
            result = send_document(chat_id, args.file, args.caption, parse_mode)

        # Send text
        else:
            text = None
            if args.stdin:
                text = sys.stdin.read().strip()
            elif args.message:
                text = args.message
            else:
                print("❌ Provide a message, --photo, or --file")
                parser.print_help()
                sys.exit(1)

            if not text:
                print("❌ Empty message")
                sys.exit(1)

            result = send_message(chat_id, text, parse_mode)

        # Check result
        if result.get("ok"):
            msg_id = result["result"]["message_id"]
            print(f"✅ Sent! Message ID: {msg_id}")
        else:
            print(f"❌ Failed: {result.get('description', 'Unknown error')}")
            sys.exit(1)

    except requests.exceptions.RequestException as e:
        print(f"❌ Connection error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
