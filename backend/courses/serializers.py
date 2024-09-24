from rest_framework.serializers import (
    ModelSerializer,
    ValidationError,
    PrimaryKeyRelatedField,
    ImageField,
    CharField,
    SerializerMethodField,
)
from django.contrib.auth import get_user_model
import logging
from django.conf import settings
from django.db import transaction

from .models import (
    Category,
    Lesson,
    Course,
    CourseRequirement,
    Price,
    Suggestion,
    Enrollment,
)
from users.models import MentorProfile
from .utils import validate_course

logger = logging.getLogger(__name__)

User = get_user_model()


class CategorySerializer(ModelSerializer):
    """
    Serializer for creating and managing Category instances.
    """

    class Meta:
        model = Category
        fields = ["id", "name", "description", "parent"]


class SubCategorySerializer(ModelSerializer):
    """
    Serializer for creating and managing Sub Categories.
    """

    parent = PrimaryKeyRelatedField(queryset=Category.objects.all(), required=True)

    class Meta:
        model = Category
        fields = ["id", "name", "description", "parent"]

    def create(self, validated_data):
        """
        Creating subcategory for requested parent category
        """
        parent = validated_data.get("parent")

        # Ensure the parent is a valid category
        if not Category.objects.filter(id=parent.id).exists():
            raise ValidationError({"parent": "Invalid parent category."})
        return super().create(validated_data)

    def update(self, instance, validated_data):
        parent = validated_data.get("parent")

        # Ensure the parent is a valid category
        if not Category.objects.filter(id=parent.id).exists():
            raise ValidationError({"parent": "Invalid parent category."})
        return super().update(instance, validated_data)


class CourseRequirementSerializer(ModelSerializer):
    """
    For creating course requirement
    """

    class Meta:
        model = CourseRequirement
        fields = ["id", "description"]


class PriceSerializer(ModelSerializer):
    """
    For creating course price
    """

    class Meta:
        model = Price
        fields = ["id", "amount"]


class FullURLImageField(ImageField):
    """
    Generates a full URL using the current request.
    """

    def to_representation(self, value):
        if not value:
            return None
        # Concatenates the value of image field with media URL.
        return self.context["request"].build_absolute_uri(
            f"{settings.MEDIA_URL}{value}"
        )


class LessonSerializer(ModelSerializer):
    """
    Used for creating and retrieving purchased courses.
    * Only used for retrieval if the course is purchased or free.
    """

    class Meta:
        model = Lesson
        fields = ["id", "title", "content", "video_file", "order"]


class CourseListCreateSerializer(ModelSerializer):
    """
    Serializer for creating, updating and listing the courses.
    Not for detailed view of courses.
    Lessons and requirements are not included in the get request for listing.
    """

    lessons = LessonSerializer(many=True, write_only=True, required=True)
    category = CharField(required=True)  # To handle category by name
    requirements = CourseRequirementSerializer(write_only=True, required=True)
    price = PriceSerializer(required=True)
    preview_image = FullURLImageField(required=True)
    mentor_name = SerializerMethodField(read_only=True)

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "description",
            "preview_image",
            "category",
            "preview_image",
            "mentor",
            "status",
            "lessons",
            "requirements",
            "price",
            "mentor_name",
        ]

    def validate(self, data):
        """
        Calling the custom validate function to validate the course data.
        """
        validate_course(data)  # Custom validation
        return data

    @transaction.atomic
    def create(self, validated_data):
        """
        Creating course object including Price, Requirements, and Lesson objects.
        Wrapped in a transaction to ensure atomicity.
        """
        # Extract nested data
        lessons_data = validated_data.pop("lessons", [])
        requirements_data = validated_data.pop("requirements", {})
        price_data = validated_data.pop("price")
        category = validated_data.pop("category")

        try:
            # Create course
            course = Course.objects.create(category=category, **validated_data)

            # Create related objects
            CourseRequirement.objects.create(course=course, **requirements_data)
            Price.objects.create(course=course, **price_data)

            # Create lessons
            for lesson_data in lessons_data:
                Lesson.objects.create(course=course, **lesson_data)

        except Exception as e:
            logger.error(f"Error creating course: {str(e)}")
            raise ValidationError(
                "An error occurred while creating the course. Please try again."
            )

        return course

    def get_mentor_name(self, obj):
        # Return the fullname of mentor
        return f"{obj.mentor.first_name} {obj.mentor.last_name}" if obj.mentor else None


class CourseUpdateSerializer(ModelSerializer):
    """
    Specifically for updating course and related objects except Lesson data.
    """

    class Meta:
        model = Course
        fields = [
            "title",
            "description",
            "category",
            "preview_image",
            "status",
            "updated_at",
        ]


class LessonContentSerializer(ModelSerializer):
    """
    Only to access the lesson content for courses which are not purchased by the user.
    """

    trimmed_content = SerializerMethodField(
        read_only=True
    )  # Field for trimmed content.

    class Meta:
        model = Lesson
        fields = ["id", "title", "trimmed_content", "order"]

    def get_trimmed_content(self, obj):
        """
        Trimming the content to 205 characters maximum.
        """
        return obj.content[:205] + "..." if len(obj.content) > 205 else obj.contnet


class LessonTitleSerializer(ModelSerializer):
    """
    Serializer only for fetching the Lesson title for course details.
    """

    class Meta:
        model = Lesson
        fields = ["id", "title"]


class CourseSuggestionSerializer(ModelSerializer):
    """
    Creating suggestions for the submitted courses by admins.
    """

    class Meta:
        model = Suggestion
        fields = ["id", "suggestion_text", "is_done", "course", "admin"]
        read_only_fields = ["admin"]


class CourseDetailSerializer(ModelSerializer):
    """
    Serializer for detailed view of Courses.
    """

    lessons = LessonTitleSerializer(many=True, read_only=True)
    requirements = CourseRequirementSerializer(read_only=True)
    price = PriceSerializer(read_only=True)
    suggestions = CourseSuggestionSerializer(read_only=True)
    preview_image = FullURLImageField(read_only=True)
    mentor_name = SerializerMethodField(read_only=True)
    mentor_profile = SerializerMethodField(read_only=True)

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "description",
            "preview_image",
            "category",
            "mentor_name",
            "mentor_profile",
            "lessons",
            "requirements",
            "price",
            "status",
            "suggestions",
        ]

    def get_mentor_name(self, obj):
        # Return the fullname of mentor
        return f"{obj.mentor.first_name} {obj.mentor.last_name}" if obj.mentor else None

    def get_mentor_profile(self, obj):
        # Returning profile details of the mentor
        mentor_profile = {
            "user_id": obj.mentor.id,
            "profile_picture": (
                obj.mentor.mentorprofile.profile_picture.url
                if obj.mentor.mentorprofile.profile_picture
                else None
            ),
            "full_name": obj.mentor.get_full_name(),
            "bio": obj.mentor.mentorprofile.bio,
            "highest_education_level": obj.mentor.mentorprofile.highest_education_level,
            "experience": obj.mentor.mentorprofile.experience,
        }
        return mentor_profile


class CourseStatusUpdateSerializer(ModelSerializer):
    """
    Serializer for updating course status by admin.
    """

    class Meta:
        model = Course
        fields = ["id", "status"]

    def update(self, instance, validated_data):
        # Updating the satus.
        instance.status = validated_data.get("status", instance.status)
        instance.save()

        return instance


class CourseEnrollementSerializer(ModelSerializer):
    course = CourseListCreateSerializer()

    class Meta:
        model = Enrollment
        fields = ["course", "purchased_at"]
