import random
import string
from django.core.mail import send_mail
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from base.models import Order
from base.serializers import OrderSerializer
import logging
from django.utils import timezone

logger = logging.getLogger(__name__)

@api_view(['POST'])
def assign_delivery(request):
    order_ids = request.data.get('order_ids', [])
    username = request.data.get('delivered_by')

    if not order_ids or not username:
        return Response({'detail': 'Order IDs and Actor are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        actor = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'detail': 'Actor not found.'}, status=status.HTTP_404_NOT_FOUND)

    # Use _id as the primary key field
    orders = Order.objects.filter(_id__in=order_ids)
    if not orders.exists():
        return Response({'detail': 'No orders found with given IDs.'}, status=status.HTTP_404_NOT_FOUND)

    updated_orders = []
    email_lines = [f"Hello {actor.username},\n", "You have been assigned the following orders:\n"]

    for order in orders:
        # Generate a unique 6-digit confirmation number
        # confirmation_number = ''.join(random.choices(string.digits, k=6))
        # while Order.objects.filter(confirmation_number=confirmation_number).exists():
        #     confirmation_number = ''.join(random.choices(string.digits, k=6))

        # Assign delivery person and update order status & confirmation number
        order.delivereBy = actor  # Correct field name
        order.status = 'Assigned'
        # order.confirmation_number = confirmation_number
        order.save()
        updated_orders.append(order)

        # Add to actor email summary
        email_lines.append(f"Order #{order.orderNumber}")
        email_lines.append(f"Customer: {order.first_name} {order.last_name}")
        email_lines.append(f"Phone: {order.phone}")
        email_lines.append(f"Address: {order.street_address}, {order.city}, {order.state}")
        email_lines.append(f"Confirmation Number: {order.confirmation_number}")
        email_lines.append(f"Instructions: {order.instructions or 'None'}")
        email_lines.append("-" * 40)

        # Email to customer with confirmation number
        send_mail(
            subject=f"Your Order #{order.orderNumber} is on its way!",
            message=(
                f"Dear {order.first_name},\n\n"
                f"Your order has been assigned to our delivery team and will be delivered soon.\n\n"
                f"Delivery Person: {actor.get_full_name() or actor.username}\n"
                f"Contact: {actor.email}\n"
                f"Confirmation Number: {order.confirmation_number}\n\n"
                f"Please provide this confirmation number to the delivery person upon receipt.\n"
                f"Thank you for shopping with us!"
            ),
            from_email='admin@yourdomain.com',
            recipient_list=[order.email],
            fail_silently=True,
        )

    email_lines.append("\nThank you for your work!")

    # Email to delivery person with summary
    send_mail(
        subject='You have been assigned new orders',
        message="\n".join(email_lines),
        from_email='admin@yourdomain.com',
        recipient_list=[actor.email],
        fail_silently=False,
    )

    serializer = OrderSerializer(updated_orders, many=True)
    return Response({
        'detail': 'Orders assigned, statuses updated, and emails sent.',
        'orders': serializer.data
    }, status=status.HTTP_200_OK)
