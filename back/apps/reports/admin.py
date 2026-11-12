from django.contrib import admin

from .models import Report


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ["title", "category", "amount", "created"]
    list_filter = ["category"]
    search_fields = ["title"]
