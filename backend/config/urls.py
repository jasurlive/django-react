from django.conf import settings
from django.contrib import admin
from django.urls import include, path
from django.views.generic import RedirectView

# every app mounts under /api/ -> add: path("api/", include("apps.<name>.urls"))
urlpatterns = [
    path("", RedirectView.as_view(url=settings.FRONTEND_URL)),
    path("admin/", admin.site.urls),
    path("api/", include("apps.users.urls")),
]
