from django.shortcuts import get_object_or_404
from rest_framework import viewsets
import logging

from .permissions import IsMentor
from .models import Category, Course
from .serializers import CategorySerializer, CourseSerializer, SubCategorySerializer

# Create your views here.

logger = logging.getLogger(__name__)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing categories. Handles CRUD operations for both
    main categories and subcategories.
    """

    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class SubCategoryViewSet(viewsets.ModelViewSet):
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


class MentorCourseViewSet(viewsets.ModelViewSet):
    """
    Viewset for creating, updating and listing the courses.
    Only accessed by mentors. Using custom permission Class.
    """
    permission_classes = [IsMentor] # Custom Permission class.
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def perform_create(self, serializer):
        user = self.request.user

        serializer.save(mentor=user)

    def get_queryset(self):
        """
        Filter queryset to only include courses owned by the requesting mentor
        """
        if self.request.user.is_authenticated and self.request.user.role == "mentor":
            return Course.objects.filter(mentor=self.request.user)
        return Course.objects.none()
