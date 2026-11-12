from django.contrib import admin

from .models import Feedback


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ["email", "rating", "is_read", "created"]
    list_filter = ["is_read", "rating"]
    list_editable = ["is_read"]  # tick "read" straight from the list
    readonly_fields = ["email", "rating", "message", "created"]  # staff can't edit what users sent
