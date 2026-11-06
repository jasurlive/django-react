from rest_framework import serializers

from .models import Reports


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reports
        fields = "__all__"