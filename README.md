# django-react

Django REST backend + React/Vite frontend.

```
backend/            Django project
  config/           settings, root urls
  apps/<name>/      one folder per Django app
frontend/           React + TypeScript + Vite
```

## Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                                 # set SECRET_KEY
python manage.py migrate
python manage.py seed                                # optional: admin user from .env
python manage.py runserver                           # http://localhost:8000
```

API: `/api/users/` · Admin: `/admin/`

## Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev                                          # http://localhost:1212
```

## Add a Django app

```bash
cd backend
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
