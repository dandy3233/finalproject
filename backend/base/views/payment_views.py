from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from base.utils.chapa import initialize_payment
import uuid

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_payment(request):
    user = request.user
    data = request.data
    try:
        tx_ref = str(uuid.uuid4())[:12]
        amount = data.get('amount')
        return_url = "http://localhost:5173/success"

        payment_data = initialize_payment(
            email=user.email,
            amount=amount,
            first_name=user.first_name or "First",
            last_name=user.last_name or "Last",
            tx_ref=tx_ref,
            return_url=return_url
        )

        return Response(payment_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
