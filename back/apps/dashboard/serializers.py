from rest_framework import serializers

from .models import Dashboard


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dashboard
        fields = "__all__"