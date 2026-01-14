# bookings/views.py
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from .models import Booking, Availability
from .serializers import BookingSerializer, AvailabilitySerializer
from common.permissions import IsBookingOwnerOrTrainerOrAdmin
from trainers.models import TrainerProfile
from datetime import datetime, timedelta, time
from django.db.models import Q


class BookingPagination(PageNumberPagination):
    """Custom pagination for bookings"""
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


# ==================== AVAILABILITY VIEWS ====================

class AvailabilityListCreateView(generics.ListCreateAPIView):
    """List all availabilities or create new ones (for trainers)"""
    serializer_class = AvailabilitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        trainer_id = self.request.query_params.get('trainer_id')
        if trainer_id:
            # Try to find by trainer profile ID first
            try:
                return Availability.objects.filter(trainer_id=trainer_id)
            except:
                pass
            
            # If not found, try to find by user ID
            try:
                trainer_profile = TrainerProfile.objects.get(user_id=trainer_id)
                return Availability.objects.filter(trainer=trainer_profile)
            except TrainerProfile.DoesNotExist:
                return Availability.objects.none()
        
        # If user is a trainer, show only their availability
        if self.request.user.role == "trainer":
            try:
                trainer_profile = TrainerProfile.objects.get(user=self.request.user)
                return Availability.objects.filter(trainer=trainer_profile)
            except TrainerProfile.DoesNotExist:
                return Availability.objects.none()
        
        # Admins can see all
        return Availability.objects.all()

    def perform_create(self, serializer):
        # Automatically set trainer to current user's trainer profile
        if self.request.user.role == "trainer":
            trainer_profile = TrainerProfile.objects.get(user=self.request.user)
            serializer.save(trainer=trainer_profile)
        else:
            serializer.save()


class AvailabilityDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a specific availability"""
    serializer_class = AvailabilitySerializer
    permission_classes = [IsAuthenticated]
    queryset = Availability.objects.all()

    def get_queryset(self):
        # Trainers can only access their own availability
        if self.request.user.role == "trainer":
            try:
                trainer_profile = TrainerProfile.objects.get(user=self.request.user)
                return Availability.objects.filter(trainer=trainer_profile)
            except TrainerProfile.DoesNotExist:
                return Availability.objects.none()
        return Availability.objects.all()


class AvailabilityBulkUpdateView(APIView):
    """Update multiple availability slots at once"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != "trainer":
            return Response(
                {"error": "Only trainers can set availability"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            trainer_profile = TrainerProfile.objects.get(user=request.user)
        except TrainerProfile.DoesNotExist:
            return Response(
                {"error": "Trainer profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        availability_data = request.data.get('availability', [])
        
        # Clear existing availability for this trainer
        Availability.objects.filter(trainer=trainer_profile).delete()

        # Create new availability slots
        created_slots = []
        for slot_data in availability_data:
            slot_data['trainer'] = trainer_profile.id
            serializer = AvailabilitySerializer(data=slot_data)
            if serializer.is_valid():
                serializer.save(trainer=trainer_profile)
                created_slots.append(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "message": "Availability updated successfully",
            "availability": created_slots
        }, status=status.HTTP_200_OK)


class AvailableSlotsView(APIView):
    """Get available time slots for a specific trainer and date"""
    permission_classes = [AllowAny]  # Anyone can check availability

    def get(self, request, trainer_id):
        date_str = request.query_params.get('date')
        
        if not date_str:
            return Response(
                {"error": "Date parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Parse the date
            booking_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get trainer profile
        try:
            trainer_profile = TrainerProfile.objects.get(id=trainer_id)
        except TrainerProfile.DoesNotExist:
            try:
                # Try by user ID
                trainer_profile = TrainerProfile.objects.get(user_id=trainer_id)
            except TrainerProfile.DoesNotExist:
                return Response(
                    {"error": "Trainer not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

        # Get day of week
        day_of_week = booking_date.strftime('%A').lower()

        # Get trainer's availability for this day
        availabilities = Availability.objects.filter(
            trainer=trainer_profile,
            day_of_week=day_of_week,
            is_available=True
        )

        if not availabilities.exists():
            return Response({
                "date": date_str,
                "day_of_week": day_of_week,
                "available_slots": []
            })

        # Get all bookings for this trainer on this date
        bookings = Booking.objects.filter(
            trainer=trainer_profile,
            date=booking_date
        ).exclude(status='cancelled')

        # Generate available time slots
        available_slots = []
        
        for availability in availabilities:
            start_time = availability.start_time
            end_time = availability.end_time
            
            # Generate hourly slots
            current_time = datetime.combine(booking_date, start_time)
            end_datetime = datetime.combine(booking_date, end_time)
            
            while current_time < end_datetime:
                slot_start = current_time.time()
                slot_end = (current_time + timedelta(hours=1)).time()
                
                # Check if this slot is already booked
                is_booked = bookings.filter(
                    start_time__lt=slot_end,
                    end_time__gt=slot_start
                ).exists()
                
                if not is_booked:
                    available_slots.append({
                        "start_time": slot_start.strftime('%H:%M'),
                        "end_time": slot_end.strftime('%H:%M'),
                        "available": True
                    })
                
                current_time += timedelta(hours=1)

        return Response({
            "date": date_str,
            "day_of_week": day_of_week,
            "trainer_id": trainer_profile.id,
            "trainer_name": trainer_profile.user.username,
            "available_slots": available_slots
        })


# ==================== BOOKING VIEWS ====================

class BookingCreateView(generics.CreateAPIView):
    """Create a new booking"""
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically set client to current user if they are a client
        if self.request.user.role == "client":
            serializer.save(client=self.request.user)
        else:
            serializer.save()


class BookingListView(generics.ListAPIView):
    """List bookings based on user role and filters"""
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = BookingPagination

    def get_queryset(self):
        user = self.request.user
        queryset = Booking.objects.all()

        # Filter by trainer (for checking availability)
        trainer_id = self.request.query_params.get('trainer_id')
        if trainer_id:
            # When checking a specific trainer, show all their bookings
            # This is needed for the availability calendar
            # Try to find by trainer profile ID first, then by user ID
            try:
                queryset = queryset.filter(trainer_id=trainer_id)
            except:
                try:
                    trainer_profile = TrainerProfile.objects.get(user_id=trainer_id)
                    queryset = queryset.filter(trainer=trainer_profile)
                except TrainerProfile.DoesNotExist:
                    queryset = queryset.none()
        else:
            # Filter by role (for user's own bookings)
            if user.role == "trainer":
                queryset = queryset.filter(trainer__user=user)
            elif user.role == "client":
                queryset = queryset.filter(client=user)
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        return queryset

class BookingDetailView(generics.RetrieveAPIView):
    """Retrieve a specific booking"""
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated, IsBookingOwnerOrTrainerOrAdmin]
    queryset = Booking.objects.all()


class BookingUpdateView(generics.UpdateAPIView):
    """Update a booking (status, notes, etc.)"""
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated, IsBookingOwnerOrTrainerOrAdmin]
    queryset = Booking.objects.all()


class BookingDeleteView(generics.DestroyAPIView):
    """Delete/cancel a booking"""
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated, IsBookingOwnerOrTrainerOrAdmin]
    queryset = Booking.objects.all()


class BookingStatusUpdateView(APIView):
    """Update booking status.

    - Trainers: can update status for their own bookings
    - Clients: can cancel their own bookings only
    - Admins: can update any booking
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            return Response(
                {"error": "Booking not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        new_status = request.data.get('status')
        if new_status not in ['pending', 'confirmed', 'cancelled', 'completed']:
            return Response(
                {"error": "Invalid status"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check permissions
        if request.user.role == "trainer":
            if booking.trainer.user != request.user:
                return Response(
                    {"error": "You can only update your own bookings"},
                    status=status.HTTP_403_FORBIDDEN
                )
        elif request.user.role == "client":
            if booking.client != request.user:
                return Response(
                    {"error": "You can only update your own bookings"},
                    status=status.HTTP_403_FORBIDDEN
                )
            if new_status != "cancelled":
                return Response(
                    {"error": "Clients can only cancel bookings"},
                    status=status.HTTP_403_FORBIDDEN
                )
        elif request.user.role != "admin":
            return Response(
                {"error": "Not allowed to update booking status"},
                status=status.HTTP_403_FORBIDDEN
            )

        booking.status = new_status
        booking.save()

        serializer = BookingSerializer(booking)
        return Response(serializer.data, status=status.HTTP_200_OK)
