from rest_framework import serializers
from .models import Appusers, bookings,bookings_attendance

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
