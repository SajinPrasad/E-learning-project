from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ParentCategoryViewSet,
    CourseListCreateView,
    LessonDetailViewAdminMentorOrPurchasedStudent,
    SubCategoryViewSet,
    CourseSuggestionView,
    CourseDetailView,
    CourseUpdateView,
    LessonContentView,
    CourseListView,
    CourseSuggestionUpdateView,
    EnrolledCoursesListView,
    AuthenticatedCourseListView,
    CourseSearchView,
    CourseCategoryFilterView,
    AddNewLessonsView,
    PopularCoursesListView,
    AdminMentorCourseDetailView,
)

router = DefaultRouter()

# Register the viewsets with the router
router.register(r"parent-categories", ParentCategoryViewSet, basename="category")
router.register(r"subcategories", SubCategoryViewSet, basename="subcategory")
router.register(r"course/suggestions", CourseSuggestionView, basename="suggestion")

urlpatterns = [
    path("", include(router.urls)),
    path("course/<int:pk>/", CourseDetailView.as_view(), name="mentor-course-detail"),
    path(
        "course-update/<int:pk>/",
        CourseUpdateView.as_view(),
        name="course-update",
    ),
    path("course/", CourseListCreateView.as_view(), name="coursesample"),
    path("lesson-content/<int:pk>/", LessonContentView.as_view(), name="lesson-data"),
    path(
        "course/suggestion/<int:pk>/",
        CourseSuggestionUpdateView.as_view(),
        name="suggestion",
    ),
    path("courses/", CourseListView.as_view(), name="course"),
    path(
        "courses-authenticated/",
        AuthenticatedCourseListView.as_view(),
        name="courses-authenticated",
    ),
    path(
        "lesson/<int:pk>/",
        LessonDetailViewAdminMentorOrPurchasedStudent.as_view(),
        name="lesson-data",
    ),
    path("enrolledcourses/", EnrolledCoursesListView.as_view(), name="enrolledcourses"),
    path("course/search/", CourseSearchView.as_view(), name="course-search"),
    path(
        "course/category/filter/",
        CourseCategoryFilterView.as_view(),
        name="course-filter",
    ),
    path("create-lessons/", AddNewLessonsView.as_view(), name="create-lesson"),
    path("popular-courses/", PopularCoursesListView.as_view(), name="popular-course"),
    path(
        "admin-mentor-course/<int:pk>/",
        AdminMentorCourseDetailView.as_view(),
        name="admin-mentor-coursedetail",
    ),
]
