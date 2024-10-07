from django.db import models
from django.contrib.auth import get_user_model

from courses.models import Course
from orders.models import Order

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


