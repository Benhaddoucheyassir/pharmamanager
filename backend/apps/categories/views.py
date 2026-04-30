from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse
from .models import Category
from .serializers import CategorySerializer
from .services import CategoryService

@extend_schema(tags=["Categories"])
class CategoryViewSet(ViewSet):

    @extend_schema(summary="List all active categories", responses={200: CategorySerializer(many=True)})
    def list(self, request):
        categories = CategoryService.get_active_categories()
        return Response(CategorySerializer(categories, many=True).data)

    @extend_schema(summary="Create a category", request=CategorySerializer,
        responses={201: CategorySerializer, 400: OpenApiResponse(description="Validation error")},
        examples=[OpenApiExample("Example", value={"name": "Antibiotics", "description": "..."}, request_only=True)])
    def create(self, request):
        serializer = CategorySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        category = CategoryService.create_category(serializer.validated_data)
        return Response(CategorySerializer(category).data, status=status.HTTP_201_CREATED)

    @extend_schema(summary="Retrieve a category", responses={200: CategorySerializer, 404: OpenApiResponse(description="Not found")})
    def retrieve(self, request, pk=None):
        try:
            category = CategoryService.get_category_by_id(pk)
        except Category.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(CategorySerializer(category).data)

    @extend_schema(summary="Update a category", request=CategorySerializer, responses={200: CategorySerializer})
    def update(self, request, pk=None):
        try:
            category = CategoryService.get_category_by_id(pk)
        except Category.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = CategorySerializer(category, data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        updated = CategoryService.update_category(category, serializer.validated_data)
        return Response(CategorySerializer(updated).data)

    @extend_schema(summary="Partially update a category", request=CategorySerializer, responses={200: CategorySerializer})
    def partial_update(self, request, pk=None):
        try:
            category = CategoryService.get_category_by_id(pk)
        except Category.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = CategorySerializer(category, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        updated = CategoryService.update_category(category, serializer.validated_data)
        return Response(CategorySerializer(updated).data)

    @extend_schema(summary="Soft-delete a category", responses={204: OpenApiResponse(description="Deleted")})
    def destroy(self, request, pk=None):
        try:
            category = CategoryService.get_category_by_id(pk)
        except Category.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        CategoryService.soft_delete_category(category)
        return Response(status=status.HTTP_204_NO_CONTENT)