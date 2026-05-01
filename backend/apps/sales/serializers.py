from rest_framework import serializers
from .models import Sale
from apps.medicaments.serializers import MedicamentListSerializer

class SaleSerializer(serializers.ModelSerializer):
    medicament_detail = MedicamentListSerializer(source="medicament", read_only=True)

    class Meta:
        model = Sale
        fields = [
            "id", "medicament", "medicament_detail", "quantity",
            "unit_price_at_sale", "total_price", "status",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "unit_price_at_sale", "total_price", "status", "created_at", "updated_at"]
        extra_kwargs = {"medicament": {"write_only": True}}

class SaleCreateSerializer(serializers.Serializer):
    medicament_id = serializers.IntegerField(min_value=1)
    quantity = serializers.IntegerField(min_value=1)