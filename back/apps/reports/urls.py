# plain path() routes: what a router writes for you, spelled out
from django.urls import path

from .views import ReportDetail, ReportList

urlpatterns = [
    path("reports/", ReportList.as_view()),
    path("reports/<int:pk>/", ReportDetail.as_view()),
]
