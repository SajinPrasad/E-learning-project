from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from decimal import Decimal

from courses.models import Course

# Create your models here.

User = get_user_model()


class Cart(models.Model):
    """
    Represents a user's shopping cart in the e-learning platform.
    This model maintains a one-to-one relationship with the User model,
    ensuring each user has a single, persistent cart.
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart for {self.user.username}"

    @property
    def total_price(self):
        """
        Calculates the total price of all active items in the cart.
        Returns:
            Decimal: The sum of prices of all active items in the cart.
        """
        return sum(item.price for item in self.items.filter(is_active=True))


class CartItem(models.Model):
    """
    Represents an individual course item within a user's cart.
    This model creates a many-to-one relationship with both Cart and Course models,
    allowing multiple courses to be added to a single cart.
    """

    cart = models.ForeignKey(Cart, related_name="items", on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["cart", "course"], name="unique_cart_course"
            )
        ]

    def __str__(self):
        return f"{self.course.title} in cart for {self.cart.user.username}"


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


class Payment(models.Model):
    """
    Represents a payment for an order.

    Each payment is associated with exactly one order and tracks
    the amount and status of the payment.
    """

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("processing", "Processing"),
        ("completed", "Completed"),
        ("failed", "Failed"),
        ("refunded", "Refunded"),
    ]

    order = models.OneToOneField(
        Order, on_delete=models.CASCADE, related_name="payment"
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(Decimal("0.00"))],
    )
    payment_status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="pending"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
