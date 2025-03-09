from django.shortcuts import render # type: ignore
from django.http import JsonResponse # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework.decorators import api_view # type: ignore
from base.models import Product
from base.serializers import ProductSerializer 


@api_view(['GET'])
def getProducts(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products , many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def getProduct(request , pk):
    product = Product.objects.get(_id =pk)
    serializer = ProductSerializer(product , many=False, context={'request': request})
    return Response(serializer.data)
    