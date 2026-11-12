# CASE: serializers for related data
from rest_framework import serializers

from .models import Comment, Post, Tag


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["id", "name", "body", "created"]


class PostSerializer(serializers.ModelSerializer):
    # read: author's username instead of the id (source= follows the relation)
    author_name = serializers.CharField(source="author.username", read_only=True, default=None)
    # tags as names ["django", "react"] instead of ids; unknown names are rejected
    tags = serializers.SlugRelatedField(slug_field="name", queryset=Tag.objects.all(), many=True, required=False)
    # computed in the view's queryset with .annotate(), see views.py
    comment_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Post
        fields = ["id", "title", "body", "status", "author", "author_name", "tags", "comment_count", "created", "updated"]
        extra_kwargs = {"author": {"write_only": True}}


class PostDetailSerializer(PostSerializer):
    # nested: the detail page gets the comments inline, the list stays light
    comments = CommentSerializer(many=True, read_only=True)

    class Meta(PostSerializer.Meta):
        fields = PostSerializer.Meta.fields + ["comments"]


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name"]
