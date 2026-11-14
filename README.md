<p align="center">
  <img
    src="https://github.com/user-attachments/assets/0b0aba2d-e723-4a27-88c8-137e76af6977"
    alt="Django React Full-Stack Banner"
    width="70%"
  />
</p>

# django-react

Ready to build Fullstack Template
Django REST backend + React/Vite frontend.

<img width="60%" alt="image" src="https://github.com/user-attachments/assets/e626e48c-04ab-4bb2-ada0-0588dc80a63b" />
<img width="30%" alt="image" src="https://github.com/user-attachments/assets/10a0311f-abca-4eb4-ab02-32677037fb40" />


```
back/            Django project
  config/           settings, root urls
  apps/<name>/      one folder per Django app (users, blog, reports, feedback, dashboard, visitors)
front/           React + TypeScript + Vite
bot/             Telegram bot (python-telegram-bot) + visitor alerts
```

## Backend

```bash
cd back
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                                 # set SECRET_KEY
python manage.py migrate
python manage.py seed                                # optional: admin user from .env
python manage.py loaddata blog_demo                  # optional: demo blog posts
python manage.py runserver                           # http://localhost:8000
```

API: `/api/users/`, `/api/posts/`, `/api/tags/`, `/api/reports/`, `/api/feedback/`, `/api/dashboard/`, `/api/visits/` · Admin: `/admin/`

The backend apps are worked examples of common Django patterns, see [back/README.md](back/README.md#example-apps-learn-by-reading).

## Frontend

```bash
cd front
npm install
cp .env.example .env
npm run dev                                          # http://localhost:1212
```

## Telegram bot

```bash
cd bot
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env                                 # set BOT_TOKEN, ADMIN_ID, BOT_API_KEY
python bot.py                                        # the bot itself
python visitor.py                                    # optional: website visits -> your Telegram
```

See [bot/README.md](bot/README.md#visitor-alerts-visitorpy) for visitor alerts.

## Add a Django app

```bash
cd back
mkdir apps/blog && python manage.py startapp blog apps/blog
```

1. In `apps/blog/apps.py` set `name = "apps.blog"`
2. Add `"apps.blog"` to `INSTALLED_APPS` in `config/settings.py`
3. Add `path("api/", include("apps.blog.urls"))` to `config/urls.py`

## Model changed and something crashed?

```bash
rm db.sqlite3 && python manage.py makemigrations && python manage.py migrate
```

## License

MIT
