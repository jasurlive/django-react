# CASE: function views + rate limiting
#   POST /api/feedback/   {"email": "...", "rating": 1-5, "message": "..."}
#   GET  /api/feedback/stats/
from django.db.models import Avg, Count
from rest_framework import status
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from .models import Feedback
from .serializers import FeedbackSerializer


class FeedbackThrottle(AnonRateThrottle):
    rate = "5/min"  # per IP; the 6th request in a minute gets 429 Too Many Requests


# function view: simplest option for one-off endpoints that don't map to CRUD
@api_view(["POST"])
@throttle_classes([FeedbackThrottle])
def send_feedback(request):
    serializer = FeedbackSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    serializer.save()
    return Response({"message": "Thanks for your feedback!"}, status=status.HTTP_201_CREATED)


@api_view(["GET"])
def feedback_stats(request):
    stats = Feedback.objects.aggregate(count=Count("id"), average=Avg("rating"))
    stats["average"] = round(stats["average"] or 0, 1)
    return Response(stats)
