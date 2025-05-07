# base/views/deliveryorder_views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from base.models import Order
from django.shortcuts import get_list_or_404

@api_view(['POST'])
def assign_delivery(request):
    try:
        order_ids = request.data.get('order_ids', [])
        delivered_by = request.data.get('delivered_by')

        if not order_ids or not delivered_by:
            return Response({'detail': 'Missing fields'}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Use _id instead of id
        orders = get_list_or_404(Order, _id__in=order_ids)
        for order in orders:
            order.deliveredBy = delivered_by
            order.save()

        return Response({'success': True, 'assigned': len(orders)})

    except Exception as e:
        print(f"Error in assign_delivery: {e}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
