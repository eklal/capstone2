from rest_framework import serializers
from .models import TrainerProfile, Specialisation

class SpecialisationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialisation
        fields = ['id', 'name']

class TrainerProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    specialisations = SpecialisationSerializer(many=True)

    class Meta:
        model = TrainerProfile
        fields = [
            'id', 'user', 'profile_pic', 'first_name', 'last_name', 'email',
            'phone_number', 'city', 'state', 'years_of_experience', 'hourly_rate',
            'professional_title', 'bio', 'specialisations', 'certifications'
        ]

    def create(self, validated_data):
        specialisations_data = validated_data.pop('specialisations', [])
        trainer = TrainerProfile.objects.create(**validated_data)
        for spec_data in specialisations_data:
            spec, _ = Specialisation.objects.get_or_create(name=spec_data['name'])
            trainer.specialisations.add(spec)
        return trainer

    def update(self, instance, validated_data):
        specialisations_data = validated_data.pop('specialisations', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if specialisations_data is not None:
            instance.specialisations.clear()
            for spec_data in specialisations_data:
                spec, _ = Specialisation.objects.get_or_create(name=spec_data['name'])
                instance.specialisations.add(spec)
        instance.save()
        return instance
