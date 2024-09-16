from rest_framework.serializers import (
    ModelSerializer,
    IntegerField,
    SerializerMethodField,
)
from rest_framework.validators import ValidationError

from .models import Cart, CartItem
from courses.models import Enrollment, Course, Price


class CartItemCourseSerializer(ModelSerializer):
    mentor_name = SerializerMethodField()

    class Meta:
        model = Course
        fields = ["id", "title", "preview_image", "mentor_name"]

    def get_mentor_name(self, obj):
        # Return the fullname of mentor
        return f"{obj.mentor.first_name} {obj.mentor.last_name}" if obj.mentor else None


class CartSerializer(ModelSerializer):
    class Meta:
        model = Cart
        fields = ["id", "total_price"]


class CartItemSerializer(ModelSerializer):
    course_id = IntegerField(write_only=True)
    course = CartItemCourseSerializer(read_only=True)
    cart = CartSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = ["id", "cart", "course", "course_id", "price"]
        read_only_fields = ["course", "price"]

    def validate(self, data):
        course_id = data.get("course_id")
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            raise ValidationError("Course does not exist.")

        user = self.context["request"].user

        # Check if the course is approved
        if course.status != "approved":
            raise ValidationError("Course is not available for purchase.")

        # Check if the user has already purchased the course
        if Enrollment.objects.filter(course=course, user=user).exists():
            raise ValidationError("You have already purchased this course.")

        # Check if the course is already in the user's cart
        if CartItem.objects.filter(cart__user=user, course=course).exists():
            raise ValidationError("This course is already in your cart.")

        data["course"] = course

        return data

    def create(self, validated_data):
        user = self.context["request"].user
        cart, _ = Cart.objects.get_or_create(user=user)
        course = validated_data["course"]

        try:
            price = course.price.amount
        except Price.DoesNotExist:
            raise ValidationError("Price for the selected course is not available.")

        cart_item = CartItem.objects.create(
            cart=cart,
            course=course,
            price=price,
        )
        return cart_item
