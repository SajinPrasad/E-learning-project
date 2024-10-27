from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK

from .serializers import CommentSerializer
from .models import Comment

# Create your views here.

User = get_user_model()


class CommentsViewSet(ModelViewSet):
    """
    Viewset for listing, retrieving, creating and updating Comments
    Only students are able to create comments.
    """

    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer

    def get_queryset(self):
        course_id = self.request.query_params.get("course_id")
        return Comment.objects.filter(course_id=course_id)


class ParentOrReplayCommentsListView(ListAPIView):
    """
    View for listing the parent comments or Replay comments.
    Initially in the comment box only parent comments are listed.
    If parent id is available in the query params, replies for that comment is fetched
    """

    permission_classes = [AllowAny]
    serializer_class = CommentSerializer

    def get_queryset(self):
        course_id = self.request.query_params.get("course_id")
        parent_id = self.request.query_params.get("parent_id", None)

        comments = []

        if parent_id:
            # Filtering the replay comments for the given parent
            comments = Comment.objects.filter(course_id=course_id, parent_id=parent_id)
        else:
            # Filtering the parent comments for a course
            comments = Comment.objects.filter(course_id=course_id).filter(
                parent_id=None
            )

        return comments


class ReplayCommentListView(ListAPIView):
    """ """

    permission_classes = [AllowAny]
    serializer_class = CommentsViewSet

    def get_queryset(self):
        course_id = self.request.query_params.get("course_id")
        parent_id = self.request.query_params.get("parent_id")


class ProfilePictureGetView(APIView):
    """
    View for returning the profile picture of a user.
    """

    permission_classes = [AllowAny]

    def get(self, request):
        user_id = request.query_params.get("user_id")

        user = get_object_or_404(User, id=user_id)

        profile_picture_url = None

        # Check if the user has a student or mentor profile with a picture
        if hasattr(user, "studentprofile") and user.studentprofile.profile_picture:
            profile_picture_url = user.studentprofile.profile_picture.url
        elif hasattr(user, "mentorprofile") and user.mentorprofile.profile_picture:
            profile_picture_url = user.mentorprofile.profile_picture.url
        else:
            profile_picture_url = None

        # Return the profile picture URL as JSON
        return Response(
            {"profile_picture_url": profile_picture_url}, status=HTTP_200_OK
        )
