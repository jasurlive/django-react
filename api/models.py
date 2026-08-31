from django.db import models

# Create your models here.

class User(models.Model):
    username = models.CharField(max_length=15)
    is_active = models.BooleanField(default=False)

    def __str__(self):
        return self.username

# # __str__() tells Django how to display a User object as readable text, so instead of showing something like User object (1) in the Django admin, dropdowns, and str(user), it shows the username.

# def __str__(self):
#     return self.username

# It is not required for the model to work; it is mainly for readability.