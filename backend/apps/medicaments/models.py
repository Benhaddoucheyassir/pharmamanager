from django.db import models
from django.conf import settings

class Medicament(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, default="")
    category = models.ForeignKey(
        "categories.Category",
        on_delete=models.PROTECT,
        related_name="medicaments",
    )
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.PositiveIntegerField(default=0)
    expiry_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name

    @property
    def is_low_stock(self):
        threshold = getattr(settings, "LOW_STOCK_THRESHOLD", 10)
        return self.stock_quantity <= threshold

    def soft_delete(self):
        self.is_active = False
        self.save(update_fields=["is_active", "updated_at"])

    def deduct_stock(self, quantity):
        if quantity > self.stock_quantity:
            raise ValueError(
                f"Insufficient stock. Requested: {quantity}, Available: {self.stock_quantity}"
            )
        self.stock_quantity -= quantity
        self.save(update_fields=["stock_quantity", "updated_at"])

    def restore_stock(self, quantity):
        self.stock_quantity += quantity
        self.save(update_fields=["stock_quantity", "updated_at"])