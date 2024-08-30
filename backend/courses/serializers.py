from rest_framework import serializers
from django.contrib.auth import get_user_model
import logging

from .models import Category, Lesson, Course, CourseRequirement, Price

logger = logging.getLogger(__name__)

User = get_user_model()


class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for creating and managing Category instances.
    """

    class Meta:
        model = Category
        fields = ["id", "name", "description", "parent"]


class SubCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for creating and managing Sub Categories.
    """

    parent = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), required=True
    )

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
            raise serializers.ValidationError({"parent": "Invalid parent category."})
        return super().create(validated_data)

    def update(self, instance, validated_data):
        parent = validated_data.get("parent")

        # Ensure the parent is a valid category
        if not Category.objects.filter(id=parent.id).exists():
            raise serializers.ValidationError({"parent": "Invalid parent category."})
        return super().update(instance, validated_data)


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ["id", "title", "content", "video_file", "order"]


class CourseRequirementSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseRequirement
        fields = ["id", "description"]


class PriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Price
        fields = ["id", "amount", "currency"]


class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True)
    requirements = CourseRequirementSerializer()
    # price = PriceSerializer()

    # Instead of CharField, using SlugRelatedField or PrimaryKeyRelatedField for better validation
    category = serializers.SlugRelatedField(
        slug_field="name", queryset=Category.objects.all()
    )

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "description",
            "category",
            "lessons",
            "requirements",
        ]

    def validate(self, data):

        # Ensure the user is authenticated
        request = self.context.get("request")

        # Log the authorization header and cookies
        authorization_header = request.headers.get("Authorization")
        print("Authorisation header: ", authorization_header)
        logger.debug(f"Authorization header in serializer: {authorization_header}")
        logger.debug(f"Cookies in serializer: {request.COOKIES}")
        print("User:", request.user)
        if request and request.user.is_authenticated:
            data["mentor"] = request.user
        else:
            raise serializers.ValidationError(
                {"mentor": "User must be authenticated to create a course."}
            )
        return data

    def create(self, validated_data):
        lessons_data = validated_data.pop("lessons")
        requirements_data = validated_data.pop("requirements")
        # Create the Course instance
        course = Course.objects.create(**validated_data)

        # Handle lessons creation
        for lesson_data in lessons_data:
            Lesson.objects.create(course=course, **lesson_data)

        # Handle requirements creation
        CourseRequirement.objects.create(course=course, **requirements_data)

        # Handle price creation
        # Price.objects.create(course=course, **price_data)

        return course

    def update(self, instance, validated_data):
        lessons_data = validated_data.pop("lessons")
        requirements_data = validated_data.pop("requirements")
        # price_data = validated_data.pop("price")

        # Update course fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update or recreate lessons
        instance.lessons.all().delete()
        for lesson_data in lessons_data:
            Lesson.objects.create(course=instance, **lesson_data)

        # Update or recreate requirements (single set)
        if instance.requirements:
            instance.requirements.delete()
        CourseRequirement.objects.create(course=instance, **requirements_data)

        # Update or recreate price
        # if instance.price:
        #     for attr, value in price_data.items():
        #         setattr(instance.price, attr, value)
        #     instance.price.save()
        # else:
        #     Price.objects.create(course=instance, **price_data)

        return instance
