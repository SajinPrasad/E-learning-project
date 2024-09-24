from rest_framework.serializers import ModelSerializer, SerializerMethodField

from .models import ChatMessage
from users.models import MentorProfile, StudentProfile


class StudentProfileSerializer(ModelSerializer):
    """
    Serializer for StudentProfile model.
    """

    full_name = SerializerMethodField()

    class Meta:
        model = StudentProfile
        fields = ["profile_picture", "full_name", "bio"]

    def get_full_name(self, obj):
        """
        Returns the full name of the user associated with the profile.
        """
        return obj.user.get_full_name()


class MentorProfileSerializer(ModelSerializer):
    """
    Serializer for MentorProfile model.
    """

    full_name = SerializerMethodField()

    class Meta:
        model = MentorProfile
        fields = ["profile_picture", "full_name", "bio"]

    def get_full_name(self, obj):
        """
        Returns the full name of the user associated with the profile.
        """
        return obj.user.get_full_name()


class ChatMessageSerializer(ModelSerializer):
    """
    Serializer for ChatMessage model.
    """

    sender_profile = SerializerMethodField()
    receiver_profile = SerializerMethodField()

    class Meta:
        model = ChatMessage
        fields = [
            "id",
            "message",
            "is_read",
            "timestamp",
            "sender",
            "receiver",
            "sender_profile",
            "receiver_profile",
        ]
        read_only_fields = ["sender_profile", "receiver_profile", "timestamp"]

    def get_profile(self, user):
        """
        Returns the profile data for the given user.
        Checks wether the user is mentor or student and returining appropreate profile.
        """
        if hasattr(user, "studentprofile"):
            return StudentProfileSerializer(user.studentprofile).data
        elif hasattr(user, "mentorprofile"):
            return MentorProfileSerializer(user.mentorprofile).data
        return None

    def get_sender_profile(self, obj):
        """
        Returns the profile data for the sender of the chat message.
        """
        return self.get_profile(obj.sender)

    def get_receiver_profile(self, obj):
        """
        Returns the profile data for the receiver of the chat message.
        """
        return self.get_profile(obj.receiver)
