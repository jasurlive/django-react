# sends each website visit to the admin on Telegram
#
# how it works (polling):
#   1. the website tells Django about a visit   -> POST /api/visits/        (front/src/app/main.tsx)
#   2. every few seconds this script asks Django -> POST /api/visits/claim/  (new visits, each only once)
#   3. it sends each one to ADMIN_ID with the Telegram Bot API
#
# run: python visitor.py   (separately from bot.py, both can run at the same time)

import os
import time

import requests
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv("BOT_TOKEN")
ADMIN_ID = os.getenv("ADMIN_ID")
API_URL = os.getenv("API_URL", "http://localhost:8000/api")
BOT_API_KEY = os.getenv("BOT_API_KEY")  # same value as in back/.env
POLL_SECONDS = int(os.getenv("POLL_SECONDS", "10"))


def claim_visits():
    res = requests.post(f"{API_URL}/visits/claim/", headers={"X-Bot-Key": BOT_API_KEY}, timeout=10)
    res.raise_for_status()
    return res.json()


def format_visit(v):
    return (
        "👀 New visitor\n"
        f"Page: {v['path'] or '/'}\n"
        f"IP: {v['ip']}\n"
        f"From: {v['referrer'] or 'direct'}\n"
        f"Language: {v['language']} · Timezone: {v['timezone']}\n"
        f"Screen: {v['screen']}\n"
        f"Browser: {v['user_agent']}\n"
        f"Time: {v['created'][:19].replace('T', ' ')} UTC"
    )


def send_to_admin(text):
    requests.post(
        f"https://api.telegram.org/bot{TOKEN}/sendMessage",
        json={"chat_id": ADMIN_ID, "text": text, "disable_web_page_preview": True},
        timeout=10,
    ).raise_for_status()


def main():
    missing = [name for name in ("BOT_TOKEN", "ADMIN_ID", "BOT_API_KEY") if not os.getenv(name)]
    if missing:
        raise RuntimeError(f"missing in .env: {', '.join(missing)}")

    print(f"Watching {API_URL}/visits/ every {POLL_SECONDS}s. Ctrl+C to stop.")
    while True:
        try:
            for visit in claim_visits():
                send_to_admin(format_visit(visit))
                time.sleep(0.1)  # Telegram allows ~30 messages/second, stay well under
        except requests.RequestException as e:
            # Django down, wrong key (403), Telegram hiccup... log it and try again next round
            print(f"poll failed: {e}")
        time.sleep(POLL_SECONDS)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        pass
