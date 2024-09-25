from rest_framework.serializers import ModelSerializer, SerializerMethodField

from .models import ChatMessage
from users.models import MentorProfile, StudentProfile


class StudentProfileSerializer(ModelSerializer):
    """
    Serializer for StudentProfile model.
    """

    full_name = SerializerMethodField()
    user_id = SerializerMethodField()

    class Meta:
        model = StudentProfile
        fields = ["id", "user_id", "profile_picture", "full_name", "bio"]

    def get_full_name(self, obj):
        """
        Returns the full name of the user associated with the profile.
        """
        return obj.user.get_full_name()

    def get_user_id(self, obj):
        """
        Return the user id of the profile owner.
        """
        return obj.user.id


class MentorProfileSerializer(ModelSerializer):
    """
    Serializer for MentorProfile model.
    """

    full_name = SerializerMethodField()
    user_id = SerializerMethodField()

    class Meta:
        model = MentorProfile
        fields = ["id", "profile_picture", "user_id", "full_name", "bio"]

    def get_full_name(self, obj):
        """
        Returns the full name of the user associated with the profile.
        """
        return obj.user.get_full_name()

    def get_user_id(self, obj):
        """
        Return the user id of the profile owner.
        """
        return obj.user.id


class ChatMessageSerializer(ModelSerializer):
    """
    Serializer for ChatMessage model.
    """

    class Meta:
        model = ChatMessage
        fields = [
            "id",
            "message",
            "is_read",
            "timestamp",
            "sender",
            "receiver",
        ]
        read_only_fields = ["timestamp"]
