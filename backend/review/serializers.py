from rest_framework.serializers import ModelSerializer, SerializerMethodField

from .models import Review, CourseReviewStats


class ReviewSerializer(ModelSerializer):
    user_fullname = SerializerMethodField()
    profile_picture = SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            "id",
            "rating",
            "review_text",
            "user_fullname",
            "course",
            "profile_picture",
        ]
        read_only_fields = ["user_fullname", "profile_picture"]

    def get_user_fullname(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    def get_profile_picture(self, obj):
        # Access StudentProfile or MentorProfile
        if hasattr(obj.user, "studentprofile"):
            return (
                obj.user.studentprofile.profile_picture.url
                if obj.user.studentprofile.profile_picture
                else None
            )
        elif hasattr(obj.user, "mentorprofile"):
            return (
                obj.user.mentorprofile.profile_picture.url
                if obj.user.mentorprofile.profile_picture
                else None
            )
        return None


class ReviewStatsSerializer(ModelSerializer):

    class Meta:
        model = CourseReviewStats
        fields = ["average_rating", "total_reviews", "course"]
        read_only_fields = [
            "average_rating",
            "total_reviews",
            "course",
        ]
