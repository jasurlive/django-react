# CASE: validation rules in the serializer
from rest_framework import serializers

from .models import Feedback


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ["id", "email", "rating", "message", "created"]

    # validate_<field>: one field at a time
    def validate_message(self, value):
        value = value.strip()
        if len(value) < 10:
            raise serializers.ValidationError("Please write at least 10 characters.")
        return value

    # validate: rules that need several fields together
    def validate(self, data):
        if data["rating"] <= 2 and len(data["message"]) < 30:
            raise serializers.ValidationError("For a low rating, tell us a bit more (30+ characters).")
        return data
