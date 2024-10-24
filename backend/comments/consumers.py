# comment/consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from asgiref.sync import sync_to_async
from django.contrib.auth import get_user_model
from rest_framework.exceptions import NotFound
from channels.exceptions import StopConsumer
import logging

from .models import Comment
from courses.models import Course

User = get_user_model()
logger = logging.getLogger(__name__)


class CommentConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer to handle comments for a course.
    Manages connection, message receiving, and broadcasting comments to the group.
    """

    async def connect(self):
        """
        Handle WebSocket connection and join a room based on the course_id.
        """
        try:
            request_user = self.scope["user"]

            if not request_user.is_authenticated:
                # Close connection if user is not authenticated
                await self.close()
                return

            # Get the course ID from the URL route
            self.course_id = self.scope["url_route"]["kwargs"]["course_id"]
            self.room_group_name = f"comments_{self.course_id}"

            # Ensure the channel layer is available
            if not hasattr(self, "channel_layer"):
                await self.close()
                return

            # Add the user to the course comment room group
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.accept()  # Accept the WebSocket connection

        except Exception as e:
            """Log the error and close connection if issues occur during the connection process."""
            await self.close()
            raise StopConsumer()  # Terminate the consumer on error

    async def disconnect(self, code):
        """
        Handle WebSocket disconnection. Removes the user from the comment room group.
        """
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        """
        Handle incoming comments from the WebSocket, save the comment to the database,
        and broadcast it to the course comment group.
        """
        try:
            data = json.loads(text_data)
            comment_text = data["comment"]
            user = self.scope["user"]

            # Save the comment to the database
            comment = await self.create_comment(user.id, self.course_id, comment_text)

            # Broadcast the comment to the room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "comment_message",
                    "comment": comment_text,
                    "user_id": user.id,
                    "user_fullname": user.get_full_name(),
                    "timestamp": comment.created_at.isoformat(),
                    "course_id": self.course_id,
                },
            )
        except Exception as e:
            """Log the error if any issues occur during message reception or processing."""
            logger.error(f"Error in receive: {str(e)}")

    async def comment_message(self, event):
        """
        Send the received comment message to the WebSocket.
        """
        await self.send(
            text_data=json.dumps(
                {
                    "comment": event["comment"],
                    "user_id": event["user_id"],
                    "user_fullname": event["user_fullname"],
                    "timestamp": event["timestamp"],
                    "course_id": event["course_id"],
                }
            )
        )

    @sync_to_async
    def create_comment(self, user_id, course_id, comment_text):
        """
        Create and save a comment to the database asynchronously.
        """
        try:
            user = User.objects.get(id=user_id)
            course = Course.objects.get(id=course_id)
        except (User.DoesNotExist, Course.DoesNotExist):
            raise NotFound("User or Course not found")

        return Comment.objects.create(user=user, course=course, comment=comment_text)
