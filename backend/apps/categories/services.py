from .models import Category

class CategoryService:

    @staticmethod
    def get_active_categories():
        return Category.objects.filter(is_active=True)

    @staticmethod
    def get_category_by_id(category_id):
        return Category.objects.get(pk=category_id, is_active=True)

    @staticmethod
    def create_category(validated_data):
        return Category.objects.create(**validated_data)

    @staticmethod
    def update_category(category, validated_data):
        for field, value in validated_data.items():
            setattr(category, field, value)
        category.save()
        return category

    @staticmethod
    def soft_delete_category(category):
        category.soft_delete()