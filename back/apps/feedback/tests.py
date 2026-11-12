# run: python manage.py test apps.feedback
from django.core.cache import cache
from rest_framework.test import APITestCase


class FeedbackApiTests(APITestCase):
    def setUp(self):
        cache.clear()  # the rate limit counts requests in the cache; start each test at 0

    def test_send(self):
        res = self.client.post("/api/feedback/", {"email": "a@b.uz", "rating": 5, "message": "Works great, thanks!"})
        self.assertEqual(res.status_code, 201)

    def test_rejects_short_message(self):
        res = self.client.post("/api/feedback/", {"email": "a@b.uz", "rating": 5, "message": "ok"})
        self.assertEqual(res.status_code, 400)
        self.assertIn("message", res.data)

    def test_rejects_rating_out_of_range(self):
        res = self.client.post("/api/feedback/", {"email": "a@b.uz", "rating": 9, "message": "Works great, thanks!"})
        self.assertEqual(res.status_code, 400)
        self.assertIn("rating", res.data)

    def test_low_rating_needs_more_detail(self):
        res = self.client.post("/api/feedback/", {"email": "a@b.uz", "rating": 1, "message": "Not good at all"})
        self.assertEqual(res.status_code, 400)
        self.assertIn("non_field_errors", res.data)
