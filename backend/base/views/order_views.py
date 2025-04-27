from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from base.models import Order
from base.serializers import OrderSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = []  # Allow any for testing
    
    # POST will be automatically available at /api/orders/
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)



    def perform_create(self, serializer):
        serializer.save()