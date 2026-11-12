# CASE: a customised admin (columns, filters, search, inline children)
from django.contrib import admin

from .models import Comment, Post, Tag


class CommentInline(admin.TabularInline):  # edit comments on the post page
    model = Comment
    extra = 0


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ["title", "status", "author", "created"]
    list_filter = ["status", "tags"]
    search_fields = ["title", "body"]
    filter_horizontal = ["tags"]
    inlines = [CommentInline]


admin.site.register(Tag)
admin.site.register(Comment)
