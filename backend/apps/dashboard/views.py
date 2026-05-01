from django.utils import timezone
from django.db.models import Count, Sum
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema
from apps.sales.models import Sale
from apps.medicaments.services import MedicamentService
from apps.medicaments.serializers import MedicamentSerializer

@extend_schema(tags=["Dashboard"])
class DashboardView(APIView):

    @extend_schema(summary="Get KPIs and low-stock alerts")
    def get(self, request):
        today = timezone.now().date()
        aggregates = Sale.objects.filter(
            created_at__date=today, status=Sale.STATUS_ACTIVE
        ).aggregate(total_sales=Count("id"), total_revenue=Sum("total_price"))

        low_stock = MedicamentService.get_low_stock_medicaments()

        return Response({
            "total_sales_today": aggregates["total_sales"] or 0,
            "total_revenue_today": str(aggregates["total_revenue"] or "0.00"),
            "low_stock_count": low_stock.count(),
            "low_stock_medicaments": MedicamentSerializer(low_stock, many=True).data,
        })