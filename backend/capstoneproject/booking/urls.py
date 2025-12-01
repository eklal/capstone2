from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, BookingViewSet, PaymentViewSet, 
    ProductViewSet, MediaFileViewSet, SubscriptionViewSet, 
    AttendanceViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'media', MediaFileViewSet, basename='media')
router.register(r'subscriptions', SubscriptionViewSet, basename='subscription')
router.register(r'attendance', AttendanceViewSet, basename='attendance')

urlpatterns = [
    path('', include(router.urls)),
]
