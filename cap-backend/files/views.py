from rest_framework import generics, permissions
from .models import File
from .serializers import FileSerializer

class FileUploadView(generics.CreateAPIView):
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

class FileListView(generics.ListAPIView):
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        content_type_id = self.request.query_params.get("content_type")
        object_id = self.request.query_params.get("object_id")
        if content_type_id and object_id:
            return File.objects.filter(content_type_id=content_type_id, object_id=object_id)
        return File.objects.none()
