from django.conf import settings
from django.contrib import admin
from django.urls import include, path
from django.views.generic import RedirectView

# every app mounts under /api/ -> add: path("api/", include("apps.<name>.urls"))
urlpatterns = [
    path("", RedirectView.as_view(url=settings.FRONTEND_URL)),
    path("admin/", admin.site.urls),
    path("api/", include("apps.users.urls")),
    path("api/", include("apps.blog.urls")),
    path("api/", include("apps.reports.urls")),
    path("api/", include("apps.feedback.urls")),
    path("api/", include("apps.dashboard.urls")),
    path("api/", include("apps.visitors.urls")),
]
