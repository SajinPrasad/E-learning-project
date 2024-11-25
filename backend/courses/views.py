import json
from django.shortcuts import get_object_or_404
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import (
    RetrieveAPIView,
    UpdateAPIView,
    ListAPIView,
    RetrieveUpdateAPIView,
)
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_201_CREATED
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
import logging
from rest_framework.exceptions import PermissionDenied, NotFound
from django.db.models import Q
from django.db.models import Count
from rest_framework.pagination import PageNumberPagination

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
    LessonUpdateCreateSerializer,
)

# Create your views here.

logger = logging.getLogger(__name__)


class CoursePagination(PageNumberPagination):
    page_size = 15  # Number of courses per page
    page_size_query_param = "page_size"


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
            courses = Course.objects.filter(is_deleted=False)
        elif user.role == "mentor":
            courses = Course.objects.filter(mentor=user, is_deleted=False)

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
    pagination_class = CoursePagination

    def get_queryset(self):
        queryset = Course.objects.filter(status="approved", is_deleted=False)

        # Filter out courses whose categories or their ancestors are inactive
        return [course for course in queryset if course.category.is_active_recursive()]


class AuthenticatedCourseListView(ListAPIView):
    """
    View accessed only by authenticated student users.
    Filtering the category wchich are active and approved courses.
    """

    permission_classes = [IsAuthenticated]
    serializer_class = CourseListCreateSerializer
    pagination_class = CoursePagination

    def get_queryset(self):
        user = self.request.user

        # If the user is authenticated, filter out the courses they are enrolled in
        if user.is_authenticated:
            enrolled_courses_ids = Enrollment.objects.filter(user=user).values_list(
                "course", flat=True
            )

            queryset = Course.objects.filter(
                status="approved", is_deleted=False
            ).exclude(id__in=enrolled_courses_ids)

            return [
                course for course in queryset if course.category.is_active_recursive()
            ]

        queryset = Course.objects.filter(status="approved", is_deleted=False)

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
            return Course.objects.filter(mentor=user, is_deleted=False)

        if user.is_superuser:
            return Course.objects.filter(is_deleted=False)

        return Course.objects.none()


class CourseDetailView(RetrieveAPIView):
    """
    View only for retrieving the course details.
    For students only.
    """

    permission_classes = [AllowAny]
    serializer_class = CourseDetailSerializer

    def get_object(self):
        course_id = self.kwargs.get("pk")

        queryset = Course.objects.filter(is_deleted=False, status="approved")
        course = get_object_or_404(queryset, pk=course_id)

        return course


class AdminMentorCourseDetailView(RetrieveAPIView):
    """
    View only for retrieving the course details.
    Only for admins and mentors.
    """

    serializer_class = CourseDetailSerializer
    permission_classes = [MentorOrAdminPermission]

    def get_object(self):
        course_id = self.kwargs.get("pk")
        user = self.request.user

        if user.is_superuser:
            # Admins can access any course but it must have active categories
            queryset = Course.objects.filter(is_deleted=False)
            course = get_object_or_404(queryset, pk=course_id)
            if not course.category.is_active_recursive():
                raise PermissionDenied("This course is not available.")

        elif user.role == "mentor":
            # Mentor can only access their own courses if the category is active
            queryset = Course.objects.filter(mentor=user)
            course = get_object_or_404(queryset, pk=course_id)
            if not course.category.is_active_recursive():
                raise PermissionDenied(
                    "You don't have permission to access this course."
                )

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


