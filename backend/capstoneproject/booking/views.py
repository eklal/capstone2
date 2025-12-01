from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User, Booking, Payment, Product, MediaFile, Subscription, Attendance
from .serializers import (
    UserSerializer, BookingSerializer, PaymentSerializer, 
    ProductSerializer, MediaFileSerializer, SubscriptionSerializer, 
    AttendanceSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for User CRUD operations.
    Provides list, create, retrieve, update, and destroy operations.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'user_no'
    
    @action(detail=False, methods=['get'])
    def by_email(self, request):
        """Get user by email"""
        email = request.query_params.get('email')
        if not email:
            return Response(
                {'error': 'email parameter is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            user = User.objects.get(email=email)
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['get'])
    def get_payments(self, request, user_no=None):
        """Get all payments for a specific user"""
        try:
            user = User.objects.get(user_no=user_no)
            payments = user.payments.all()
            serializer = PaymentSerializer(payments, many=True)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['get'])
    def get_subscriptions(self, request, user_no=None):
        """Get all subscriptions for a specific user"""
        try:
            user = User.objects.get(user_no=user_no)
            subscriptions = user.subscriptions.all()
            serializer = SubscriptionSerializer(subscriptions, many=True)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )


class BookingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Booking CRUD operations.
    Provides list, create, retrieve, update, and destroy operations.
    """
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    lookup_field = 'booking_no'
    
    @action(detail=False, methods=['get'])
    def available_bookings(self, request):
        """Get all bookings with available positions"""
        bookings = Booking.objects.filter(remaining_positions__gt=0)
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def get_attendees(self, request, booking_no=None):
        """Get all attendees for a specific booking"""
        try:
            booking = Booking.objects.get(booking_no=booking_no)
            attendances = booking.attendances.all()
            serializer = AttendanceSerializer(attendances, many=True)
            return Response(serializer.data)
        except Booking.DoesNotExist:
            return Response(
                {'error': 'Booking not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'])
    def add_attendee(self, request, booking_no=None):
        """Add an attendee to a booking"""
        try:
            booking = Booking.objects.get(booking_no=booking_no)
            user_no = request.data.get('user_no')
            
            if not user_no:
                return Response(
                    {'error': 'user_no is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if booking.remaining_positions <= 0:
                return Response(
                    {'error': 'No remaining positions for this booking'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            user = User.objects.get(user_no=user_no)
            attendance = Attendance.objects.create(
                booking_no=booking,
                user_no=user
            )
            booking.remaining_positions -= 1
            booking.save()
            
            serializer = AttendanceSerializer(attendance)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Booking.DoesNotExist:
            return Response(
                {'error': 'Booking not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['delete'])
    def remove_attendee(self, request, booking_no=None):
        """Remove an attendee from a booking"""
        try:
            user_no = request.data.get('user_no')
            if not user_no:
                return Response(
                    {'error': 'user_no is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            booking = Booking.objects.get(booking_no=booking_no)
            attendance = Attendance.objects.get(
                booking_no=booking,
                user_no=user_no
            )
            attendance.delete()
            booking.remaining_positions += 1
            booking.save()
            
            return Response(
                {'success': 'Attendee removed successfully'}, 
                status=status.HTTP_200_OK
            )
        except Booking.DoesNotExist:
            return Response(
                {'error': 'Booking not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Attendance.DoesNotExist:
            return Response(
                {'error': 'Attendance record not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )


class PaymentViewSet(viewsets.ModelViewSet):
    """ViewSet for Payment CRUD operations."""
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    lookup_field = 'payment_no'


class ProductViewSet(viewsets.ModelViewSet):
    """ViewSet for Product CRUD operations."""
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'product_no'


class MediaFileViewSet(viewsets.ModelViewSet):
    """ViewSet for MediaFile CRUD operations."""
    queryset = MediaFile.objects.all()
    serializer_class = MediaFileSerializer
    lookup_field = 'media_no'


class SubscriptionViewSet(viewsets.ModelViewSet):
    """ViewSet for Subscription CRUD operations."""
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    lookup_field = 'subscription_no'


class AttendanceViewSet(viewsets.ModelViewSet):
    """ViewSet for Attendance CRUD operations."""
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    lookup_field = 'attendance_no'
