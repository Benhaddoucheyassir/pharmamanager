from django.db import transaction
from apps.medicaments.models import Medicament
from .models import Sale

class SaleService:

    @staticmethod
    def get_all_sales():
        return Sale.objects.select_related("medicament__category").all()

    @staticmethod
    def get_sale_by_id(sale_id):
        return Sale.objects.select_related("medicament").get(pk=sale_id)

    @staticmethod
    @transaction.atomic
    def create_sale(medicament, quantity):
        unit_price_at_sale = medicament.price
        total_price = unit_price_at_sale * quantity
        medicament.deduct_stock(quantity)
        return Sale.objects.create(
            medicament=medicament,
            quantity=quantity,
            unit_price_at_sale=unit_price_at_sale,
            total_price=total_price,
        )

    @staticmethod
    @transaction.atomic
    def cancel_sale(sale):
        sale.cancel()
        sale.medicament.restore_stock(sale.quantity)
        return sale