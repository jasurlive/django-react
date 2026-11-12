# CASE: polling. the site records visits, the Telegram bot (bot/visitor.py) asks for new ones
#   POST /api/visits/        the frontend, once per browser session (public)
#   POST /api/visits/claim/  the bot: returns unsent visits and marks them sent (needs X-Bot-Key)
from django.db import transaction
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from .models import Visit
from .permissions import HasBotKey
from .serializers import VisitSerializer


class VisitThrottle(AnonRateThrottle):
    rate = "30/hour"  # stops one client from filling the table


def client_ip(request):
    # behind a proxy (nginx, Render, ...) the real IP is the first one in X-Forwarded-For
    forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
    return forwarded.split(",")[0].strip() if forwarded else request.META.get("REMOTE_ADDR")


@api_view(["POST"])
@throttle_classes([VisitThrottle])
def record_visit(request):
    serializer = VisitSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save(ip=client_ip(request), user_agent=request.headers.get("User-Agent", "")[:300])
    return Response(status=status.HTTP_201_CREATED)


@api_view(["POST"])  # POST, not GET: it changes data (marks visits as sent)
@permission_classes([HasBotKey])
def claim_visits(request):
    with transaction.atomic():  # read + mark together, so two bots never send the same visit
        visits = list(Visit.objects.select_for_update().filter(notified=False).order_by("created")[:20])
        Visit.objects.filter(id__in=[v.id for v in visits]).update(notified=True)
    return Response(VisitSerializer(visits, many=True).data)
