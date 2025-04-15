# base/views/advertising.py

from rest_framework.views import APIView
from rest_framework.response import Response
from base.models import Advertising
from base.serializers import AdvertisingSerializer

class AdvertisingListView(APIView):
    def get(self, request):
        advertisements = Advertising.objects.all()
        serializer = AdvertisingSerializer(advertisements, many=True)
        return Response(serializer.data)
