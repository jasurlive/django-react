from django.urls import path

from .views import feedback_stats, send_feedback

urlpatterns = [
    path("feedback/", send_feedback),
    path("feedback/stats/", feedback_stats),
]
