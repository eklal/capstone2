from rest_framework import serializers
from .models import (
    User, Payment, Product, MediaFile, 
    Subscription, Booking, Attendance
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'user_no', 'first_name', 'last_name', 'role', 
            'gender', 'age', 'weight', 'email', 'password'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['payment_no', 'user_no', 'amount', 'date']


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['product_no', 'product_name', 'product_category']


class MediaFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaFile
        fields = ['media_no', 'media_type', 'upload_date', 'status', 'product_no']


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['subscription_no', 'user_no', 'product_no', 'subscriber_category']


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            'booking_no', 'date', 'start_time', 'end_time', 
            'capacity', 'remaining_positions'
        ]


class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ['attendance_no', 'booking_no', 'user_no']
