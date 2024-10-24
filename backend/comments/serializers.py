from rest_framework.serializers import ModelSerializer, SerializerMethodField
from rest_framework.exceptions import ValidationError, NotFound

from .models import Comment
from courses.models import Course


class CommentSerializer(ModelSerializer):
    """
    Serializer for listing, retrieving, creating, and updating comments
    Accessed by all users
    """

    user_fullname = SerializerMethodField()
    user_profile_picture = SerializerMethodField()
    replay_count = SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            "id",
            "parent",
            "user",
            "course",
            "comment",
            "user_fullname",
            "user_profile_picture",
            "replay_count",
            "created_at",
        ]
        extra_kwargs = {
            "course": {"write_only": True},  # Only used for creating, not in the output
            "user": {"read_only": True},  # Automatically set the user
            "user_fullname": {"read_only": True},
            "user_profile_picture": {"read_only": True},
            "created_at": {"read_only": True},
        }

    def validate(self, attrs):
        comment = attrs.get("comment", "")
        course = attrs.get("course")

        # Validate comment length
        if not comment or len(comment) > 300:
            raise ValidationError("Comment length should be less than 301 characters.")

        if not course:
            raise ValidationError("Course is required.")

        return attrs

    def create(self, validated_data):
        """Override the create method to set the user"""

        request = self.context.get("request")
        user = request.user  # Get the logged-in user from the request
        validated_data["user"] = user

        return super().create(validated_data)

    def get_user_fullname(self, obj):
        """Returning the fullname of the user"""

        return obj.user.get_full_name()

    def get_user_profile_picture(self, obj):
        """Profile picture of the user"""

        user = obj.user
        profile_picture = None

        # Check if the user has a student or mentor profile and return the profile picture URL
        if hasattr(user, "studentprofile") and user.studentprofile.profile_picture:
            profile_picture = user.studentprofile.profile_picture.url
        elif hasattr(user, "mentorprofile") and user.mentorprofile.profile_picture:
            profile_picture = user.mentorprofile.profile_picture.url

        return profile_picture

    def get_replay_count(self, obj):
        """Returning the number of replies"""
        return obj.get_replies_count()
