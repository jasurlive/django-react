# CASE: a ViewSet with filtering, query optimisation and custom actions
from django.db.models import Count
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Post, Tag
from .serializers import CommentSerializer, PostDetailSerializer, PostSerializer, TagSerializer


class PostViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        posts = (
            Post.objects
            .select_related("author")  # FK: joins the author in the same query
            .prefetch_related("tags")  # M2M: one extra query for all tags, not one per post
            .annotate(comment_count=Count("comments"))
        )

        # filters from the URL: /api/posts/?status=published&tag=django
        status_ = self.request.query_params.get("status")
        tag = self.request.query_params.get("tag")
        if status_:
            posts = posts.filter(status=status_)
        if tag:
            posts = posts.filter(tags__name=tag)
        return posts

    def get_serializer_class(self):
        # different shape for list vs one item
        return PostDetailSerializer if self.action == "retrieve" else PostSerializer

    # POST /api/posts/<id>/publish/
    @action(detail=True, methods=["post"])
    def publish(self, request, pk=None):
        post = self.get_object()
        post.status = Post.Status.PUBLISHED
        post.save(update_fields=["status", "updated"])
        return Response({"status": post.status})

    # GET  /api/posts/<id>/comments/  -> list
    # POST /api/posts/<id>/comments/  -> add {"name": "...", "body": "..."}
    @action(detail=True, methods=["get", "post"])
    def comments(self, request, pk=None):
        post = get_object_or_404(Post, pk=pk)
        if request.method == "GET":
            return Response(CommentSerializer(post.comments.all(), many=True).data)

        serializer = CommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)  # 400 with field errors if invalid
        serializer.save(post=post)  # extra fields that don't come from the request
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TagViewSet(viewsets.ReadOnlyModelViewSet):  # GET only, no create/update/delete
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
