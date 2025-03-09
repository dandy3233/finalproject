# base/urls/order_urls.py

from base.views.order_views import OrderViewSet  # Make sure this is correct

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'orders', OrderViewSet)

urlpatterns = router.urls
