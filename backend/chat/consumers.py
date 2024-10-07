import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from asgiref.sync import sync_to_async
from channels.exceptions import StopConsumer
from rest_framework.exceptions import NotFound

from .models import ChatMessage

User = get_user_model()
logger = logging.getLogger(__name__)


class PersonalChatConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer to handle personal chat between two users.
    Handles connection, message receiving, and broadcasting messages to the group.
    """

    async def connect(self):
        """
        Handle WebSocket connection. Authenticates the user and connects them
        to a unique chat room based on the user IDs.
        """
        try:
            request_user = self.scope["user"]

            if not request_user.is_authenticated:
                # Close connection if user is not authenticated
                await self.close()
                return

            # Get the ID of the user to chat with from the URL route
            chat_with_user = self.scope["url_route"]["kwargs"]["id"]
            user_ids = sorted([int(request_user.id), int(chat_with_user)])
            self.room_group_name = f"chat_{user_ids[0]}-{user_ids[1]}"

            # Ensure that the channel layer is available
            if not hasattr(self, "channel_layer"):
                await self.close()
                return

            # Add the user to the chat room group
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.accept()  # Accept the WebSocket connection

        except Exception as e:
            """Log the error and close connection if any issues occur during the connection process."""
            await self.close()
            raise StopConsumer()  # Terminate the consumer on error

    async def disconnect(self, code):
        """
        Handle WebSocket disconnection. Removes the user from the chat room group.
        """
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        """
        Handle incoming messages from the WebSocket. Saves the message to the database
        and broadcasts it to the chat room group.
        """
        try:
            data = json.loads(text_data)
            message = data["message"]
            user = self.scope["user"]
            sender_id = user.id
            receiver_id = int(self.scope["url_route"]["kwargs"]["id"])

            # Save the message to the database
            chat_message = await self.create_chat_message(
                sender_id, receiver_id, message
            )

            # Broadcast the message to the room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": message,
                    "sender_id": sender_id,
                    "receiver_id": receiver_id,
                    "timestamp": chat_message.timestamp.isoformat(),
                },
            )
        except Exception as e:
            """Log the error if any issues occur during message reception or processing."""
            logger.error(f"Error in receive: {str(e)}")

    async def chat_message(self, event):
        """
        Send the received chat message to the WebSocket.
        """
        await self.send(
            text_data=json.dumps(
                {
                    "message": event["message"],
                    "sender_id": event["sender_id"],
                    "receiver_id": event["receiver_id"],
                    "timestamp": event["timestamp"],
                }
            )
        )

    @sync_to_async
    def create_chat_message(self, sender_id, receiver_id, message):
        """
        Create and save a chat message to the database asynchronously.
        """
        try:
            sender = User.objects.get(id=sender_id)
            receiver = User.objects.get(id=receiver_id)
        except User.DoesNotExist:
            raise NotFound("User not found")
        
        return ChatMessage.objects.create(
            sender=sender, receiver=receiver, message=message
        )
