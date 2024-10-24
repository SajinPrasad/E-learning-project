from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    CommentsViewSet,
    ProfilePictureGetView,
    ParentOrReplayCommentsListView,
)

router = DefaultRouter()

router.register(r"comments", CommentsViewSet, basename="comment")

urlpatterns = [
    path("", include(router.urls)),
    path("profile-picture/", ProfilePictureGetView.as_view(), name="profile-picture"),
    path(
        "parent-comments/",
        ParentOrReplayCommentsListView.as_view(),
        name="parent-comment",
    ),
]
