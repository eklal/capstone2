from rest_framework import generics, permissions
from .models import TrainerProfile
from .serializers import TrainerProfileSerializer
from .common.permissions import IsTrainer

# 1. Trainer Create (by trainer themselves or admin)
class TrainerCreateView(generics.CreateAPIView):
    serializer_class = TrainerProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsTrainer]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# 2. List of all trainers (any authenticated user can see)
class TrainerListView(generics.ListAPIView):
    serializer_class = TrainerProfileSerializer
    queryset = TrainerProfile.objects.all()
    permission_classes = [permissions.IsAuthenticated]

# 3. Get trainer detail (by ID)
class TrainerDetailView(generics.RetrieveAPIView):
    serializer_class = TrainerProfileSerializer
    queryset = TrainerProfile.objects.all()
    permission_classes = [permissions.IsAuthenticated]

# 4. Update trainer details (only owner trainer or admin)
class TrainerUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = TrainerProfileSerializer
    queryset = TrainerProfile.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsTrainer]

    def get_object(self):
        # Only allow the trainer to update their own profile
        return TrainerProfile.objects.get(user=self.request.user)

# 5. Delete trainer (only owner trainer or admin)
class TrainerDeleteView(generics.DestroyAPIView):
    serializer_class = TrainerProfileSerializer
    queryset = TrainerProfile.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsTrainer]

    def get_object(self):
        return TrainerProfile.objects.get(user=self.request.user)
