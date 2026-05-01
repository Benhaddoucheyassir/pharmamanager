from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse
from .models import Medicament
from .serializers import MedicamentSerializer
from .services import MedicamentService

@extend_schema(tags=["Medicaments"])
class MedicamentViewSet(ViewSet):

    @extend_schema(summary="List all active medicaments", responses={200: MedicamentSerializer(many=True)})
    def list(self, request):
        return Response(MedicamentSerializer(MedicamentService.get_active_medicaments(), many=True).data)

    @extend_schema(summary="Create a medicament", request=MedicamentSerializer,
        responses={201: MedicamentSerializer, 400: OpenApiResponse(description="Validation error")},
        examples=[OpenApiExample("Example", value={"name": "Amoxicillin 500mg", "category": 1, "price": "12.50", "stock_quantity": 200}, request_only=True)])
    def create(self, request):
        serializer = MedicamentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        medicament = MedicamentService.create_medicament(serializer.validated_data)
        return Response(MedicamentSerializer(medicament).data, status=status.HTTP_201_CREATED)

    @extend_schema(summary="Retrieve a medicament", responses={200: MedicamentSerializer})
    def retrieve(self, request, pk=None):
        try:
            medicament = MedicamentService.get_medicament_by_id(pk)
        except Medicament.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(MedicamentSerializer(medicament).data)

    @extend_schema(summary="Update a medicament", request=MedicamentSerializer, responses={200: MedicamentSerializer})
    def update(self, request, pk=None):
        try:
            medicament = MedicamentService.get_medicament_by_id(pk)
        except Medicament.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = MedicamentSerializer(medicament, data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(MedicamentSerializer(MedicamentService.update_medicament(medicament, serializer.validated_data)).data)

    @extend_schema(summary="Partially update a medicament", request=MedicamentSerializer, responses={200: MedicamentSerializer})
    def partial_update(self, request, pk=None):
        try:
            medicament = MedicamentService.get_medicament_by_id(pk)
        except Medicament.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = MedicamentSerializer(medicament, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(MedicamentSerializer(MedicamentService.update_medicament(medicament, serializer.validated_data)).data)

    @extend_schema(summary="Soft-delete a medicament", responses={204: OpenApiResponse(description="Deleted")})
    def destroy(self, request, pk=None):
        try:
            medicament = MedicamentService.get_medicament_by_id(pk)
        except Medicament.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        MedicamentService.soft_delete_medicament(medicament)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(summary="List low-stock medicaments", responses={200: MedicamentSerializer(many=True)})
    @action(detail=False, methods=["get"], url_path="low-stock")
    def low_stock(self, request):
        return Response(MedicamentSerializer(MedicamentService.get_low_stock_medicaments(), many=True).data)