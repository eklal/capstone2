# bookings/views.py
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Booking
from .serializers import BookingSerializer
from common.permissions import IsBookingOwnerOrTrainerOrAdmin

class BookingCreateView(generics.CreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

class BookingListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin":
            return Booking.objects.all()
        if user.role == "trainer":
            return Booking.objects.filter(trainer__user=user)
        return Booking.objects.filter(client=user)

class BookingDetailView(generics.RetrieveAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated, IsBookingOwnerOrTrainerOrAdmin]
    queryset = Booking.objects.all()

class BookingUpdateView(generics.UpdateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated, IsBookingOwnerOrTrainerOrAdmin]
    queryset = Booking.objects.all()

class BookingDeleteView(generics.DestroyAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated, IsBookingOwnerOrTrainerOrAdmin]
    queryset = Booking.objects.all()
