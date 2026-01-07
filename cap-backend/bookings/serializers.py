# bookings/serializers.py
from rest_framework import serializers
from .models import Booking
from users.models import User
from trainers.models import TrainerProfile
from django.core.mail import send_mail
from django.conf import settings

class BookingSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source="client.username", read_only=True)
    trainer_name = serializers.CharField(source="trainer.user.username", read_only=True)
    trainer_email = serializers.EmailField(source="trainer.user.email", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "client",
            "client_name",
            "trainer",
            "trainer_name",
            "trainer_email",
            "date",
            "start_time",
            "end_time",
            "status",
            "notes",
            "created_at"
        ]

    def validate(self, data):
        # Optional: validate end_time > start_time
        if data["end_time"] <= data["start_time"]:
            raise serializers.ValidationError("End time must be after start time.")

        # Check for overlapping bookings
        trainer = data["trainer"]
        date = data["date"]
        start_time = data["start_time"]
        end_time = data["end_time"]

        overlapping = Booking.objects.filter(
            trainer=trainer,
            date=date,
            start_time__lt=end_time,
            end_time__gt=start_time
        )
        if self.instance:
            overlapping = overlapping.exclude(pk=self.instance.pk)
        if overlapping.exists():
            raise serializers.ValidationError("This trainer is already booked for this time slot.")

        return data

    def create(self, validated_data):
        booking = super().create(validated_data)
        
        # Send notification email to trainer
        send_mail(
            subject=f"New booking from {booking.client.username}",
            message=f"You have a new booking on {booking.date} from {booking.start_time} to {booking.end_time}.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[booking.trainer.user.email],
            fail_silently=True
        )
        return booking
