from rest_framework import serializers
from .models import File
from django.contrib.contenttypes.models import ContentType

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ["id", "content_type", "object_id", "file", "file_type", "uploaded_at"]
        read_only_fields = ["uploaded_at"]

    def validate(self, attrs):
        # Ensure content_type exists
        try:
            ContentType.objects.get(id=attrs["content_type"].id)
        except ContentType.DoesNotExist:
            raise serializers.ValidationError("Invalid content_type")
        return attrs
