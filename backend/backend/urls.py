# backend/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from rest_framework.routers import DefaultRouter

# ViewSets
from base.views.order_views import OrderViewSet

# Function-based views
from base.views.deliveryorder_views import assign_delivery
from base.views.deliveryuser import get_orders, get_users
from base.views.product_views import searchProducts

# Router setup
router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='orders')

urlpatterns = [
    path('admin/', admin.site.urls),

    # ViewSet-based endpoints
    path('api/', include(router.urls)),

    # App-specific API includes
    path('api/users/', include('base.urls.user_urls')),
    path('api/products/', include('base.urls.product_urls')),
    path('api/advertising/', include('base.urls.advertising_urls')),

    # Function-based endpoints
    path('api/assign_delivery/', assign_delivery),
    # path('api/orders/', get_orders),  # Avoid conflict with /api/orders/
    path('api/delivery_user/', get_users),    # Avoid conflict with /api/users/
]


# Media file handling during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
