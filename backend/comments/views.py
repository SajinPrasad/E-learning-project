from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound

from .serializers import CommentSerializer
from .models import Comment
from courses.models import Course

# Create your views here.


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
