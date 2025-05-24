
import logging
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.middleware.csrf import get_token
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from base.models import Order, OrderItem
from base.serializers import OrderSerializer
from django.utils import timezone


logger = logging.getLogger(__name__)

@api_view(['GET'])
def get_csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})

@api_view(['GET'])
def test_email(request):
    try:
        subject = 'Test Email from African Star 🌟'
        text_content = 'This is a test email.'
        html_content = '<h2>Test Email</h2><p>This is a test email from African Star 🌟.</p>'
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=['dandytakilu@gmail.com'],
        )
        email.attach_alternative(html_content, "text/html")
        email.send(fail_silently=False)
        logger.info("Test email sent successfully")
        return Response({'message': 'Test email sent successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Failed to send test email: {str(e)}")
        return Response({'message': f'Failed to send email: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def create_order(request):
    if request.method == 'POST':
        try:
            data = request.data

            # Create the order
            order = Order.objects.create(
                orderNumber=data.get('orderNumber'),
                first_name=data.get('firstName'),
                last_name=data.get('lastName'),
                phone=data.get('phone'),
                email=data.get('email', 'dandytakilu@gmail.com'),
                street_address=data.get('streetAddress'),
                city=data.get('city'),
                state=data.get('state'),
                country=data.get('country'),
                instructions=data.get('instructions', ''),
                tax_price=data.get('taxPrice'),
                shipping_price=data.get('shippingPrice'),
                total_price=data.get('totalPrice'),
                payment_method=data.get('paymentMethod'),
                is_paid=data.get('isPaid', False),
                is_delivered=data.get('isDelivered', False),
                confirmation_number=data.get('confirmationCode'),
            )

            # Create order items
            for item in data.get('orderItems', []):
                OrderItem.objects.create(
                    order=order,
                    name=item.get('name'),
                    qty=item.get('qty'),
                    price=item.get('price'),
                    product=item.get('product'),
                )

            # Prepare email content
            subject = f'Order Confirmation - Order #{order.order_number}'
            text_content = f"""
Dear {order.first_name} {order.last_name},

Thank you for your order! Below are the details:

Order Number: {order.orderNumber}
Confirmation Code: {order.confirmation_number}
Payment Method: {order.payment_method}
Delivery Address: {order.street_address}, {order.city}, {order.state}, {order.country}
Special Instructions: {order.instructions or 'None'}

Order Items:
"""
            for item in order.order_items.all():
                text_content += f"- {item.name} (Qty: {item.qty}, Price: ${item.price:.2f})\n"

            text_content += f"""
Subtotal: ${order.total_price - order.tax_price - order.shipping_price:.2f}
Tax: ${order.tax_price:.2f}
Shipping: ${order.shipping_price:.2f}
Total: ${order.total_price:.2f}

We will notify you once your order is processed and shipped.

Best regards,
African Star 🌟
"""

            html_content = f"""
<html>
  <body style="font-family: Arial, sans-serif;">
    <h2>Order Confirmation - Order #{order.orderNumber}</h2>
    <p>Dear {order.first_name} {order.last_name},</p>
    <p>Thank you for your order! Below are the details:</p>
    <table border="1" style="border-collapse: collapse; width: 100%;">
      <tr><th>Field</th><th>Value</th></tr>
      <tr><td>Order Number</td><td>{order.orderNumber}</td></tr>
      <tr><td>Confirmation Code</td><td>{order.confirmation_number}</td></tr>
      <tr><td>Payment Method</td><td>{order.payment_method}</td></tr>
      <tr><td>Delivery Address</td><td>{order.street_address}, {order.city}, {order.state}, {order.country}</td></tr>
      <tr><td>Special Instructions</td><td>{order.instructions or 'None'}</td></tr>
    </table>
    <h3>Order Items</h3>
    <ul>
      {"".join([f"<li>{item.name} (Qty: {item.qty}, Price: ${item.price:.2f})</li>" for item in order.order_items.all()])}
    </ul>
    <p><strong>Subtotal:</strong> ${order.total_price - order.tax_price - order.shipping_price:.2f}</p>
    <p><strong>Tax:</strong> ${order.tax_price:.2f}</p>
    <p><strong>Shipping:</strong> ${order.shipping_price:.2f}</p>
    <p><strong>Total:</strong> ${order.total_price:.2f}</p>
    <p>We will notify you once your order is processed and shipped.</p>
    <p>Best regards,<br>African Star 🌟</p>
  </body>
</html>
"""

            # Send HTML email
            email = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[order.email],
            )
            email.attach_alternative(html_content, "text/html")
            email.send(fail_silently=False)
            logger.info(f"Order confirmation email sent to {order.email}")

            serializer = OrderSerializer(order)
            return Response({
                'message': 'Order placed successfully',
                '_id': order.id,
                'orderNumber': order.order_number,
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(f"Error in create_order: {str(e)}")
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    return Response({'message': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['POST'])
def confirm_delivery(request):
    try:
        data = request.data
        order_number = data.get('orderNumber')
        confirmation_number = data.get('confirmation_number')

        if not order_number or not confirmation_number:
            return Response({'message': 'Order number and confirmation number are required'}, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.get(orderNumber=order_number)

        # ✅ Match the confirmation number instead of overwriting it
        if order.confirmation_number != confirmation_number:
            return Response({'message': 'Invalid confirmation number'}, status=status.HTTP_400_BAD_REQUEST)

        order.isDelivered = True
        order.deliveredAt = timezone.now()
        order.status = "Done"
        order.save()

        serializer = OrderSerializer(order)
        return Response({'message': f'Order {order_number} confirmed as delivered', 'order': serializer.data}, status=status.HTTP_200_OK)

    except Order.DoesNotExist:
        return Response({'message': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error in confirm_delivery: {str(e)}")
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
