from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "admin"

class IsTrainer(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "trainer"

class IsClient(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "client"

class IsBookingOwnerOrTrainerOrAdmin(BasePermission):

    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.role == "admin":
            return True
        if user.role == "trainer" and obj.trainer.user == user:
            return True
        if user.role == "client" and obj.client == user:
            return True
        return False
