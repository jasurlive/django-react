# run: python manage.py test apps.visitors
from django.core.cache import cache
from django.test import override_settings
from rest_framework.test import APITestCase

from .models import Visit


@override_settings(BOT_API_KEY="secret")
class VisitApiTests(APITestCase):
    def setUp(self):
        cache.clear()

    def test_record_visit_saves_ip_from_server(self):
        res = self.client.post("/api/visits/", {"path": "/users", "ip": "1.2.3.4"}, REMOTE_ADDR="5.6.7.8")
        self.assertEqual(res.status_code, 201)
        self.assertEqual(Visit.objects.get().ip, "5.6.7.8")  # browser can't fake it

    def test_claim_needs_key(self):
        self.assertEqual(self.client.post("/api/visits/claim/").status_code, 403)
        self.assertEqual(self.client.post("/api/visits/claim/", HTTP_X_BOT_KEY="wrong").status_code, 403)

    def test_claim_returns_each_visit_once(self):
        Visit.objects.create(path="/")
        first = self.client.post("/api/visits/claim/", HTTP_X_BOT_KEY="secret")
        second = self.client.post("/api/visits/claim/", HTTP_X_BOT_KEY="secret")
        self.assertEqual(len(first.data), 1)
        self.assertEqual(second.data, [])
