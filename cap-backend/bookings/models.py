# bookings/models.py
from django.db import models
from django.core.exceptions import ValidationError
from users.models import User
from trainers.models import TrainerProfile

class Booking(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
        ("completed", "Completed"),
    ]

    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bookings")
    trainer = models.ForeignKey(TrainerProfile, on_delete=models.CASCADE, related_name="bookings")
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date", "-start_time"]

    def __str__(self):
        return f"{self.client.username} -> {self.trainer.user.username} on {self.date} {self.start_time}"

    def clean(self):
        # Prevent overlapping bookings for same trainer
        overlapping = Booking.objects.filter(
            trainer=self.trainer,
            date=self.date,
            start_time__lt=self.end_time,
            end_time__gt=self.start_time
        )
        if self.pk:
            overlapping = overlapping.exclude(pk=self.pk)
        if overlapping.exists():
            raise ValidationError("This trainer is already booked for this time slot.")
