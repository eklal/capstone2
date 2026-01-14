# bookings/urls.py
from django.urls import path
from .views import (
    # Availability views
    AvailabilityListCreateView,
    AvailabilityDetailView,
    AvailabilityBulkUpdateView,
    AvailableSlotsView,
    # Booking views
    BookingCreateView,
    BookingListView,
    BookingDetailView,
    BookingUpdateView,
    BookingDeleteView,
    BookingStatusUpdateView,
)

urlpatterns = [
    # Availability endpoints
    path("availability/", AvailabilityListCreateView.as_view(), name="availability-list-create"),
    path("availability/<int:pk>/", AvailabilityDetailView.as_view(), name="availability-detail"),
    path("availability/bulk-update/", AvailabilityBulkUpdateView.as_view(), name="availability-bulk-update"),
    path("availability/trainer/<int:trainer_id>/slots/", AvailableSlotsView.as_view(), name="available-slots"),
    
    # Booking endpoints
    path("", BookingListView.as_view(), name="booking-list"),
    path("create/", BookingCreateView.as_view(), name="booking-create"),
    path("<int:pk>/", BookingDetailView.as_view(), name="booking-detail"),
    path("<int:pk>/update/", BookingUpdateView.as_view(), name="booking-update"),
    path("<int:pk>/status/", BookingStatusUpdateView.as_view(), name="booking-status-update"),
    path("<int:pk>/delete/", BookingDeleteView.as_view(), name="booking-delete"),
]
