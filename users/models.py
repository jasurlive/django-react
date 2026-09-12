from django.db import models

# Create your models here.

class Users(models.Model):
    username = models.CharField(max_length=15)
    password = models.CharField(max_length=4)
    firstname = models.CharField(max_length=15)
    surname = models.CharField(max_length=15)
    age = models.IntegerField()
    is_manager = models.BooleanField(default=False)

    def __str__(self):
        return self.username
 