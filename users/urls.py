from django.urls import include, path
from rest_framework.routers import DefaultRouter
from . views import UsersViewSet

router = DefaultRouter()
router.register("new", UsersViewSet)

urlpatterns = [
    path("", include(router.urls)),
]