from rest_framework import serializers, exceptions
from django.contrib.auth import get_user_model
import logging
from decimal import Decimal, InvalidOperation

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
        fields = ["id", "amount"]


class CourseSerializer(serializers.ModelSerializer):
    lessons = serializers.JSONField(write_only=True)
    requirements = serializers.JSONField(write_only=True)
    price = PriceSerializer(read_only=True)
    price_amount = serializers.DecimalField(
        max_digits=10, decimal_places=2, write_only=True
    )

    # Instead of CharField, using SlugRelatedField or PrimaryKeyRelatedField for better validation
    category = serializers.SlugRelatedField(
        slug_field="name", queryset=Category.objects.all()
    )
    preview_image = serializers.ImageField(required=False)

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "description",
            "preview_image",
            "category",
            "lessons",
            "requirements",
            "price",
            "price_amount",
        ]

    def validate(self, data):
        """
        Validating the course details.
        """
        title = data.get("title", "")
        description = data.get("description", "")
        price_amount = data.get("price_amount", 0)
        lessons = data.get("lessons", [])
        print("Lessons: ", lessons)
        if len(title) < 5:
            raise serializers.ValidationError("Course Title is too short")

        if len(description) < 200:
            raise serializers.ValidationError("Course Description is too short")

        if price_amount < 0.00:
            raise serializers.ValidationError("Invalid price")

        if len(lessons) < 1:
            raise serializers.ValidationError("At least one lesson is required.")

        for lesson in lessons:
            if not lesson["title"]:
                raise serializers.ValidationError("Lesson Title is required")

            if len(lesson["content"]) < 200:
                raise serializers.ValidationError("Leccon content is too short.")

        return data

    def create(self, validated_data):
        """
        Creating the course including the related objects, such as,
        Price, Lessons and Requirements.
        """
        lessons_data = validated_data.pop("lessons", [])
        requirements_data = validated_data.pop("requirements", {})
        price_amount = validated_data.pop("price_amount", 0)

        try:
            price_amount = Decimal(price_amount)
        except (InvalidOperation, TypeError) as e:
            raise exceptions.ValidationError({"price": "Invalid price format."})

        # Create the Course instance
        course = Course.objects.create(**validated_data)

        # Handle lessons creation
        for lesson_data in lessons_data:
            Lesson.objects.create(course=course, **lesson_data)

        # Handle requirements creation
        CourseRequirement.objects.create(course=course, **requirements_data)

        # Handle price creation
        Price.objects.create(course=course, amount=price_amount)

        return course

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["price"] = PriceSerializer(instance.price).data
        return representation

    # def update(self, instance, validated_data):
    #     lessons_data = validated_data.pop("lessons")
    #     requirements_data = validated_data.pop("requirements")
    #     # price_data = validated_data.pop("price")

    #     # Update course fields
    #     for attr, value in validated_data.items():
    #         setattr(instance, attr, value)
    #     instance.save()

    #     # Update or recreate lessons
    #     instance.lessons.all().delete()
    #     for lesson_data in lessons_data:
    #         Lesson.objects.create(course=instance, **lesson_data)

    #     # Update or recreate requirements (single set)
    #     if instance.requirements:
    #         instance.requirements.delete()
    #     CourseRequirement.objects.create(course=instance, **requirements_data)

    #     # Update or recreate price
    #     # if instance.price:
    #     #     for attr, value in price_data.items():
    #     #         setattr(instance.price, attr, value)
    #     #     instance.price.save()
    #     # else:
    #     #     Price.objects.create(course=instance, **price_data)

    #     return instance
