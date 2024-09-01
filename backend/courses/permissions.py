from rest_framework.permissions import BasePermission


class IsMentor(BasePermission):
    """
    Custom permission to only allow mentors (owners) to create, edit, or delete Courses.
    """

    def has_permission(self, request, view):
        # Check if the user is authenticated and is a mentor
        return request.user.is_authenticated and request.user.role == "mentor"

    def has_object_permission(self, request, view, obj):
        # Check if the user is a mentor
        return (
            request.user.is_authenticated
            and request.user.role == "mentor"
            and obj.mentor == request.user
        )
