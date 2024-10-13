from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal
from django.core.validators import MinValueValidator
from decimal import Decimal
from django.db.models import Sum
from django.contrib.auth import get_user_model
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.conf import settings

from orders.models import Order
from courses.models import Course

# Create your models here.


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


class WalletBase(models.Model):
    """
    Abstract base model for wallets for both admin and mentors.
    """

    balance = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(Decimal("0.00"))],
    )

    class Meta:
        abstract = True


class AdminWallet(WalletBase):
    """
    Model for the admin wallet. There should only be one instance.
    """

    class Meta:
        verbose_name = "Admin Wallet"
        verbose_name_plural = "Admin Wallet"


class MentorWallet(WalletBase):
    """
    Model for mentor wallets.
    """

    mentor = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        limit_choices_to={"role": "mentor"},
    )

    class Meta:
        verbose_name = "Mentor Wallet"
        verbose_name_plural = "Mentor Wallets"


class CourseProfit(models.Model):
    """
    Model to track individual profit entries for courses
    """

    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    number_of_purchases = models.IntegerField(default=0)
    admin_profit = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(Decimal("0.00"))],
    )
    mentor_profit = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(Decimal("0.00"))],
    )
    timestamp = models.DateTimeField(auto_now_add=True)
