# bookings/views.py
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Booking, Availability
from .serializers import BookingSerializer, AvailabilitySerializer
from common.permissions import IsBookingOwnerOrTrainerOrAdmin
from trainers.models import TrainerProfile


# ==================== AVAILABILITY VIEWS ====================

class AvailabilityListCreateView(generics.ListCreateAPIView):
    """List all availabilities or create new ones (for trainers)"""
    serializer_class = AvailabilitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        trainer_id = self.request.query_params.get('trainer_id')
        if trainer_id:
            return Availability.objects.filter(trainer_id=trainer_id)
        
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

    def get_queryset(self):
        user = self.request.user
        queryset = Booking.objects.all()

        # Filter by trainer (for checking availability)
        trainer_id = self.request.query_params.get('trainer_id')
        if trainer_id:
            # When checking a specific trainer, show all their bookings
            # This is needed for the availability calendar
            queryset = queryset.filter(trainer_id=trainer_id)
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
    """Accept, decline, or complete a booking (for trainers)"""
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            return Response(
                {"error": "Booking not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check permissions
        if request.user.role == "trainer":
            if booking.trainer.user != request.user:
                return Response(
                    {"error": "You can only update your own bookings"},
                    status=status.HTTP_403_FORBIDDEN
                )
        elif request.user.role != "admin":
            return Response(
                {"error": "Only trainers and admins can update booking status"},
                status=status.HTTP_403_FORBIDDEN
            )

        new_status = request.data.get('status')
        if new_status not in ['pending', 'confirmed', 'cancelled', 'completed']:
            return Response(
                {"error": "Invalid status"},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = new_status
        booking.save()

        serializer = BookingSerializer(booking)
        return Response(serializer.data, status=status.HTTP_200_OK)
