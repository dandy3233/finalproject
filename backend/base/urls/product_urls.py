from django.urls import path
from base.views import product_views as views
# from base.views.product_views import search_products
from base.views.product_views import searchProducts


urlpatterns = [
    path('',views.getProducts ,name = 'products'),
    # path('<str:pk>/',views.getProduct ,name = 'product'),
    path('search/', searchProducts, name='product-search'),  # Use the correct name
    path('<int:pk>/', views.getProduct, name='product-detail'),
]