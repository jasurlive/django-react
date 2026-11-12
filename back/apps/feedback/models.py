from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Feedback(models.Model):
    email = models.EmailField()  # format is checked for you
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    message = models.TextField()
    is_read = models.BooleanField(default=False)  # ticked by staff in the admin
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created"]
        verbose_name_plural = "feedback"  # admin would say "feedbacks" otherwise

    def __str__(self):
        return f"{self.rating}/5 from {self.email}"
