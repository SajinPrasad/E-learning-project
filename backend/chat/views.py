from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveAPIView
from rest_framework.views import APIView
from django.db.models import Q
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError, NotFound
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK

from .serializer import (
    ChatMessageSerializer,
    StudentProfileSerializer,
    MentorProfileSerializer,
)
from .models import ChatMessage
from users.models import StudentProfile, MentorProfile
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
        receiver_id = self.request.query_params.get("receiverId")

        if not receiver_id:
            return ChatMessage.objects.none()  # No other user, return empty queryset

        # Filter the messages between the logged-in user and the other user
        messages = ChatMessage.objects.filter(
            Q(sender=user, receiver_id=receiver_id)
            | Q(sender_id=receiver_id, receiver=user)
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
        receiver_user_id = self.request.data.get("receiverId")

        # Validate the receiver exists and isn't the sender itself
        try:
            receiver = User.objects.get(id=receiver_user_id)
        except User.DoesNotExist:
            raise ValidationError(f"Receiver user does not exist.")

        if user == receiver:
            raise ValidationError("You cannot send a message to yourself.")

        # Save the message with the validated sender and receiver
        serializer.save(sender=user, receiver=receiver)


class ReceiverProfileRetrieveView(RetrieveAPIView):
    """
    Retrieve the profile details of reciever during chat.
    """

    permission_classes = [ChatAccessPermission]

    def get_serializer_class(self):
        """
        Chosing serializer according to the user is student or mentor.
        """
        user_id = self.request.query_params.get("receiverId")

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise NotFound("Reciever not found")

        if hasattr(user, "studentprofile"):
            return StudentProfileSerializer
        elif hasattr(user, "mentorprofile"):
            return MentorProfileSerializer

    def get_object(self):
        user_id = self.request.query_params.get("receiverId")

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise NotFound("Reciever not found")

        if hasattr(user, "studentprofile"):
            return StudentProfile.objects.get(user=user)
        elif hasattr(user, "mentorprofile"):
            return MentorProfile.objects.get(user=user)


class ChatProfileListView(APIView):
    """
    View to fetch the profiles of users the requested user has previously chatted with.
    """

    def get(self, request):
        user = request.user

        # Fetch all chat messages where the requested user is either the sender or receiver
        chat_messages = ChatMessage.objects.filter(Q(sender=user) | Q(receiver=user))

        # Get the unique set of user IDs (excluding the requested user)
        chat_user_ids = set()
        for chat_message in chat_messages:
            if chat_message.receiver != user:
                chat_user_ids.add(chat_message.receiver.id)
            elif chat_message.sender != user:
                chat_user_ids.add(chat_message.sender.id)

        # Fetch student and mentor profiles of those users
        student_profiles = StudentProfile.objects.filter(user_id__in=chat_user_ids)
        mentor_profiles = MentorProfile.objects.filter(user_id__in=chat_user_ids)

        # Serialize profiles
        student_profiles_serialized = StudentProfileSerializer(
            student_profiles, many=True
        ).data
        mentor_profiles_serialized = MentorProfileSerializer(
            mentor_profiles, many=True
        ).data

        # Combine the serialized data
        profiles = student_profiles_serialized + mentor_profiles_serialized

        return Response(status=HTTP_200_OK, data=profiles)
