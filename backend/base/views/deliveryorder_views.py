from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from base.models import Order
from django.contrib.auth.models import User
from django.shortcuts import get_list_or_404

@api_view(['POST'])
def assign_delivery(request):
    try:
        order_ids = request.data.get('order_ids', [])
        delivered_by_username = request.data.get('delivered_by')

        if not order_ids or not delivered_by_username:
            return Response({'detail': 'Missing fields'}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Get the User object based on username
        try:
            delivered_by_user = User.objects.get(username=delivered_by_username)
        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        orders = Order.objects.filter(_id__in=order_ids)
        for order in orders:
            order.delivereBy = delivered_by_user  # ✅ Changed from deliveredBy to delivereBy
            order.save()

        return Response({'success': True, 'assigned': len(orders)})

    except Exception as e:
        print(f"Error in assign_delivery: {e}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
