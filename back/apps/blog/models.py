# CASE: relations between models
#   Post -> Users     ForeignKey   (many posts, one author)
#   Post <-> Tag      ManyToMany   (a post has many tags, a tag has many posts)
#   Comment -> Post   ForeignKey   (post.comments gives all comments of a post)
from django.db import models


class Tag(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.name


class Post(models.Model):
    # choices: stored value + label shown in admin; use Post.Status.PUBLISHED in code
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"

    title = models.CharField(max_length=200)
    body = models.TextField()
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.DRAFT)
    # SET_NULL: deleting a user keeps their posts (author becomes empty)
    # "users.Users" as a string: no import needed, avoids circular imports
    author = models.ForeignKey("users.Users", on_delete=models.SET_NULL, null=True, blank=True, related_name="posts")
    tags = models.ManyToManyField(Tag, blank=True, related_name="posts")
    created = models.DateTimeField(auto_now_add=True)  # set once on create
    updated = models.DateTimeField(auto_now=True)  # set on every save

    class Meta:
        ordering = ["-created"]  # newest first by default

    def __str__(self):
        return self.title


class Comment(models.Model):
    # CASCADE: deleting a post deletes its comments
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    name = models.CharField(max_length=50)
    body = models.TextField()
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created"]

    def __str__(self):
        return f"{self.name} on {self.post}"
