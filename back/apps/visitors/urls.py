from django.urls import path

from .views import claim_visits, record_visit

urlpatterns = [
    path("visits/", record_visit),
    path("visits/claim/", claim_visits),
]
