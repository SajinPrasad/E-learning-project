from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import PurchasedCourse


class MentorOnlyPermission(BasePermission):
    """
    Custom permission which only allows mentors (owners) to create, edit,
    list or delete courses
    """

    def has_permission(self, request, view):
        # Allow access if the user is authenticated a mentor.
        return request.user.is_authenticated and request.user.role == "mentor"

    def has_object_permission(self, request, view, obj):
        # Allow access if the user is authenticated a mentor.
        return request.user.is_authenticated and request.user.role == "mentor"


class MentorOrAdminPermission(BasePermission):
    """
    Custom permission to allow only mentors (owners) and admins to
    create, edit, or delete Courses.
    """

    def has_permission(self, request, view):
        # Allow access if the user is authenticated and is either a mentor or an admin
        return request.user.is_authenticated and (
            request.user.role == "mentor" or request.user.is_superuser
        )

    def has_object_permission(self, request, view, obj):
        # Allow access if the user is the mentor of the course or is an admin
        return request.user.is_authenticated and (
            getattr(obj, "mentor", None) == request.user or request.user.is_superuser
        )


class IsCoursePurchased(BasePermission):
    """
    Custom permission to only allow access to purchased courses.
    """

    message = "You need to purchase this course to access it."

    def has_permission(self, request, view):
        return True  # We'll manage access on the object level

    def has_object_permission(self, request, view, obj):
        # `obj` will be the course instance
        if request.user.is_authenticated:
            # Check if the user has purchased the course
            return PurchasedCourse.objects.filter(
                user=request.user, course=obj
            ).exists()
        return False
