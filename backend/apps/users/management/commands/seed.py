import os

from django.contrib.auth.hashers import make_password
from django.core.management.base import BaseCommand, CommandError

from apps.users.models import Users


class Command(BaseCommand):
    help = "Create the admin user from ADMIN_USERNAME / ADMIN_PASSWORD"

    def handle(self, *args, **options):
        username = os.getenv("ADMIN_USERNAME")
        password = os.getenv("ADMIN_PASSWORD")
        if not username or not password:
            raise CommandError("ADMIN_USERNAME and ADMIN_PASSWORD are required.")

        _, created = Users.objects.get_or_create(
            username=username,
            defaults={
                "password": make_password(password),
                "firstname": "Admin",
                "surname": "",
                "age": 0,
                "is_manager": True,
            },
        )
        self.stdout.write(f"Admin '{username}' {'created' if created else 'already exists'}.")
