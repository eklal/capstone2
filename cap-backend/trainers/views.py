from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from django.db.models import Q
from common.permissions import IsTrainer
from .models import TrainerProfile, Specialisation
from .serializers import TrainerCreateUpdateSerializer, TrainerReadSerializer


class TrainerPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50

    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number,
            'page_size': self.page_size,
            'data': data,
            'pagination': {
                'currentPage': self.page.number,
                'totalPages': self.page.paginator.num_pages,
                'totalResults': self.page.paginator.count,
                'hasNextPage': self.page.has_next(),
                'hasPrevPage': self.page.has_previous(),
            }
        })


class TrainerCreateView(generics.CreateAPIView):
    serializer_class = TrainerCreateUpdateSerializer
    permission_classes = [IsAuthenticated, IsTrainer]


class TrainerListView(generics.ListAPIView):
    serializer_class = TrainerReadSerializer
    permission_classes = [AllowAny]
    pagination_class = TrainerPagination

    def get_queryset(self):
        queryset = TrainerProfile.objects.select_related("user").prefetch_related(
            "specialisations", "certifications"
        )

        # Filters
        location = self.request.query_params.get('location')
        specialties = self.request.query_params.getlist('specialties[]')
        price_min = self.request.query_params.get('priceMin')
        price_max = self.request.query_params.get('priceMax')
        exp_min = self.request.query_params.get('expMin')
        exp_max = self.request.query_params.get('expMax')
        sort_by = self.request.query_params.get('sortBy', 'relevance')

        # Location filter (city or state)
        if location:
            queryset = queryset.filter(
                Q(city__icontains=location) | Q(state__icontains=location)
            )

        # Specialties filter
        if specialties:
            queryset = queryset.filter(specialisations__name__in=specialties).distinct()

        # Price range filter
        if price_min:
            queryset = queryset.filter(hourly_rate__gte=float(price_min))
        if price_max:
            queryset = queryset.filter(hourly_rate__lte=float(price_max))

        # Experience filter
        if exp_min:
            queryset = queryset.filter(years_of_experience__gte=int(exp_min))
        if exp_max:
            queryset = queryset.filter(years_of_experience__lte=int(exp_max))

        # Sorting
        if sort_by == 'price_asc':
            queryset = queryset.order_by('hourly_rate')
        elif sort_by == 'price_desc':
            queryset = queryset.order_by('-hourly_rate')
        elif sort_by == 'rating':
            # TODO: Add rating field or calculate from reviews
            queryset = queryset.order_by('-created_at')
        else:  # relevance (default)
            queryset = queryset.order_by('-created_at')

        return queryset 


class TrainerDetailView(generics.RetrieveAPIView):
    queryset = TrainerProfile.objects.select_related("user").prefetch_related("specialisations", "certifications")
    serializer_class = TrainerReadSerializer
    permission_classes = [AllowAny] 


class TrainerUpdateView(generics.UpdateAPIView):
    queryset = TrainerProfile.objects.all()
    serializer_class = TrainerCreateUpdateSerializer
    permission_classes = [IsAuthenticated, IsTrainer]

    def get_object(self):
        # Optional: allow trainer to update only their own profile
        obj = super().get_object()
        if self.request.user.role == "trainer" and obj.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only update your own trainer profile")
        return obj


class TrainerDeleteView(generics.DestroyAPIView):
    queryset = TrainerProfile.objects.all()
    permission_classes = [IsAuthenticated, IsTrainer]

    def get_object(self):
        obj = super().get_object()
        if self.request.user.role == "trainer" and obj.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only delete your own trainer profile")
        return obj


class SpecialisationListView(generics.ListAPIView):
    """List all available specialisations"""
    queryset = Specialisation.objects.all().order_by('name')
    permission_classes = [AllowAny]
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = [{"id": spec.id, "name": spec.name} for spec in queryset]
        return Response(data)


class FeaturedTrainersView(generics.ListAPIView):
    """Get featured trainers (top rated/experienced)"""
    serializer_class = TrainerReadSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        # Get top trainers based on experience and hourly rate
        # You can modify this logic to use ratings when you add a rating field
        queryset = TrainerProfile.objects.select_related("user").prefetch_related(
            "specialisations", "certifications"
        ).order_by('-years_of_experience', '-hourly_rate')[:6]  # Get top 6 trainers
        
        return queryset
