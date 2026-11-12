from django.db import models


class Report(models.Model):  # model names are singular: Report, not Reports
    class Category(models.TextChoices):
        SALES = "sales", "Sales"
        COSTS = "costs", "Costs"
        OTHER = "other", "Other"

    title = models.CharField(max_length=100)
    body = models.TextField(blank=True)
    category = models.CharField(max_length=10, choices=Category.choices, default=Category.OTHER)
    # money: DecimalField, never FloatField (floats round: 0.1 + 0.2 != 0.3)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created"]

    def __str__(self):
        return self.title
