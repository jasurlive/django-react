from rest_framework.routers import DefaultRouter

from .views import PostViewSet, TagViewSet

router = DefaultRouter()
# basename is needed because PostViewSet has get_queryset() instead of queryset
router.register("posts", PostViewSet, basename="post")
router.register("tags", TagViewSet)

urlpatterns = router.urls
