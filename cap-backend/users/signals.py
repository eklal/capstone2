from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User


@receiver(post_save, sender=User)
def create_trainer_profile(sender, instance, created, **kwargs):
    """
    Automatically create a TrainerProfile when a User with role 'trainer' is created.
    """
    if created and instance.role == "trainer":
        from trainers.models import TrainerProfile
        
        # Check if profile doesn't already exist
        if not hasattr(instance, 'trainerprofile'):
            TrainerProfile.objects.create(
                user=instance,
                phone="",  # Empty, to be filled by trainer
                city="",
                state="",
                years_of_experience=0,
                hourly_rate=0.00,
                professional_title="",
                bio="",
            )
