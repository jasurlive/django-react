from .models import Users
from rest_framework import serializers


class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = "__all__"

    def validate_username(self, value):
        if Users.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value