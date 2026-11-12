# CASE: API tests. run: python manage.py test apps.blog
from rest_framework.test import APITestCase

from .models import Post, Tag


class PostApiTests(APITestCase):
    def setUp(self):  # runs before each test, on a fresh empty test database
        self.tag = Tag.objects.create(name="django")
        self.post = Post.objects.create(title="Hello", body="First post")
        self.post.tags.add(self.tag)

    def test_list(self):
        res = self.client.get("/api/posts/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data[0]["tags"], ["django"])

    def test_filter_by_status(self):
        res = self.client.get("/api/posts/?status=published")
        self.assertEqual(res.data, [])

    def test_publish_action(self):
        res = self.client.post(f"/api/posts/{self.post.id}/publish/")
        self.assertEqual(res.status_code, 200)
        self.post.refresh_from_db()
        self.assertEqual(self.post.status, Post.Status.PUBLISHED)

    def test_add_comment(self):
        res = self.client.post(f"/api/posts/{self.post.id}/comments/", {"name": "Ann", "body": "Nice"})
        self.assertEqual(res.status_code, 201)
        self.assertEqual(self.post.comments.count(), 1)

    def test_comment_needs_body(self):
        res = self.client.post(f"/api/posts/{self.post.id}/comments/", {"name": "Ann"})
        self.assertEqual(res.status_code, 400)
        self.assertIn("body", res.data)
