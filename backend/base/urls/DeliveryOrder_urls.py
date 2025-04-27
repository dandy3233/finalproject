# base/urls/DeliveryOrder_urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from base.views.DeliveryOrder import DeliveryOrderSet

router = DefaultRouter()
router.register(r'DeliveryOrder', DeliveryOrderSet, basename='deliveryorder')

urlpatterns = [
    path('', include(router.urls)),
]
