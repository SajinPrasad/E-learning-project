import json
from django.shortcuts import get_object_or_404
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import RetrieveAPIView, UpdateAPIView, ListAPIView
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_201_CREATED
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
import logging
from rest_framework.exceptions import PermissionDenied

from .permissions import (
    MentorOnlyPermission,
    MentorOrAdminPermission,
    IsCoursePurchased,
)
from .models import Category, Course, Enrollment, Lesson, Suggestion
from .serializers import (
    ParentCategorySerializer,
    CourseUpdateSerializer,
    SubCategorySerializer,
    CourseDetailSerializer,
    CourseListCreateSerializer,
    CourseSuggestionSerializer,
    LessonContentSerializer,
    LessonSerializer,
    CourseEnrollementSerializer,
)

# Create your views here.

logger = logging.getLogger(__name__)


class ParentCategoryViewSet(ModelViewSet):
    """
    ViewSet for managing categories. Handles CRUD operations for both
    main categories and subcategories.
    """

    queryset = Category.objects.filter(parent__isnull=True)
    serializer_class = ParentCategorySerializer

    def get_permissions(self):
        """
        Only admin can use methods otherthan "GET"
        """
        if self.request.method in ["GET"]:
            return [AllowAny()]
        return [IsAdminUser()]


class SubCategoryViewSet(ModelViewSet):
    """
    ViewSet for managing subcategories. This only includes categories that
    have a parent (i.e., subcategories).
    """

    queryset = Category.objects.filter(parent__isnull=False)
    serializer_class = SubCategorySerializer

    def get_permissions(self):
        """
        Only admin can use methods otherthan "GET"
        """
        if self.request.method in ["GET"]:
            return [AllowAny()]
        return [IsAdminUser()]

    def perform_create(self, serializer):
        """
        Custom creation logic to ensure the parent category is correctly
        assigned to the subcategory.
        """
        parent_id = self.request.data.get("parent")
        # Ensure the parent category exists or raise a 404 error
        parent = get_object_or_404(Category, id=parent_id)
        serializer.save(parent=parent)


class CourseListCreateView(APIView):
    """
    View for creating and listing courses.
    * Admin can list all the courses.
    * Mentor can list own courses.
    """

    permission_classes = [MentorOrAdminPermission]  # Custom Permission class.
    serializer_class = CourseListCreateSerializer

    def get(self, request):
        """
        Filters own courses for mentors.
        Fetches all the courses for admins.
        """
        user = request.user

        if user.is_superuser:
            courses = Course.objects.all()
        elif user.role == "mentor":
            courses = Course.objects.filter(mentor=user)

        serializer = self.serializer_class(
            courses, many=True, context={"request": request}
        )
        return Response(serializer.data)

    def post(self, request):
        """
        Fetching all the data from the request.
        Passing the data to the serializer.
        """
        try:
            # Extract request data and files
            data = request.data

            lessons_data = []  # For appending all the lessons for a single course
            index = 0

            # Fetching all the lesson data which is present in the request data.
            # Creating map with lesson data and appending to the array.
            while f"lessons[{index}][title]" in request.data:
                lesson_data = {
                    "title": request.data.get(f"lessons[{index}][title]"),
                    "content": request.data.get(f"lessons[{index}][content]"),
                    "order": request.data.get(f"lessons[{index}][order]"),
                    "video_file": request.FILES.get(f"lessons[{index}][video_file]"),
                }
                lessons_data.append(lesson_data)
                index += 1

            # Course data for passing to the serializer.
            course_data = {
                "title": data.get("title"),
                "description": data.get("description"),
                "category": data.get("category"),
                "preview_image": request.FILES.get("preview_image"),
                "mentor": request.user.id,
                "status": "pending",
                "lessons": lessons_data,
                "requirements": json.loads(data.get("requirements", "{}")),
                "price": {"amount": data.get("price_amount")},
            }

            # Serialize the data
            serializer = self.serializer_class(
                data=course_data, context={"request": request}
            )

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.error(f"Error occurred: {e}")
            return Response({"error": str(e)}, status=HTTP_400_BAD_REQUEST)


class CourseListView(ListAPIView):
    """
    Public course listing view.
    Only listing approved courses where categories and parent categories are active.
    """

    permission_classes = [AllowAny]
    serializer_class = CourseListCreateSerializer

    def get_queryset(self):
        queryset = Course.objects.filter(status="approved")

        # Filter out courses whose categories or their ancestors are inactive
        return [course for course in queryset if course.category.is_active_recursive()]


