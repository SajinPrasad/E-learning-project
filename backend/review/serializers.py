from rest_framework.serializers import ModelSerializer, SerializerMethodField

from .models import Review, CourseReviewStats


class ReviewSerializer(ModelSerializer):
    user_fullname = SerializerMethodField()

    class Meta:
        model = Review
        fields = ["id", "rating", "review_text", "user_fullname", "course"]
        read_only_fields = ["user_fullname"]

    def get_user_fullname(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"


class ReviewStatsSerializer(ModelSerializer):

    class Meta:
        model = CourseReviewStats
        fields = ["average_rating", "total_reviews", "course"]
        read_only_fields = [
            "average_rating",
            "total_reviews",
            "course",
        ]
