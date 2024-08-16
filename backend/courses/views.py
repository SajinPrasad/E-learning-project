from django.shortcuts import get_object_or_404
from rest_framework import viewsets

from .models import Category
from .serializers import CategorySerializer, SubCategorySerializer

# Create your views here.


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
        # Save the subcategory with the parent category
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
