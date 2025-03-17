# # base/views.py
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from base.models import Order
# from base.serializers import OrderSerializer

# class OrderCreateView(APIView):
#     def post(self, request, *args, **kwargs):
#         serializer = OrderSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
