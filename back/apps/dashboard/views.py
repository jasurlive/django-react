# CASE: an app with no models of its own. it reads other apps and returns numbers
#   GET /api/dashboard/
from django.db.models import Count, Sum
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.blog.models import Post
from apps.feedback.models import Feedback
from apps.reports.models import Report
from apps.users.models import Users


class DashboardView(APIView):  # APIView: you write get/post yourself, no serializer needed
    def get(self, request):
        # aggregate() -> one dict for the whole table
        totals = Report.objects.aggregate(total=Sum("amount"))
        # values().annotate() -> GROUP BY: [{"status": "draft", "count": 2}, ...]
        posts_by_status = Post.objects.values("status").annotate(count=Count("id")).order_by("status")

        return Response({
            "users": Users.objects.count(),
            "posts": {row["status"]: row["count"] for row in posts_by_status},
            "reports_total": totals["total"] or 0,
            "unread_feedback": Feedback.objects.filter(is_read=False).count(),
            "latest_posts": list(Post.objects.values("id", "title")[:5]),
        })
