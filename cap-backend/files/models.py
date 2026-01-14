from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey


def file_upload_path(instance, filename):
    """Generate upload path based on file type"""
    if instance.file_type == "profile_pic":
        return f"uploads/profile_pictures/{filename}"
    elif instance.file_type == "certification":
        return f"uploads/certifications/{filename}"
    else:
        return f"uploads/other/{filename}"


class File(models.Model):
    # Generic relation to any model
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")

    file = models.FileField(upload_to=file_upload_path)
    file_type = models.CharField(
        max_length=50,
        choices=(
            ("profile_pic", "Profile Picture"),
            ("certification", "Certification"),
            ("other", "Other"),
        ),
        default="other"
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.file_type} - {self.file.name}"
