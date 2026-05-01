from django.contrib import admin
from .models import Medicament

@admin.register(Medicament)
class MedicamentAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "category", "price", "stock_quantity", "is_low_stock", "is_active"]
    list_filter = ["is_active", "category"]
    search_fields = ["name"]
    readonly_fields = ["created_at", "updated_at"]