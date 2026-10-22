from django.db import models


class Users(models.Model):
    username = models.CharField(max_length=15, unique=True)
    password = models.CharField(max_length=128)  # stores a hash, never plain text
    firstname = models.CharField(max_length=15)
    surname = models.CharField(max_length=15)
    age = models.IntegerField()
    is_manager = models.BooleanField(default=False)

    def __str__(self):
        return self.username
