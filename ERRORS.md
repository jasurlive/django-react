# Errors might happen, so lets tackle them here:

# OperationalError at /users/user/

```
no such table: users_users
```

The error means Django knows about your User model but the SQLite database does not yet have the users_users table, so run these commands from your project root:

```
python manage.py makemigrations users
python manage.py migrate
```

Then restart your Django server and open /users/user/ again; also make sure 'users' is in INSTALLED_APPS.

## 2nd error

It is impossible to add a non-nullable field 'password' to users without specifying a default. This is because the database needs something to populate existing rows.
Please select a fix:

1) Provide a one-off default now (will be set on all existing rows with a null value for this column)
2) Quit and manually define a default value in models.py.
   Select an option:

if you dont need old data from database select 2

If you only want to remove the existing rows from the users_users table while keeping the SQLite database and migrations intact, run:

python manage.py shell

then:

from users.models import Users
Users.objects.all().delete()

Then verify:

Users.objects.count()

## do specifically to avoid any crashes if you add smth to models

(dont forget to delete old migrations folder, and also database)

python manage.py makemigrations users

python manage.py migrate users

## creating seeder to add a sample user data using .env data

create them manually as empty files: users/management/__init__.py and users/management/commands/__init__.py; they simply tell Python/Django to treat those directories as packages, and VS Code can create them with New File → __init__.py.
