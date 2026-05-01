from django.conf import settings
from .models import Medicament

class MedicamentService:

    @staticmethod
    def get_active_medicaments():
        return Medicament.objects.filter(is_active=True).select_related("category")

    @staticmethod
    def get_medicament_by_id(medicament_id):
        return Medicament.objects.get(pk=medicament_id, is_active=True)

    @staticmethod
    def create_medicament(validated_data):
        return Medicament.objects.create(**validated_data)

    @staticmethod
    def update_medicament(medicament, validated_data):
        for field, value in validated_data.items():
            setattr(medicament, field, value)
        medicament.save()
        return medicament

    @staticmethod
    def soft_delete_medicament(medicament):
        medicament.soft_delete()

    @staticmethod
    def get_low_stock_medicaments():
        threshold = getattr(settings, "LOW_STOCK_THRESHOLD", 10)
        return (
            Medicament.objects.filter(is_active=True, stock_quantity__lte=threshold)
            .select_related("category")
            .order_by("stock_quantity")
        )