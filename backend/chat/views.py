from django.shortcuts import render
from rest_framework.generics import ListAPIView, CreateAPIView
from django.db.models import Q
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError

from .serializer import ChatMessageSerializer
from .models import ChatMessage
from .permissions import ChatAccessPermission

# Create your views here.

User = get_user_model()


class ChatMessageListView(ListAPIView):
    """
    View for lising the messages in the inbox of users.
    * Using custom permission to allow only sender and reciever is accessing messages.
    """

    permission_classes = [ChatAccessPermission]  # Custom permission
    serializer_class = ChatMessageSerializer

    def get_queryset(self):
        user = self.request.user
        other_user_id = self.request.query_params.get("other_user")

        if not other_user_id:
            return ChatMessage.objects.none()  # No other user, return empty queryset

        # Filter the messages between the logged-in user and the other user
        messages = ChatMessage.objects.filter(
            Q(sender=user, receiver_id=other_user_id)
            | Q(sender_id=other_user_id, receiver=user)
        ).order_by("-timestamp")

        return messages


class SendMessageView(CreateAPIView):
    """
    Creating messages.
    """

    permission_classes = [ChatAccessPermission]  # Custom permissoin
    serializer_class = ChatMessageSerializer

    def perform_create(self, serializer):
        user = self.request.user
        receiver_user_id = self.request.data.get("receiver")

        # Validate the receiver exists and isn't the sender itself
        try:
            receiver = User.objects.get(id=receiver_user_id)
        except User.DoesNotExist:
            raise ValidationError(f"Receiver user does not exist. {receiver_user_id}")

        if user == receiver:
            raise ValidationError("You cannot send a message to yourself.")

        # Save the message with the validated sender and receiver
        serializer.save(sender=user, receiver=receiver)
