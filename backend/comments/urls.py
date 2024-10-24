from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import CommentsViewSet, ProfilePictureGetView

router = DefaultRouter()

router.register(r"comments", CommentsViewSet, basename="comment")

urlpatterns = [
    path("", include(router.urls)),
    path("profile-picture/", ProfilePictureGetView.as_view(), name="profile-picture"),
]
