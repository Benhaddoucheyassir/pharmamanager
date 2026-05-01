from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse
from apps.medicaments.models import Medicament
from .models import Sale
from .serializers import SaleSerializer, SaleCreateSerializer
from .services import SaleService

@extend_schema(tags=["Sales"])
class SaleViewSet(ViewSet):

    @extend_schema(summary="List all sales", responses={200: SaleSerializer(many=True)})
    def list(self, request):
        return Response(SaleSerializer(SaleService.get_all_sales(), many=True).data)

    @extend_schema(summary="Create a sale — snapshots price and deducts stock atomically",
        request=SaleCreateSerializer,
        responses={201: SaleSerializer, 400: OpenApiResponse(description="Insufficient stock or bad input")},
        examples=[OpenApiExample("Example", value={"medicament_id": 1, "quantity": 3}, request_only=True)])
    def create(self, request):
        serializer = SaleCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            medicament = Medicament.objects.get(pk=serializer.validated_data["medicament_id"], is_active=True)
        except Medicament.DoesNotExist:
            return Response({"detail": "Medicament not found."}, status=status.HTTP_404_NOT_FOUND)
        try:
            sale = SaleService.create_sale(medicament, serializer.validated_data["quantity"])
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(SaleSerializer(sale).data, status=status.HTTP_201_CREATED)

    @extend_schema(summary="Retrieve a sale", responses={200: SaleSerializer})
    def retrieve(self, request, pk=None):
        try:
            sale = SaleService.get_sale_by_id(pk)
        except Sale.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(SaleSerializer(sale).data)

    @extend_schema(summary="Cancel a sale and restore stock",
        responses={200: SaleSerializer, 400: OpenApiResponse(description="Already cancelled")})
    @action(detail=True, methods=["post"], url_path="cancel")
    def cancel(self, request, pk=None):
        try:
            sale = SaleService.get_sale_by_id(pk)
        except Sale.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        try:
            cancelled = SaleService.cancel_sale(sale)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(SaleSerializer(cancelled).data)