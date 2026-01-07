# bookings/urls.py
from django.urls import path
from .views import (
    BookingCreateView,
    BookingListView,
    BookingDetailView,
    BookingUpdateView,
    BookingDeleteView
)

urlpatterns = [
    path("create/", BookingCreateView.as_view(), name="booking-create"),
    path("list/", BookingListView.as_view(), name="booking-list"),
    path("<int:pk>/", BookingDetailView.as_view(), name="booking-detail"),
    path("<int:pk>/update/", BookingUpdateView.as_view(), name="booking-update"),
    path("<int:pk>/delete/", BookingDeleteView.as_view(), name="booking-delete"),
]
