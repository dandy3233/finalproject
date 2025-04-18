from itertools import product
import re
from unicodedata import name
from django.db import models # type: ignore
from django.contrib.auth.models import User # type: ignore
from django.conf import settings # type: ignore


class Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null =True)
    name = models.CharField(max_length =200 ,null =True, blank =True)
    image = models.ImageField(null =True, blank =True)
    def image_url(self):
        if self.image:
            return f"{settings.MEDIA_URL}{self.image}"
        return ""
    brand = models.CharField(max_length =200 ,null =True, blank =True)
    category = models.CharField(max_length =200 ,null =True, blank =True)
    description = models.TextField(null =True, blank =True)
    rating = models.DecimalField(max_digits = 7,decimal_places=2)
    numReviews = models.IntegerField(null =True, blank =True ,default=0)
    price = models.DecimalField(max_digits = 7,decimal_places=2)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    countInStock = models.IntegerField(null =True, blank =True ,default=0)
    createdAt = models.DateTimeField(auto_now_add =True)
    _id = models.AutoField(primary_key = True,editable = False)
    
    def __str__(self):
        return self.name
    
    
class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null =True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null =True)
    name = models.CharField(max_length =200 ,null =True, blank =True)
    rating = models.IntegerField(null =True, blank =True ,default=0)
    comments =models.TextField(null =True, blank =True)
    _id = models.AutoField(primary_key = True,editable = False)
    
    def __str__(self):
        return str(self.rating)


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null =True)
    paymentMethod = models.CharField(max_length =200 ,null =True, blank =True)
    taxPrice= models.DecimalField(max_digits = 7,decimal_places=2)
    shippingPrice= models.DecimalField(max_digits = 7,decimal_places=2)
    totalPrice= models.DecimalField(max_digits = 7,decimal_places=2)
    isPaid = models.BooleanField(default =False)
    paidAt = models.DateTimeField(auto_now_add =False, null =True, blank =True)
    isDelivered = models.BooleanField(default =False)
    deliveredAt= models.DateTimeField(auto_now_add =False, null =True, blank =True)
    createdAt= models.DateTimeField(auto_now_add =True )
    _id = models.AutoField(primary_key = True,editable = False)
    def __str__(self):
        return f"Order {self._id}"


class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null =True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null =True)
    name = models.CharField(max_length =200 ,null =True, blank =True)
    quantity =  models.IntegerField(null =True, blank =True ,default=0)
    price = models.DecimalField(max_digits = 7,decimal_places=2)
    image = models.CharField(max_length =200 ,null =True, blank =True)
    _id = models.AutoField(primary_key = True,editable = False)
    
    def __str__(self):
        return str(self.name)
    

class ShippingAddress(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, null =True , blank =True)
    address = models.CharField(max_length =200 ,null =True, blank =True)
    city = models.CharField(max_length =200 ,null =True, blank =True)
    postalCode = models.CharField(max_length =200 ,null =True, blank =True)
    country = models.CharField(max_length =200 ,null =True, blank =True)
    shippingPrice= models.DecimalField(max_digits = 7,decimal_places=2)
    _id = models.AutoField(primary_key = True,editable = False)
    
    def __str__(self):
        return str(self.address)
    
    
class Advertising(models.Model):
    SECTION_CHOICES = [
        ('superDeals', 'Super Deals'),
        ('bigSave', 'Big Save'),
    ]

    name = models.CharField(max_length=255)
    image = models.ImageField(null =True, blank =True)

    original_price = models.DecimalField(max_digits=10, decimal_places=2)
    discounted_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_percentage = models.PositiveIntegerField(blank=True, null=True)
    save_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    secondary_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    section = models.CharField(max_length=20, choices=SECTION_CHOICES)

    def __str__(self):
        return f"{self.name} ({self.section})"