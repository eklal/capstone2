from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from common.permissions import IsTrainer
from .models import TrainerProfile
from .serializers import TrainerCreateUpdateSerializer, TrainerReadSerializer

class TrainerCreateView(generics.CreateAPIView):
    serializer_class = TrainerCreateUpdateSerializer
    permission_classes = [IsAuthenticated, IsTrainer]

class TrainerListView(generics.ListAPIView):
    queryset = TrainerProfile.objects.select_related("user").prefetch_related("specialisations", "certifications")
    serializer_class = TrainerReadSerializer
    permission_classes = [AllowAny] 


class TrainerDetailView(generics.RetrieveAPIView):
    queryset = TrainerProfile.objects.select_related("user").prefetch_related("specialisations", "certifications")
    serializer_class = TrainerReadSerializer
    permission_classes = [AllowAny] 


class TrainerUpdateView(generics.UpdateAPIView):
    queryset = TrainerProfile.objects.all()
    serializer_class = TrainerCreateUpdateSerializer
    permission_classes = [IsAuthenticated, IsTrainer]

    def get_object(self):
        # Optional: allow trainer to update only their own profile
        obj = super().get_object()
        if self.request.user.role == "trainer" and obj.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only update your own trainer profile")
        return obj


class TrainerDeleteView(generics.DestroyAPIView):
    queryset = TrainerProfile.objects.all()
    permission_classes = [IsAuthenticated, IsTrainer]

    def get_object(self):
        obj = super().get_object()
        if self.request.user.role == "trainer" and obj.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only delete your own trainer profile")
        return obj
