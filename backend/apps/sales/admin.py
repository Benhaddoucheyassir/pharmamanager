from django.contrib import admin
from .models import Sale

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ["id", "medicament", "quantity", "unit_price_at_sale", "total_price", "status", "created_at"]
    list_filter = ["status"]
    readonly_fields = ["unit_price_at_sale", "total_price", "created_at", "updated_at"]