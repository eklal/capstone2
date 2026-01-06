from django.urls import path
from .views import (
    TrainerCreateView,
    TrainerListView,
    TrainerDetailView,
    TrainerUpdateView,
    TrainerDeleteView,
)

urlpatterns = [
    path("create/", TrainerCreateView.as_view(), name="trainer-create"),
    path("list/", TrainerListView.as_view(), name="trainer-list"),
    path("<int:pk>/", TrainerDetailView.as_view(), name="trainer-detail"),
    path("<int:pk>/update/", TrainerUpdateView.as_view(), name="trainer-update"),
    path("<int:pk>/delete/", TrainerDeleteView.as_view(), name="trainer-delete"),
]