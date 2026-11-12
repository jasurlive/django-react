# CASE: a custom permission. only the bot (which knows BOT_API_KEY) may read visits
import hmac

from django.conf import settings
from rest_framework.permissions import BasePermission


class HasBotKey(BasePermission):
    def has_permission(self, request, view):
        key = request.headers.get("X-Bot-Key", "")
        # compare_digest: constant-time compare, doesn't leak the key through timing
        return bool(settings.BOT_API_KEY) and hmac.compare_digest(key, settings.BOT_API_KEY)
