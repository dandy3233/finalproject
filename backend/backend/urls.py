# backend/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
# from base.views import OrderCreateView  
# backend/urls.py
# from base.views.product_views import search_products  # Instead of base.views

from base.views.product_views import searchProducts 


from base.views.order_views import OrderViewSet  # Correct import for your ViewSet
from rest_framework.routers import DefaultRouter

# Initialize router for viewset
router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='orders') 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/users/', include('base.urls.user_urls')),
    path('api/products/', include('base.urls.product_urls')),
    # path('api/orders/', include(router.urls)),  # Use router for viewset
    path('api/products/', include('base.urls.product_urls')),


]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
