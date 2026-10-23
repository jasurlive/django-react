# Backend (Django + DRF)

```
backend/
├── manage.py
├── config/          settings.py, urls.py  (project level, no business code)
└── apps/
    └── users/       one folder per app: models, serializers, views, urls, admin
```

## Run

```bash
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                                 # set SECRET_KEY
python manage.py migrate
python manage.py runserver                           # http://localhost:8000
```

## Create a new app (example: `posts`)

### 1. Generate it inside `apps/`

```bash
mkdir apps/posts
python manage.py startapp posts apps/posts
```

### 2. Fix the app name

`apps/posts/apps.py`

```python
from django.apps import AppConfig


class PostsConfig(AppConfig):
    name = "apps.posts"
```

### 3. Register it

`config/settings.py`

```python
INSTALLED_APPS = [
    ...
    "apps.users",
    "apps.posts",
]
```

### 4. Model

`apps/posts/models.py`

```python
from django.db import models


class Post(models.Model):
    title = models.CharField(max_length=100)
    body = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
```

### 5. Serializer

`apps/posts/serializers.py`

```python
from rest_framework import serializers

from .models import Post


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = "__all__"
```

### 6. View

`apps/posts/views.py`

```python
from rest_framework import viewsets

from .models import Post
from .serializers import PostSerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
```

### 7. URLs

`apps/posts/urls.py` (new file)

```python
from rest_framework.routers import DefaultRouter

from .views import PostViewSet

router = DefaultRouter()
router.register("posts", PostViewSet)

urlpatterns = router.urls
```

`config/urls.py`

```python
urlpatterns = [
    ...
    path("api/", include("apps.users.urls")),
    path("api/", include("apps.posts.urls")),
]
```

### 8. Admin (optional)

`apps/posts/admin.py`

```python
from django.contrib import admin

from .models import Post

admin.site.register(Post)
```

### 9. Migrate

```bash
python manage.py makemigrations posts
python manage.py migrate
```

Done: `GET/POST /api/posts/`, `GET/PUT/PATCH/DELETE /api/posts/<id>/`.

## Rules to keep it simple

- One app = one concern (`users`, `posts`, `orders`). Don't create an app per model.
- Apps never live at the backend root, always `apps/<name>`.
- `config/` only holds project wiring. No models or views there.
- Every app mounts under `/api/` in `config/urls.py`.
- Never `fields = "__all__"` for models with secrets. Use `write_only` (see `apps/users/serializers.py`).

## Common errors

**`no such table: ...`** -> you forgot to migrate:

```bash
python manage.py makemigrations && python manage.py migrate
```

**`ModuleNotFoundError: No module named 'posts'`** -> `apps.py` still says `name = "posts"`. Change it to `"apps.posts"`.

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