class LessonDetailViewAdminMentorOrPurchasedStudent(RetrieveUpdateAPIView):
    """
    Accessed by admins, mentors, and students for lesson retrieval.
    * Admins and mentors who created the course can access the lesson data.
    * Mentors can update the lessons
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
            return [IsCoursePurchased()]  # Custom permission

    def get_queryset(self):
        user = self.request.user
        course_id = self.request.query_params.get("course_id")

        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            raise NotFound({"detail": "Course not found"})  # Return a 404 response

        if user.is_superuser:
            return Lesson.objects.filter(course=course)

        elif user.role == "student":
            if Enrollment.objects.filter(user=user, course=course).exists():
                return Lesson.objects.filter(course=course)
            else:
                raise PermissionDenied(
                    {"detail": "You have not purchased this course"}
                )  # Return 403 if not enrolled

        elif user.role == "mentor":
            if course.mentor == user:
                return Lesson.objects.filter(course=course)
            else:
                raise PermissionDenied(
                    {"detail": "You are not permitted to access these lessons"}
                )  # Return 403 for unauthorized mentor


class AddNewLessonsView(APIView):
    """
    View for adding New lessons for purticular courses.
    * Only accessible by mentors
    """

    permission_classes = [MentorOnlyPermission]
    serializer_class = LessonUpdateCreateSerializer

    def post(self, request):
        course_id = request.data.get("course_id")

        lessons_data = []  # For appending all the lessons for a single course
        index = 0

        # Fetching all the lesson data which is present in the request data.
        # Creating map with lesson data and appending to the array.
        while f"lessons[{index}][title]" in request.data:
            lesson_data = {
                "title": request.data.get(f"lessons[{index}][title]"),
                "content": request.data.get(f"lessons[{index}][content]"),
                "video_file": request.FILES.get(f"lessons[{index}][video_file]"),
            }
            lessons_data.append(lesson_data)
            index += 1

        # Ensure course exists
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            raise NotFound("Course not found")

        if course:
            if not course.mentor == request.user:
                raise PermissionDenied("You are not permitted to edit this course")

        # Get the current max order number for the given course
        current_order = Lesson.objects.filter(course=course).order_by("-order").first()
        current_order = current_order.order if current_order else 0

        created_lessons = []
        for lesson_data in lessons_data:
            current_order += 1
            lesson_data = {
                "course": course.id,  # Use course id for serialization
                "order": current_order,
                **lesson_data,
            }

            # Initialize the serializer with the data
            serializer = self.serializer_class(data=lesson_data)

            # Validate the data
            if serializer.is_valid():
                # Save the lesson
                serializer.save()
                created_lessons.append(serializer.data)
            else:
                # If one of the lessons has invalid data, return a 400 response
                return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

        # Return the list of created lessons upon success
        return Response({"lessons": created_lessons}, status=HTTP_201_CREATED)


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
    """
    Listing the enrolled courses for liggined users.
    * Using custom permission to check whether the user purchased the course or not.
    """

    serializer_class = CourseEnrollementSerializer
    permission_classes = [IsAuthenticated, IsCoursePurchased]

    def get_queryset(self):
        return Enrollment.objects.filter(user=self.request.user, is_active=True)


# class CourseSearchView(ListAPIView):
#     permission_classes = [AllowAny]
#     serializer_class = CourseSearchSerializer

#     def get_queryset(self):
#         query = self.request.GET.get("q")

#         if query:
#             return CourseDocument.search().query(
#                 "multi_match",
#                 query=query,
#                 fields=[
#                     "title",
#                     "description",
#                     "category.name",
#                     "category.description",
#                 ],
#             )
#         else:
#             return CourseDocument.search().all()


class CourseSearchView(ListAPIView):
    """
    View for searching the courses according to the keyword fetched from url.
    """

    permission_classes = [AllowAny]
    serializer_class = CourseListCreateSerializer

    def get_queryset(self):
        query = self.request.query_params.get("q", None)
        user = self.request.user

        if query:
            if user.is_authenticated:
                if user.role == "admin":
                    queryset = Course.objects.filter(is_deleted=False).filter(
                        Q(title__icontains=query)
                        | Q(description__icontains=query)
                        | Q(category__name__icontains=query)
                        | Q(category__description__icontains=query)
                    )

                elif user.role == "mentor":
                    queryset = Course.objects.filter(
                        mentor=user, is_deleted=False
                    ).filter(
                        Q(title__icontains=query)
                        | Q(description__icontains=query)
                        | Q(category__name__icontains=query)
                        | Q(category__description__icontains=query)
                    )
                else:
                    # For student users excluding the enrolled courses.
                    enrolled_courses_ids = Enrollment.objects.filter(
                        user=user
                    ).values_list("course", flat=True)

                    queryset = (
                        Course.objects.filter(status="approved", is_deleted=False)
                        .filter(
                            Q(title__icontains=query)
                            | Q(description__icontains=query)
                            | Q(category__name__icontains=query)
                            | Q(category__description__icontains=query)
                        )
                        .exclude(id__in=enrolled_courses_ids)
                    )

                return [
                    course
                    for course in queryset
                    if course.category.is_active_recursive()
                ]

            queryset = Course.objects.filter(
                status="approved", is_deleted=False
            ).filter(
                Q(title__icontains=query)
                | Q(description__icontains=query)
                | Q(category__name__icontains=query)
                | Q(category__description__icontains=query)
            )

            return [
                course for course in queryset if course.category.is_active_recursive()
            ]
        else:
            return Course.objects.none()


class CourseCategoryFilterView(ListAPIView):
    """
    Filtering courses according to the category.
    Fetching the category name from url.
    """

    permission_classes = [AllowAny]
    serializer_class = CourseListCreateSerializer

    def get_queryset(self):
        user = self.request.user
        category_name = self.request.query_params.get("category", None)

        if category_name:
            try:
                category = Category.objects.get(name=category_name)
            except Category.DoesNotExist:
                raise ValueError("Category not found")

            # Get all subcategories recursively
            def get_subcategories(cat):
                subcats = list(cat.subcategories.all())
                for subcat in subcats:
                    subcats.extend(get_subcategories(subcat))
                return subcats

            # Include the main category and all its subcategories
            categories = [category] + get_subcategories(category)

            if user.is_authenticated:
                if user.role == "admin":
                    queryset = Course.objects.filter(
                        category__in=categories,
                    )
                elif user.role == "mentor":
                    queryset = Course.objects.filter(
                        mentor=user,
                        category__in=categories,
                    )
                else:
                    enrolled_courses_ids = Enrollment.objects.filter(
                        user=user
                    ).values_list("course", flat=True)
                    queryset = Course.objects.filter(
                        status="approved",
                        is_deleted=False,
                        category__in=categories,
                    ).exclude(id__in=enrolled_courses_ids)
            else:
                queryset = Course.objects.filter(
                    status="approved",
                    is_deleted=False,
                    category__in=categories,
                )

            return [
                course for course in queryset if course.category.is_active_recursive()
            ]
        else:
            return Course.objects.none()


class PopularCoursesListView(ListAPIView):
    """
    View for filtering the popular courses.
    Fetching the top 10 courses only.
    """

    permission_classes = [AllowAny]
    serializer_class = CourseListCreateSerializer

    def get_queryset(self):
        # Filter out courses that are not approved, deleted, or have no enrollments
        queryset = Course.objects.filter(
            status="approved", is_deleted=False, enrollments__isnull=False
        ).distinct()

        # Filter based on active categories by ensuring the category or any ancestor is active
        queryset = queryset.filter(category__is_active=True)

        # Exclude courses that the authenticated user has already purchased
        user = self.request.user
        if user.is_authenticated:
            queryset = queryset.exclude(enrollments__user=user)

        # Annotate with enrollment count and order by it in descending order, limiting to top 10
        return queryset.annotate(total_enrollments=Count("enrollments")).order_by(
            "-total_enrollments"
        )[:10]
