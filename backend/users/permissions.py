from rest_framework.permissions import BasePermission


class IsProfileOwner(BasePermission):
    """
    Custom permission to only allow owners of a profile to view or edit it.

    This permission:
    1. Ensures the request is from an authenticated user.
    2. For object-level permissions, verifies the authenticated user owns the profile.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Check if the user is authenticated and owns the profile
        return request.user.is_authenticated and obj.user == request.user
