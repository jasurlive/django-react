# CASE: generic class views + search, ordering and pagination (all built into DRF)
#   GET /api/reports/?search=march&ordering=-amount&page=2
from rest_framework import filters, generics
from rest_framework.pagination import PageNumberPagination

from .models import Report
from .serializers import ReportSerializer


class ReportPagination(PageNumberPagination):
    page_size = 10  # response becomes {count, next, previous, results: [...]}
    page_size_query_param = "page_size"  # client may ask ?page_size=50
    max_page_size = 100


# generics = a ViewSet split in two: one view for the list, one for a single item
class ReportList(generics.ListCreateAPIView):  # GET list, POST create
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    pagination_class = ReportPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "body"]  # ?search=...
    ordering_fields = ["created", "amount", "title"]  # ?ordering=amount or -amount


class ReportDetail(generics.RetrieveUpdateDestroyAPIView):  # GET, PUT, PATCH, DELETE one
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
