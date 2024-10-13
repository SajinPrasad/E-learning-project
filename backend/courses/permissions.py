from rest_framework.permissions import BasePermission, SAFE_METHODS

from .models import Enrollment, Course, Lesson


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
    Custom permission to only allow access to purchased courses or their lessons.
    """

    message = "You need to purchase this course to access it."

    def has_permission(self, request, view):
        # Allow permission checks to occur at the object level.
        return True

    def has_object_permission(self, request, view, obj):
        if request.user.is_authenticated:
            # If the object is a Lesson, retrieve the related Course.
            if isinstance(obj, Lesson):
                course = obj.course
            elif isinstance(obj, Course):
                course = obj
            else:
                # If the object is neither a Course nor a Lesson, deny access.
                return False

            # Check if the user has purchased the course.
            return Enrollment.objects.filter(user=request.user, course=course).exists()

        # If the user is not authenticated, deny access.
        return False
