# Backend (Django + DRF)

```
backend/
├── manage.py
├── config/          settings.py, urls.py  (project level, no business code)
└── apps/            one folder per app: models, serializers, views, urls, admin
    ├── users/       CRUD with a ModelViewSet, `seed` command
    ├── blog/        relations, nested data, custom actions, fixtures, tests
    ├── reports/     generic views, search, ordering, pagination
    ├── feedback/    function views, validation, rate limiting, tests
    ├── dashboard/   no models: numbers aggregated from the other apps
    └── visitors/    site visits, custom permission, polled by the Telegram bot
```

## Run

```bash
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                                 # set SECRET_KEY
python manage.py migrate
python manage.py loaddata blog_demo                  # optional: demo posts, tags, comments
python manage.py runserver                           # http://localhost:8000
python manage.py test apps                           # run the tests
```

## Example apps: learn by reading

Each app shows one common way to build things in Django + DRF. Every file has short comments on what it does and why. Read them in this order:

| App | Endpoints | What it teaches | Look at |
| --- | --- | --- | --- |
| `users` | `/api/users/` | the shortest full CRUD: `ModelViewSet` + router. Password hashed and never returned (`write_only`). A custom `manage.py` command | `views.py`, `serializers.py`, `management/commands/seed.py` |
| `blog` | `/api/posts/`, `/api/tags/` | relations: `ForeignKey`, `ManyToManyField`, `related_name`, `on_delete`. `TextChoices`. Nested serializers (detail shows comments). Filters from the URL (`?status=`, `?tag=`). Faster queries with `select_related` / `prefetch_related` / `annotate`. Custom endpoints with `@action`. Admin with inline comments. Fixture data. API tests | `models.py`, `views.py`, `serializers.py`, `admin.py`, `tests.py` |
| `reports` | `/api/reports/` | the other style of class views: `generics.ListCreateAPIView` + `RetrieveUpdateDestroyAPIView` with plain `path()` URLs. Built-in `?search=`, `?ordering=`, `?page=`. `DecimalField` for money | `views.py`, `urls.py` |
| `feedback` | `/api/feedback/`, `/api/feedback/stats/` | function views with `@api_view`. Validation: model validators, `validate_<field>`, `validate()` for several fields. Rate limit (6th post in a minute gets 429). Read-only admin fields, `list_editable` | `serializers.py`, `views.py`, `tests.py` |
| `visitors` | `/api/visits/`, `/api/visits/claim/` | a custom permission (`permissions.py`: secret header `X-Bot-Key`). Values set by the server, not the browser (`read_only_fields`, real IP behind a proxy). `transaction.atomic` + `select_for_update` so each visit is handed out once. Polled by `bot/visitor.py`, see [bot/README.md](../bot/README.md#visitor-alerts-visitorpy) | `views.py`, `permissions.py`, `tests.py` |
| `dashboard` | `/api/dashboard/` | an app with no models: `APIView` that reads other apps and returns totals with `aggregate()` and `values().annotate()` (GROUP BY) | `views.py` |

Try them in the browser: DRF shows a form for every endpoint, e.g. http://localhost:8000/api/posts/ or http://localhost:8000/api/posts/1/ (with comments).

Useful requests:

```
GET  /api/posts/?status=published&tag=django
POST /api/posts/3/publish/
POST /api/posts/1/comments/          {"name": "Ann", "body": "Nice"}
GET  /api/reports/?search=march&ordering=-amount&page=2
POST /api/feedback/                  {"email": "a@b.uz", "rating": 5, "message": "Works great!"}
GET  /api/dashboard/
```

### Which view style should I use?

- **`ModelViewSet` + router** (`users`, `blog`): standard CRUD for a model. Least code. Start here.
- **`generics.*` + `path()`** (`reports`): when you only need some of the operations, or want URLs spelled out.
- **`@api_view` function** (`feedback`): one-off endpoints that aren't CRUD (send a message, run an action).
- **`APIView`** (`dashboard`): custom responses that don't map to one model.

## Create a new app (example: `notes`)

### 1. Generate it inside `apps/`

```bash
mkdir apps/notes
python manage.py startapp notes apps/notes
```

### 2. Fix the app name

`apps/notes/apps.py`

```python
from django.apps import AppConfig


class NotesConfig(AppConfig):
    name = "apps.notes"
```

### 3. Register it

`config/settings.py`

```python
INSTALLED_APPS = [
    ...
    ...
    "apps.notes",
]
```

### 4. Model

`apps/notes/models.py`

```python
from django.db import models


class Note(models.Model):
    title = models.CharField(max_length=100)
    body = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
```

### 5. Serializer

`apps/notes/serializers.py`

```python
from rest_framework import serializers

from .models import Note


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = "__all__"
```

### 6. View

`apps/notes/views.py`

```python
from rest_framework import viewsets

from .models import Note
from .serializers import NoteSerializer


class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
```

### 7. URLs

`apps/notes/urls.py` (new file)

```python
from rest_framework.routers import DefaultRouter

from .views import NoteViewSet

router = DefaultRouter()
router.register("notes", NoteViewSet)

urlpatterns = router.urls
```

`config/urls.py`

```python
urlpatterns = [
    ...
    path("api/", include("apps.users.urls")),
    path("api/", include("apps.notes.urls")),
]
```

### 8. Admin (optional)

`apps/notes/admin.py`

```python
from django.contrib import admin

from .models import Note

admin.site.register(Note)
```

### 9. Migrate

```bash
python manage.py makemigrations notes
python manage.py migrate
```

Done: `GET/POST /api/notes/`, `GET/PUT/PATCH/DELETE /api/notes/<id>/`.

## Rules to keep it simple

- One app = one concern (`users`, `blog`, `orders`). Don't create an app per model: `blog` holds Post, Tag and Comment together.
- Apps never live at the backend root, always `apps/<name>`.
- `config/` only holds project wiring. No models or views there.
- Every app mounts under `/api/` in `config/urls.py`.
- Never `fields = "__all__"` for models with secrets. Use `write_only` (see `apps/users/serializers.py`).

## Common errors

**`no such table: ...`** -> you forgot to migrate:

```bash
python manage.py makemigrations && python manage.py migrate
```

**`ModuleNotFoundError: No module named 'notes'`** -> `apps.py` still says `name = "notes"`. Change it to `"apps.notes"`.

**Model changed and migration is stuck** (dev only, this deletes data):

```bash
rm db.sqlite3
rm apps/<name>/migrations/0*.py
python manage.py makemigrations && python manage.py migrate
```

**Frontend gets a CORS error** -> add its URL to `CORS_ALLOWED_ORIGINS` in `.env`, restart the server.

## Database

SQLite by default. Set `PGHOST`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` in `.env` to use Postgres (e.g. Neon).

## Reference links

- startapp: https://docs.djangoproject.com/en/stable/ref/django-admin/#startapp
- Models: https://docs.djangoproject.com/en/stable/topics/db/models/
- Migrations: https://docs.djangoproject.com/en/stable/topics/migrations/
- DRF serializers: https://www.django-rest-framework.org/api-guide/serializers/
- DRF viewsets and routers: https://www.django-rest-framework.org/api-guide/viewsets/
- django-cors-headers: https://github.com/adamchainz/django-cors-headers