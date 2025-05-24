from itertools import product
import re
from unicodedata import name
from django.db import models # type: ignore
from django.contrib.auth.models import User # type: ignore
from django.conf import settings # type: ignore
from django.utils.timezone import now
from django.db.models.signals import pre_save
from django.dispatch import receiver


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
    user = models.ForeignKey(User, related_name='orders', on_delete=models.CASCADE, null=True, blank=True)
    delivereBy = models.ForeignKey(User, related_name='delivered_orders', on_delete=models.SET_NULL,null=True,blank=True)
    paymentMethod = models.CharField(max_length=200, null=True, blank=True)
    taxPrice = models.DecimalField(max_digits=7, decimal_places=2)
    shippingPrice = models.DecimalField(max_digits=7, decimal_places=2)
    totalPrice = models.DecimalField(max_digits=7, decimal_places=2)
    isPaid = models.BooleanField(default=False)
    paidAt = models.DateTimeField(null=True, blank=True)
    isDelivered = models.BooleanField(default=False)
    deliveredAt = models.DateTimeField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    orderNumber = models.CharField(max_length=20, null=True, blank=True, unique=True)
    _id = models.AutoField(primary_key=True, editable=False)
    instructions = models.TextField(blank=True, null=True)
    # deliveredBy = models.CharField(max_length=255, null=True, blank=True)  # ✅ Add this line

    
    # Contact info
    first_name = models.CharField(max_length=100, default='John')
    last_name = models.CharField(max_length=100, default='Demo')
    phone = models.CharField(max_length=20, default='0000000000')
    email = models.EmailField(default='test@example.com')


    # Address fields
    street_address = models.CharField(max_length=255, default='Unknown')
    city = models.CharField(max_length=100, default='Ethiopia')
    state = models.CharField(max_length=100, default='Addis Ababa')
    country = models.CharField(max_length=100, default='Ethiopia')
    
    status = models.CharField(max_length=50, default='Pending')  # Pending, Assigned, Delivered
    confirmation_number = models.CharField(max_length=10, unique=True, null=True, blank=True)  # New field


    def __str__(self):
        return self.orderNumber or f"Order {self._id}"


@receiver(pre_save, sender=Order)
def generate_order_number(sender, instance, **kwargs):
    if not instance.orderNumber:
        today_str = now().strftime('%Y%m%d')
        prefix = f"ORD-{today_str}"

        last_order = (
            Order.objects.filter(orderNumber__startswith=prefix)
            .order_by('-createdAt')
            .first()
        )

        if last_order and last_order.orderNumber:
            last_number = int(last_order.orderNumber[-4:])
        else:
            last_number = 0

        instance.orderNumber = f"{prefix}-{last_number + 1:04d}"
    if not instance.confirmation_number:
        instance.confirmation_number = str(random.randint(100000, 999999))


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
    


class DeliveryOrder(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    streetAddress = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    instructions = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.firstName} {self.lastName}"
