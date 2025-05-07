from rest_framework import serializers
from django.contrib.auth.models import User
from base.models import Product, Order, Advertising, DeliveryOrder
from rest_framework_simplejwt.tokens import RefreshToken


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'first_name', 'isAdmin']

    def get__id(self, obj):
        return obj.id

    def get_isAdmin(self, obj):
        return obj.is_staff

    def get_name(self, obj):
        name = obj.first_name + ' ' + obj.last_name
        if name == '':
            name = obj.email
        return name


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj).access_token
        return str(token)


class ProductSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None

    class Meta:
        model = Product
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    orderNumber = serializers.CharField(read_only=True)
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')
    # street_address = serializers.CharField(source='streetAddress')

    class Meta:
        model = Order
        fields = '__all__'

    def get_user(self, obj):
        return obj.user.username if obj.user else None


class AdvertisingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advertising
        fields = '__all__'


# class DeliveryOrderSerializer(serializers.ModelSerializer):
#     user = serializers.SerializerMethodField()
#     class Meta:
#         model = DeliveryOrder
#         fields = '__all__'
        
#     def get_user(self, obj):
#         return obj.user.username if obj.user else None