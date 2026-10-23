from django.contrib.auth.hashers import make_password
from rest_framework import serializers

from .models import Users


class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = "__all__"
        extra_kwargs = {"password": {"write_only": True}}

    def validate_password(self, value):
        return make_password(value)
