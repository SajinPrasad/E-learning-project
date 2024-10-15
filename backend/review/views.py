from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.exceptions import NotFound, PermissionDenied

from .serializers import ReviewSerializer, ReviewStatsSerializer
from .models import Review, CourseReviewStats
from courses.models import Course, Enrollment

# Create your views here.


class ReviewViewSet(ModelViewSet):
    """
    View for creating and updating reviews.
    Retrieving and listing the review only for the requested user.
    """

    permission_classes = [IsAuthenticated]
    serializer_class = ReviewSerializer

    def perform_create(self, serializer):
        user = self.request.user
        # Including user to the serializer for creating review
        serializer.save(user=user)

    def get_queryset(self):
        """
        Filter the review by the user for the course.
        """
        user = self.request.user
        course_id = self.request.query_params.get("course_id")

        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            raise NotFound(detail="Course not found")

        # Checks wether the user has enrolled the review and fetching the review
        if Enrollment.objects.filter(user=user, course=course).exists():
            return Review.objects.filter(user=user, course=course)
        else:
            # Raising permission denied error if user hasn't enrolled the course.
            raise PermissionDenied(detail="You are not enrolled this course.")


class ReviewListView(ListAPIView):
    """
    Listing all reviews except the review by
    the requested user if the user is authenticated.

    * Reviews owned by the requesting user are fetched by the ReviewViewSet.
    """

    permission_classes = [AllowAny]
    serializer_class = ReviewSerializer

    def get_queryset(self):
        user = self.request.user
        course_id = self.request.query_params.get("course_id")

        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            raise NotFound(detail="Course not found")

        # If the user is authenticated and enrolled the course, exclude their reviews
        if (
            user.is_authenticated
            and Enrollment.objects.filter(user=user, course=course).exists()
        ):
            return Review.objects.exclude(user=user).filter(course=course)

        # If user is not authenticated, return all reviews for the course
        return Review.objects.filter(course=course)


class ReviewStatsView(RetrieveAPIView):
    """
    View for returning the course rating, total reviews
    """

    permission_classes = [AllowAny]
    serializer_class = ReviewStatsSerializer

    def get_object(self):
        course_id = self.request.query_params.get("course_id")
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            raise NotFound(detail="Course not found")

        # Return the stats for the given course
        try:
            return CourseReviewStats.objects.get(course=course)
        except CourseReviewStats.DoesNotExist:
            return None
