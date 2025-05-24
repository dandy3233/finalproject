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
from base.views.confirm_delivery import confirm_delivery, get_csrf_token, test_email

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
    path('api/assign_delivery/', assign_delivery, name='assign_delivery'),
    path('api/delivery_user/', get_users, name='get_users'),
    path('api/confirm_delivery/', confirm_delivery, name='confirm_delivery'),
    path('api/get_csrf_token/', get_csrf_token, name='get_csrf_token'),
    path('api/test_email/', test_email, name='test_email'),

    # Payment route
    path('api/', include('base.urls.payment_urls')),

    # dj-rest-auth endpoints
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),

    # Social login
    path('accounts/', include('allauth.urls')),
]

# Media file handling during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])