# base/views.py
from django.http import JsonResponse
from base.models import Product
# from base.views.product_views import search_products


def search_products(request):
    query = request.GET.get('q', '')
    if query:
        products = Product.objects.filter(name__icontains=query)
        products_data = list(products.values())
        return JsonResponse(products_data, safe=False)
    return JsonResponse([], safe=False)
