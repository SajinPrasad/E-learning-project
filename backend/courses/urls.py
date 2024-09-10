from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

# Register the viewsets with the router
router.register(r"categories", views.CategoryViewSet, basename="category")
router.register(r"subcategories", views.SubCategoryViewSet, basename="subcategory")
router.register(
    r"course/suggestions", views.CourseSuggestionView, basename="suggestion"
)

urlpatterns = [
    path("", include(router.urls)),
    path("course/<int:pk>/", views.CourseDetailView.as_view(), name="mentor-course-detail"),
    path(
        "course-update/<int:pk>/",
        views.CourseUpdateView.as_view(),
        name="course-update",
    ),
    path("course/", views.CourseListCreateView.as_view(), name="coursesample"),
    path("lesson/<int:pk>/", views.LessonDataView.as_view(), name="lesson-data"),
    path(
        "course/suggestion/<int:pk>/",
        views.CourseSuggestionUpdateView.as_view(),
        name="suggestion",
    ),
    path("courses/", views.CourseListView.as_view(), name="course"),
]
