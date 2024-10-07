from rest_framework.serializers import ModelSerializer

from .models import Order, OrderCourse


class OrderCourseSerializer(ModelSerializer):
    class Meta:
        model = OrderCourse
        fields = [
            "id",
            "course",
            "price",
        ]  # Define fields to be filled in the OrderCourse creation


class OrderSerializer(ModelSerializer):
    order_courses = OrderCourseSerializer(many=True)

    class Meta:
        model = Order
        fields = ["id", "user", "order_status", "order_courses"]

    def create(self, validated_data):
        order_courses_data = validated_data.pop("order_courses")
        print(validated_data)
        order = Order.objects.create(**validated_data)

        # Create associated OrderCourse entries
        for product_data in order_courses_data:
            OrderCourse.objects.create(order=order, **product_data)
        print("Order and order products created.")
        return order
