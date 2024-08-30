from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

# Register the viewsets with the router
router.register(r"categories", views.CategoryViewSet, basename="category")
router.register(r"subcategories", views.SubCategoryViewSet, basename="subcategory")
router.register(r"courses", views.CourseViewSet, basename="course")

urlpatterns = [
    path("", include(router.urls)),
]
