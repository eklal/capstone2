from django.db import models
from django.conf import settings

class TrainerProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    profile_pic = models.ImageField(upload_to="trainer_profiles/", null=True, blank=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField()
    phone_number = models.CharField(max_length=20)
    city = models.CharField(max_length=50, blank=True)
    state = models.CharField(max_length=50, blank=True)
    years_of_experience = models.IntegerField(null=True, blank=True)
    hourly_rate = models.DecimalField(max_digits=8, decimal_places=2)
    professional_title = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    specialisations = models.ManyToManyField('Specialisation', blank=True)
    certifications = models.FileField(upload_to='trainer_certifications/', null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.professional_title or 'Trainer'}"


class Specialisation(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name
