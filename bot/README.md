# Telegram Bot
<img src="https://github.com/user-attachments/assets/d9e40660-97da-444a-a5cf-136db03b84da" width="500" height="auto">

Simple & minimal Telegram bot template using Python, polling, and JSONPlaceholder API.

## Features

- Reply keyboards
- Inline keyboards
- Button callbacks
- User information
- JSONPlaceholder API
- Media handling
- Bot reset
- Announcements
- Website visitor alerts (`visitor.py`)

## Requirements

- Python 3.10+
- Telegram Bot Token

## Installation

```bash
git clone <repository-url>
cd telegram-bot
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Configuration

Create a `.env` file:

```env
BOT_TOKEN=your_bot_token
```

Get your token from [@BotFather](https://t.me/BotFather).

## Run

```bash
python bot.py
```

## Visitor alerts (`visitor.py`)

Sends every website visit to you on Telegram: page, IP, referrer, language, timezone, screen, browser.

```
browser --POST /api/visits/--> Django <--POST /api/visits/claim/ every 10s-- visitor.py --> Telegram (ADMIN_ID)
```

The site reports one visit per browser session (`front/src/lib/trackVisit.ts`). `visitor.py` polls Django, and Django hands out each visit only once.

1. Pick a long random key, e.g. `python -c "import secrets; print(secrets.token_urlsafe(32))"`
2. Put it in **both** `back/.env` and `bot/.env` as `BOT_API_KEY=...`
3. In `bot/.env` also set `ADMIN_ID` (your Telegram user id, ask [@userinfobot](https://t.me/userinfobot)) and `API_URL` (default `http://localhost:8000/api`)
4. Open the bot in Telegram and press Start once (bots can't message you first)
5. Run Django, then:

```bash
python visitor.py
```

It runs separately from `bot.py`; run both if you want both. A visit is marked as sent when it's handed to the bot, so if Telegram is down at that moment, that visit is skipped (check `/admin/` > Visits).

Visitor IPs are personal data: tell your users in a privacy note, and delete old visits from time to time.

## API (you can use your own api calls)

[JSONPlaceholder](https://jsonplaceholder.typicode.com/users)

## setup the bot on linux as service

sudo nano /etc/systemd/system/telegrambot.service (!)

```
[Unit]
Description=telegram bot (or any shit name to recognize it later on)
After=network.target

[Service]
WorkingDirectory=/home/YOURUSERNAME/bot
ExecStart=/home/YOURUSERNAME/bot/.venv/bin/python main.py

Restart=always
Environment="BOT_TOKEN=your_token"
Environment="ADMIN_ID=your_id"

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable telegrambot
sudo systemctl start telegrambot
```

you'll also need to run these commands if you make any changes

For visitor alerts make a second service the same way with `ExecStart=.../.venv/bin/python visitor.py` (it reads `bot/.env` from `WorkingDirectory`).

## License

MIT
