from django.db import models
from django.contrib.auth import get_user_model
from courses.models import Course

# Create your models here.

User = get_user_model()


class Order(models.Model):
    """
    Represents an order in the system.

    An order can contain multiple courses and is associated with a user.
    It also tracks the status of the order.
    """

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    order_status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="pending"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def total_amount(self):
        return sum(item.price for item in self.order_courses.all())


class OrderCourse(models.Model):
    """
    Represents the relationship between an order and a course.

    This model allows an order to contain multiple courses by creating an
    entry for each course added to the order. It also stores the price of
    each course at the time of purchase.
    """

    order = models.ForeignKey(
        Order, related_name="order_courses", on_delete=models.CASCADE
    )
    course = models.ForeignKey(
        Course, related_name="order_courses", on_delete=models.CASCADE
    )
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
