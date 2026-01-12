# bookings/models.py
from django.db import models
from django.core.exceptions import ValidationError
from users.models import User
from trainers.models import TrainerProfile


class Availability(models.Model):
    DAYS_OF_WEEK = [
        ("monday", "Monday"),
        ("tuesday", "Tuesday"),
        ("wednesday", "Wednesday"),
        ("thursday", "Thursday"),
        ("friday", "Friday"),
        ("saturday", "Saturday"),
        ("sunday", "Sunday"),
    ]

    trainer = models.ForeignKey(TrainerProfile, on_delete=models.CASCADE, related_name="availability")
    day_of_week = models.CharField(max_length=10, choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["day_of_week", "start_time"]
        verbose_name_plural = "Availabilities"
        unique_together = ["trainer", "day_of_week", "start_time", "end_time"]

    def __str__(self):
        return f"{self.trainer.user.username} - {self.day_of_week} {self.start_time}-{self.end_time}"

    def clean(self):
        if self.end_time <= self.start_time:
            raise ValidationError("End time must be after start time")


class Booking(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
        ("completed", "Completed"),
    ]

    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bookings")
    trainer = models.ForeignKey(TrainerProfile, on_delete=models.CASCADE, related_name="bookings")
    session_type = models.CharField(max_length=100, default="Personal Training")
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

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
