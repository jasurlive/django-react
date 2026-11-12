from django.contrib import admin

from .models import Visit


@admin.register(Visit)
class VisitAdmin(admin.ModelAdmin):
    list_display = ["created", "ip", "path", "language", "notified"]
    list_filter = ["notified", "language"]
    readonly_fields = [f.name for f in Visit._meta.fields]
