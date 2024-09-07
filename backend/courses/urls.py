from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

# Register the viewsets with the router
router.register(r"categories", views.CategoryViewSet, basename="category")
router.register(r"subcategories", views.SubCategoryViewSet, basename="subcategory")

urlpatterns = [
    path("", include(router.urls)),
    path(
        "course/<int:pk>/", views.MentorCourseDetailView.as_view(), name="course-detail"
    ),
    path("courses/", views.CourseListCreateView.as_view(), name="coursesample"),
]
