from django.contrib import admin
from .models import *


admin.site.register(Product)
admin.site.register(Review)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)
admin.site.register(Advertising)
admin.site.register(DeliveryOrder)
# admin.site.register(Delivered)