class AuthenticatedCourseListView(ListAPIView):
    """
    View accessed only by authenticated student users.
    Filtering the category wchich are active and approved courses.
    """

    permission_classes = [IsAuthenticated]
    serializer_class = CourseListCreateSerializer

    def get_queryset(self):
        user = self.request.user

        # If the user is authenticated, filter out the courses they are enrolled in
        if user.is_authenticated:
            enrolled_courses_ids = Enrollment.objects.filter(user=user).values_list(
                "course", flat=True
            )

            queryset = Course.objects.filter(status="approved").exclude(
                id__in=enrolled_courses_ids
            )

            return [
                course for course in queryset if course.category.is_active_recursive()
            ]

        queryset = Course.objects.filter(status="approved")

        # Filter out courses whose categories or their ancestors are inactive
        return [course for course in queryset if course.category.is_active_recursive()]


class CourseUpdateView(UpdateAPIView):
    """
    Updating the course details and related objects except Lessons.
    """

    pagination_class = [MentorOrAdminPermission]  # Custom permission class.
    serializer_class = CourseUpdateSerializer

    def get_queryset(self):
        """
        Filter queryset to only include courses owned by the requesting mentor.
        Fetching all the courses for Admins.
        """
        user = self.request.user

        if user.is_authenticated and user.role == "mentor":
            return Course.objects.filter(mentor=user)

        if user.is_superuser:
            return Course.objects.all()

        return Course.objects.none()


class CourseDetailView(RetrieveAPIView):
    """
    View only for retrieving the course details.
    Common for all users.
    """

    permission_classes = [AllowAny]
    serializer_class = CourseDetailSerializer

    def get_object(self):
        course_id = self.kwargs.get("pk")
        user = self.request.user

        if user.is_authenticated and user.role == "mentor":
            # Mentor can only access their own courses if the category is active
            queryset = Course.objects.filter(mentor=user)
            course = get_object_or_404(queryset, pk=course_id)
            if not course.category.is_active_recursive():
                raise PermissionDenied("You don't have permission to access this course.")
        
        elif user.is_superuser:
            # Admins can access any course but it must have active categories
            queryset = Course.objects.all()
            course = get_object_or_404(queryset, pk=course_id)
            if not course.category.is_active_recursive():
                raise PermissionDenied("This course is not available.")
        
        else:
            # General users can access approved courses with active categories
            queryset = Course.objects.filter(status="approved")
            course = get_object_or_404(queryset, pk=course_id)
            if not course.category.is_active_recursive():
                raise PermissionDenied("This course is not available.")
        
        return course


class LessonContentView(RetrieveAPIView):
    """
    Acessed by all users.
    Specifically for displaying lesson content publically.
    Video not included.
    """

    permission_classes = [AllowAny]
    serializer_class = LessonContentSerializer

    # Filtering the course only for the purticular course
    def get_queryset(self):
        course_id = self.request.query_params.get("course_id")
        return Lesson.objects.filter(course__id=course_id)


class LessonDetailViewAdminMentorOrPurchasedStudent(RetrieveAPIView):
    """
    Accessed by admins, mentors and students for lesson retrieval.
    * Admins and mentors who created the course can access the lesson data.
    * Students who purchased the course can access the lesson data.
    """

    serializer_class = LessonSerializer

    def get_permissions(self):
        user = self.request.user

        if user.role == "mentor":  # For Mentor user
            return [MentorOnlyPermission()]  # Custom permission
        elif user.is_superuser:
            return [IsAdminUser()]  # For Admin user
        else:
            # return [IsCoursePurchased()]  # Custom permission
            return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        course_id = self.request.query_params.get("course_id")

        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return None  # Handle the case when the course doesn't exist

        if user.is_superuser:
            return Lesson.objects.filter(course=course)

        elif user.role == "student":
            if Enrollment.objects.filter(user=user, course=course).exists():
                print("User enrolled the course: ", course)
                return Lesson.objects.filter(course=course)
            else:
                return None

        elif user.role == "mentor":
            if course.mentor == user:
                return Lesson.objects.filter(course=course)
            else:
                return None


class CourseSuggestionView(ModelViewSet):
    """
    Viewset for creating  Suggestions for courses.
    * Admins can create the suggestion
    """

    permission_classes = [IsAdminUser]  # Custom permission
    serializer_class = CourseSuggestionSerializer
    queryset = Suggestion.objects.all()

    def perform_create(self, serializer):
        serializer.save(admin=self.request.user)


class CourseSuggestionUpdateView(UpdateAPIView):
    """
    View for the status of suggestions for courses.
    * Mentors can update the completion status (is_done)
    """

    permission_classes = [MentorOnlyPermission]  # Custom permission
    serializer_class = CourseSuggestionSerializer
    queryset = Suggestion.objects.all()


class EnrolledCoursesListView(ListAPIView):
    serializer_class = CourseEnrollementSerializer
    permission_classes = [IsAuthenticated, IsCoursePurchased]

    def get_queryset(self):
        print(
            "User auth in enrolled caurse: ",
            self.request.user,
            self.request.user.is_authenticated,
        )
        return Enrollment.objects.filter(user=self.request.user, is_active=True)
