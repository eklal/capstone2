from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "role", "token"]

    def get_token(self, obj):
        """Generate JWT token for the user"""
        refresh = RefreshToken.for_user(obj)
        return str(refresh.access_token)

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom token serializer to return user data with token"""
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add user data to the response
        data['id'] = self.user.id
        data['username'] = self.user.username
        data['email'] = self.user.email
        data['role'] = self.user.role
        data['token'] = data.pop('access')  # Rename 'access' to 'token'
        
        # Remove refresh token from response (keep it if you need it)
        data.pop('refresh', None)
        
        return data
