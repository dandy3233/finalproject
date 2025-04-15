# base/urls/advertising_urls.py

from django.urls import path
from base.views.advertising import AdvertisingListView

urlpatterns = [
    path('', AdvertisingListView.as_view(), name='advertising-list'),
]
