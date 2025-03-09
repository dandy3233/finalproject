
from django.contrib import admin # type: ignore
from django.urls import path ,include # type: ignore

from django.conf import settings # type: ignore
from django.conf.urls.static import static # type: ignore

urlpatterns = [
    path('admin/', admin.site.urls),
   # path('api/',include('base.urls')),
   path('api/users/',include('base.urls.user_urls')),
   path('api/products/',include('base.urls.product_urls')),
   path('api/orders/',include('base.urls.order_urls')),
   
   
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
