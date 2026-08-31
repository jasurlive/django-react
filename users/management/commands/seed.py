import os

from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password

from users.models import Users


class Command(BaseCommand):
    def handle(self, *args, **options):
        username = os.getenv("ADMIN_USERNAME")
        password = os.getenv("ADMIN_PASSWORD")

        if not username or not password:
            self.stderr.write("ADMIN_USERNAME and ADMIN_PASSWORD are required.")
            return

        user, created = Users.objects.get_or_create(
            username=username,
            defaults={
                "password": make_password(password),
                "is_active": True,
            },
        )

        if created:
            self.stdout.write(self.style.SUCCESS(f"Admin '{username}' created."))
        else:
            self.stdout.write(f"Admin '{username}' already exists.")