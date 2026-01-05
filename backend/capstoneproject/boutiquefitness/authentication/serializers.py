from rest_framework import serializers
from .models import Appusers, bookings,bookings_attendance
from django.contrib.auth.models import User


class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appusers
        fields = ["id","first_name","last_name","email","mobile_phone","year_of_birth","height_in_cm","weight"]
class bookingsSerializers(serializers.ModelSerializer):
    class Meta:
        model = bookings
        fields = ["id","booking_date","bookingstart_time", "bookingend_time", "booking_capacity","booking_remaining"]

class bookingsattendanceSerializers(serializers.ModelSerializer):
    class Meta:
        model = bookings_attendance
        fields =["id","bookingsNo","appusersNo"]

class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
