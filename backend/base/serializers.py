from rest_framework import serializers # type: ignore
from django.contrib.auth.models import User # type: ignore
from .models import Product
from rest_framework_simplejwt.tokens import RefreshToken # type: ignore
from base.models import Order
from base.models import Advertising


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)
    
    class Meta :
        model = User
        fields = ['id','_id','username','email','first_name','isAdmin']
        
    def get__id(self,obj):
        return obj.id
    
    def get_isAdmin(self,obj):
        return obj.is_staff
        
    def get_name(self, obj):
        name = obj.first_name + ' ' + obj.last_name
        if name =='':
            name = obj.email
        return name
            

class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)
    class Meta :
        model = User
        fields = ['id','_id','username','email','name','isAdmin','token']
        
    def get_token(self,obj):
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

    class Meta:
        model = Order
        fields = '__all__'
        # read_only_fields = ('user', 'created_at')  # Auto-populated fields

    def get_user(self, obj):
        return obj.user.username if obj.user else None
    
class AdvertisingSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Advertising
        fields = '__all__'
    
    