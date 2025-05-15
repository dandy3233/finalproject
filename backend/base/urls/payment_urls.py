# base/payment_urls.py
from django.urls import path
from base.views.payment_views import start_payment

urlpatterns = [
    path('payment/', start_payment, name='start-payment'),
]
