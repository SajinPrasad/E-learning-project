from rest_framework.serializers import ModelSerializer

from .models import Payment, CourseProfit
from courses.models import Course


class PaymentSerializer(ModelSerializer):
    class Meta:
        model = Payment
        fields = ["id", "order", "amount", "payment_status"]


class CourseSerializer(ModelSerializer):
    class Meta:
        model = Course
        fields = ["id", "title"]


class CourseProfitSeralizer(ModelSerializer):
    course = CourseSerializer(read_only=True)

    class Meta:
        model = CourseProfit
        fields = [
            "id",
            "course",
            "number_of_purchases",
            "admin_profit",
            "mentor_profit",
        ]
