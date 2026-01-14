from django.urls import path
from .views import (
    TrainerCreateView,
    TrainerListView,
    TrainerDetailView,
    TrainerUpdateView,
    TrainerDeleteView,
    SpecialisationListView,
    FeaturedTrainersView,
    MyTrainerProfileView,
)

urlpatterns = [
    path("create/", TrainerCreateView.as_view(), name="trainer-create"),
    path("list/", TrainerListView.as_view(), name="trainer-list"),
    path("featured/", FeaturedTrainersView.as_view(), name="featured-trainers"),
    path("specialisations/", SpecialisationListView.as_view(), name="specialisations-list"),
    path("me/", MyTrainerProfileView.as_view(), name="my-trainer-profile"),
    path("<int:pk>/", TrainerDetailView.as_view(), name="trainer-detail"),
    path("<int:pk>/update/", TrainerUpdateView.as_view(), name="trainer-update"),
    path("<int:pk>/delete/", TrainerDeleteView.as_view(), name="trainer-delete"),
]