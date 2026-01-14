from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from users.models import User
from .models import TrainerProfile, Specialisation
from files.models import File


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ["id", "file", "uploaded_at"]


class SpecialisationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialisation
        fields = ["id", "name"]


class TrainerReadSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source="user.id", read_only=True)
    user_name = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    profile_pic = FileSerializer(read_only=True)
    certifications = serializers.SerializerMethodField()
    specialisations = SpecialisationSerializer(many=True, read_only=True)

    def get_certifications(self, obj):
        # Only return files with file_type="certification"
        cert_files = obj.certifications.filter(file_type="certification")
        return FileSerializer(cert_files, many=True).data

    class Meta:
        model = TrainerProfile
        fields = [
            "id",
            "user_id",
            "user_name",
            "email",
            "phone",
            "city",
            "state",
            "years_of_experience",
            "hourly_rate",
            "professional_title",
            "bio",
            "profile_pic",
            "certifications",
            "specialisations",
            "videos",
            "created_at",
        ]


class TrainerCreateUpdateSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(write_only=True)
    specialisations = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Specialisation.objects.all(), required=False
    )
    profile_pic_file = serializers.FileField(write_only=True, required=False)
    certificate_files = serializers.ListField(
        child=serializers.FileField(), write_only=True, required=False
    )
    videos = serializers.ListField(
        child=serializers.URLField(), write_only=True, required=False
    )

    class Meta:
        model = TrainerProfile
        exclude = ("user", "created_at")

    def create(self, validated_data):
        user_id = validated_data.pop("user_id")
        specialisations = validated_data.pop("specialisations", [])
        profile_pic_file = validated_data.pop("profile_pic_file", None)
        certificate_files = validated_data.pop("certificate_files", [])
        videos_data = validated_data.pop("videos", [])

        # Get user and validate
        user = User.objects.get(id=user_id)
        if user.role != "trainer":
            raise serializers.ValidationError("User is not a trainer")

        # Create trainer profile
        trainer = TrainerProfile.objects.create(user=user, **validated_data)
        trainer.specialisations.set(specialisations)
        trainer.videos = videos_data 

        trainer_content_type = ContentType.objects.get_for_model(TrainerProfile)

        # Profile pic (single)
        if profile_pic_file:
            file_instance = File.objects.create(
                file=profile_pic_file,
                file_type="profile_pic",  # Set file type
                content_type=trainer_content_type,
                object_id=trainer.id
            )
            trainer.profile_pic = file_instance
            trainer.save()

        # Certifications (multiple) using GenericRelation
        for f in certificate_files:
            File.objects.create(
                file=f,
                file_type="certification",  # Set file type
                content_type=trainer_content_type,
                object_id=trainer.id
            )

        return trainer

    def update(self, instance, validated_data):
        videos_data = validated_data.pop("videos", None)
        profile_pic_file = validated_data.pop("profile_pic_file", None)
        certificate_files = validated_data.pop("certificate_files", [])
        specialisations = validated_data.pop("specialisations", None)

        trainer_content_type = ContentType.objects.get_for_model(TrainerProfile)

        if videos_data is not None:
            instance.videos = videos_data 
            
        # Update profile pic
        if profile_pic_file:
            file_instance = File.objects.create(
                file=profile_pic_file,
                file_type="profile_pic",  # Set file type
                content_type=trainer_content_type,
                object_id=instance.id
            )
            instance.profile_pic = file_instance

        # Add new certifications (append)
        for f in certificate_files:
            File.objects.create(
                file=f,
                file_type="certification",  # Set file type
                content_type=trainer_content_type,
                object_id=instance.id
            )

        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        # Update specialisations
        if specialisations is not None:
            instance.specialisations.set(specialisations)

        return instance
