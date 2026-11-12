from django.db import models


class Visit(models.Model):
    ip = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=300, blank=True)
    path = models.CharField(max_length=200, blank=True)
    referrer = models.CharField(max_length=300, blank=True)
    language = models.CharField(max_length=20, blank=True)
    timezone = models.CharField(max_length=50, blank=True)
    screen = models.CharField(max_length=20, blank=True)  # e.g. "1920x1080"
    notified = models.BooleanField(default=False)  # True once the bot has sent it to the admin
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created"]

    def __str__(self):
        return f"{self.ip} {self.path} {self.created:%Y-%m-%d %H:%M}"
