import json
from django.shortcuts import get_object_or_404
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import RetrieveAPIView, UpdateAPIView, ListAPIView
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_201_CREATED, HTTP_200_OK
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
import logging

from .permissions import (
    MentorOnlyPermission,
    MentorOrAdminPermission,
    AdminOnlyPermission,
)
from .models import Category, Course, Lesson, Suggestion
from .serializers import (
    CategorySerializer,
    CourseUpdateSerializer,
    SubCategorySerializer,
    CourseDetailSerializer,
    CourseListCreateSerializer,
    CourseSuggestionSerializer,
    LessonSerializer,
)

# Create your views here.

logger = logging.getLogger(__name__)


class CategoryViewSet(ModelViewSet):
    """
    ViewSet for managing categories. Handles CRUD operations for both
    main categories and subcategories.
    """

    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class SubCategoryViewSet(ModelViewSet):
    """
    ViewSet for managing subcategories. This only includes categories that
    have a parent (i.e., subcategories).
    """

    queryset = Category.objects.filter(parent__isnull=False)
    serializer_class = SubCategorySerializer

    def perform_create(self, serializer):
        """
        Custom creation logic to ensure the parent category is correctly
        assigned to the subcategory.
        """
        parent_id = self.request.data.get("parent")
        # Ensure the parent category exists or raise a 404 error
        parent = get_object_or_404(Category, id=parent_id)
        serializer.save(parent=parent)

    def perform_update(self, serializer):
        """
        Custom update logic to handle updating the subcategory's parent if needed.
        """
        parent_id = self.request.data.get("parent")
        # Ensure the parent category exists or raise a 404 error
        parent = get_object_or_404(Category, id=parent_id)
        # Update the subcategory with the new parent category
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
    Only listing approved courses
    """

    permission_classes = [AllowAny]
    serializer_class = CourseListCreateSerializer
    queryset = Course.objects.filter(status="approved")


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

        if user.is_authenticated and user.is_superuser:
            return Course.objects.all()

        return Course.objects.none()


class CourseDetailView(RetrieveAPIView):
    """
    View only for retrieving the course details.
    Common for all users.
    """

    permission_classes = [AllowAny]
    serializer_class = CourseDetailSerializer

    def get_queryset(self):
        """
        Filter queryset to only include courses owned by the requesting mentor.
        Fetching all the courses for Admins.
        """
        user = self.request.user

        if user.is_authenticated and user.role == "mentor":
            return Course.objects.filter(mentor=user)

        return Course.objects.all()
    

class CourseSuggestionView(ModelViewSet):
    """
    Viewset for creating  Suggestions for courses.
    * Admins can create the suggestion
    """

    permission_classes = [AdminOnlyPermission]  # Custom permission
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

    def update(self, request, *args, **kwargs):
        print("Request user:", request.user)
        print("Request data:", request.data)
        return super().update(request, *args, **kwargs)


class LessonDataView(RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = LessonSerializer
    queryset = Lesson.objects.all()
