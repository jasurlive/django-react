from rest_framework import serializers

from .models import Visit


class VisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visit
        fields = ["id", "ip", "user_agent", "path", "referrer", "language", "timezone", "screen", "created"]
        # filled in by the server from the request, not trusted from the browser
        read_only_fields = ["ip", "user_agent"]
