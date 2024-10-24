from django.urls import path

from .consumers import CommentConsumer

websocket_urlpatterns = [
    path("ws/comments/course/<int:course_id>/", CommentConsumer.as_asgi()),
]