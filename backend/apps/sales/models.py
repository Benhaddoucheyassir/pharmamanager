from django.db import models

class Sale(models.Model):
    STATUS_ACTIVE = "active"
    STATUS_CANCELLED = "cancelled"
    STATUS_CHOICES = [
        (STATUS_ACTIVE, "Active"),
        (STATUS_CANCELLED, "Cancelled"),
    ]

    medicament = models.ForeignKey(
        "medicaments.Medicament",
        on_delete=models.PROTECT,
        related_name="sales",
    )
    quantity = models.PositiveIntegerField()
    unit_price_at_sale = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_ACTIVE, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Sale #{self.pk} — {self.medicament.name} × {self.quantity}"

    def cancel(self):
        if self.status == self.STATUS_CANCELLED:
            raise ValueError("Sale is already cancelled.")
        self.status = self.STATUS_CANCELLED
        self.save(update_fields=["status", "updated_at"])