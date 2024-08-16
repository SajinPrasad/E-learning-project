from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, SubCategoryViewSet

# Initialize the router
router = DefaultRouter()

# Register the viewsets with the router
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"subcategories", SubCategoryViewSet, basename="subcategory")

# Include the router's URLs in the urlpatterns
urlpatterns = [
    path("category/", include(router.urls)),
]
