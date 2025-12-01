from django.contrib import admin
from .models import (
    User, Payment, Product, MediaFile, 
    Subscription, Booking, Attendance
)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('user_no', 'first_name', 'last_name', 'email', 'role')
    list_filter = ('role', 'gender')
    search_fields = ('first_name', 'last_name', 'email')


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('payment_no', 'user_no', 'amount', 'date')
    list_filter = ('date',)
    search_fields = ('user_no__first_name', 'user_no__last_name')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('product_no', 'product_name', 'product_category')
    list_filter = ('product_category',)
    search_fields = ('product_name',)


@admin.register(MediaFile)
class MediaFileAdmin(admin.ModelAdmin):
    list_display = ('media_no', 'media_type', 'status', 'product_no', 'upload_date')
    list_filter = ('media_type', 'status', 'upload_date')
    search_fields = ('product_no__product_name',)


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('subscription_no', 'user_no', 'product_no', 'subscriber_category')
    list_filter = ('subscriber_category',)
    search_fields = ('user_no__first_name', 'user_no__last_name', 'product_no__product_name')


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('booking_no', 'date', 'start_time', 'end_time', 'capacity', 'remaining_positions')
    list_filter = ('date',)
    search_fields = ('date',)


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('attendance_no', 'booking_no', 'user_no')
    list_filter = ('booking_no__date',)
    search_fields = ('user_no__first_name', 'user_no__last_name')
