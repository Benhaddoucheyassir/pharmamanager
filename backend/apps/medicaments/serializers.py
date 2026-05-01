from rest_framework import serializers
from .models import Medicament
from apps.categories.serializers import CategoryListSerializer

class MedicamentSerializer(serializers.ModelSerializer):
    category_detail = CategoryListSerializer(source="category", read_only=True)
    is_low_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = Medicament
        fields = [
            "id", "name", "description", "category", "category_detail",
            "price", "stock_quantity", "expiry_date", "is_active",
            "is_low_stock", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "is_active", "created_at", "updated_at"]
        extra_kwargs = {"category": {"write_only": True}}

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than zero.")
        return value

    def validate_stock_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError("Stock quantity cannot be negative.")
        return value

class MedicamentListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicament
        fields = ["id", "name", "price"]