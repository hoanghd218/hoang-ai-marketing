# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "requests",
#     "python-dotenv",
# ]
# ///
"""
Get your Telegram Chat ID.

Steps:
1. Open Telegram and send any message to your bot
2. Run this script: uv run .claude/skills/telegram-notifier/scripts/get_chat_id.py

The script will display your Chat ID and optionally save it to .env
"""

import os
import sys
import requests
from dotenv import load_dotenv, set_key

# Load .env from project root
env_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', '.env')
env_path = os.path.abspath(env_path)
load_dotenv(env_path)

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

if not BOT_TOKEN:
    print("❌ TELEGRAM_BOT_TOKEN not found in .env")
    sys.exit(1)

print(f"🔍 Checking bot updates...")
url = f"https://api.telegram.org/bot{BOT_TOKEN}/getUpdates"

try:
    resp = requests.get(url, timeout=10)
    data = resp.json()

    if not data.get("ok"):
        print(f"❌ API error: {data.get('description', 'Unknown error')}")
        sys.exit(1)

    results = data.get("result", [])
    if not results:
        print("⚠️  No messages found. Please send a message to your bot first!")
        print(f"   Open Telegram → search for your bot → send 'hello'")
        sys.exit(1)

    # Get unique chat IDs
    chats = {}
    for update in results:
        msg = update.get("message", {})
        chat = msg.get("chat", {})
        chat_id = chat.get("id")
        if chat_id:
            name = chat.get("first_name", "") + " " + chat.get("last_name", "")
            username = chat.get("username", "")
            chats[chat_id] = {"name": name.strip(), "username": username}

    print(f"\n✅ Found {len(chats)} chat(s):\n")
    for cid, info in chats.items():
        print(f"  Chat ID: {cid}")
        print(f"  Name:    {info['name']}")
        if info['username']:
            print(f"  User:    @{info['username']}")
        print()

    # Auto-save the first chat ID to .env
    first_id = str(list(chats.keys())[0])
    save = input(f"💾 Save Chat ID {first_id} to .env? [Y/n]: ").strip().lower()
    if save in ("", "y", "yes"):
        set_key(env_path, "TELEGRAM_CHAT_ID", first_id)
        print(f"✅ Saved TELEGRAM_CHAT_ID={first_id} to {env_path}")
    else:
        print(f"ℹ️  Add manually: TELEGRAM_CHAT_ID={first_id}")

except requests.exceptions.RequestException as e:
    print(f"❌ Connection error: {e}")
    sys.exit(1)
