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
Restart=always
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

## License

MIT
