from django.db import models
from django.contrib.contenttypes.fields import GenericRelation
from users.models import User
from files.models import File

class TrainerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=20)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    years_of_experience = models.IntegerField(default=0)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2)
    professional_title = models.CharField(max_length=255, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    profile_pic = models.ForeignKey(File, on_delete=models.SET_NULL, null=True, blank=True, related_name="profile_pic_for")
    specialisations = models.ManyToManyField('Specialisation', blank=True)
    
    # Use GenericRelation for multiple files (certifications)
    certifications = GenericRelation(File, related_query_name="trainer_certifications")
    videos = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username

class Specialisation(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
