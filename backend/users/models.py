from datetime import timedelta
from django.utils import timezone
import secrets
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.text import slugify
import hashlib

# Create your models here.


class CustomUserManager(BaseUserManager):
    """
    Custom user manager for creating and saving normal users and
    admin users with given email and password.
    """

    def generate_username(self, email):
        """
        Generating unique username from email by splitting the email before '@'.
        """
        username_base = slugify(email.split("@")[0])
        username = username_base
        counter = 1

        while self.model.objects.filter(username=username).exists():
            username = f"{username_base}_{counter}"
            counter += 1

        return username

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_("The Email must be set"))

        email = self.normalize_email(email)
        username = extra_fields.get("username")

        if not username:
            username = self.generate_username(email)

        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        # Setting the role to admin
        extra_fields.setdefault("role", CustomUser.ADMIN)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        if extra_fields.get("role") != CustomUser.ADMIN:
            raise ValueError("Superuser must must have role=ADMIN")

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    """
    Custom User model with email as the unique identifier and
    role-based differentiation.
    """

    # Three user roles
    STUDENT = "student"
    MENTOR = "mentor"
    ADMIN = "admin"

    ROLE_CHOICES = [(STUDENT, "Student"), (MENTOR, "Mentor"), (ADMIN, "Admin")]

    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    username = models.CharField(max_length=150, blank=True, unique=True)
    email = models.EmailField(_("email address"), unique=True)
    phone_number = PhoneNumberField(blank=True)
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    # Field for storing user roles.
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    # Link the custom user manager
    objects = CustomUserManager()

    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"


class InterestArea(models.Model):
    """
    Model to store interest areas.
    """

    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class AcademicSpecialisation(models.Model):
    """
    Model to store areas of academic specilisation.
    """

    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class ProfileBase(models.Model):
    """
    Abstract base model for profiles with common fields.
    """

    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    profile_picture = models.ImageField(
        upload_to="profile_pics/",
        default="profile_pic/default.png",
        blank=True,
        null=True,
    )
    bio = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    interested_areas = models.ManyToManyField(InterestArea, blank=True)

    class Meta:
        abstract = True


class StudentProfile(ProfileBase):
    """
    Student-specific profile extending the base profile.
    """

    # Education options
    UNDERGRADUATE = "undergraduate"
    GRADUATE = "graduate"
    POSTGRADUATE = "postgraduate"
    HIGH_SCHOOL = "high_school"
    DIPLOMA = "diploma"

    EDUCATION_LEVEL_CHOICES = [
        (HIGH_SCHOOL, "High School"),
        (DIPLOMA, "Diploma"),
        (UNDERGRADUATE, "Undergraduate"),
        (GRADUATE, "Graduate"),
        (POSTGRADUATE, "Postgraduate"),
    ]

    highest_education_level = models.CharField(
        max_length=20, choices=EDUCATION_LEVEL_CHOICES, blank=True, null=True
    )
    current_education_level = models.CharField(
        max_length=20, choices=EDUCATION_LEVEL_CHOICES, default=HIGH_SCHOOL
    )
    expected_graduation_date = models.DateField(blank=True, null=True)


class MentorProfile(ProfileBase):
    """
    Mentor-specific profile extending the base profile.
    """

    # Education options
    UNDERGRADUATE = "undergraduate"
    GRADUATE = "graduate"
    POSTGRADUATE = "postgraduate"
    DIPLOMA = "diploma"

    EDUCATION_LEVEL_CHOICES = [
        (DIPLOMA, "Diploma"),
        (UNDERGRADUATE, "Undergraduate"),
        (GRADUATE, "Graduate"),
        (POSTGRADUATE, "Postgraduate"),
    ]

    highest_education_level = models.CharField(
        max_length=20, choices=EDUCATION_LEVEL_CHOICES, blank=True, null=True
    )
    specialisations = models.ManyToManyField(AcademicSpecialisation, blank=True)
    experience = models.DecimalField(
        max_digits=5, decimal_places=1, blank=True, null=True
    )
    average_rating = models.DecimalField(
        max_digits=3, decimal_places=1, blank=True, null=True
    )


@receiver(post_save, sender=CustomUser)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Signal for creating user profile instance according to the roles.
    """
    if created:
        if instance.role == CustomUser.STUDENT:
            StudentProfile.objects.create(user=instance)
        elif instance.role == CustomUser.MENTOR:
            MentorProfile.objects.create(user=instance)


@receiver(post_save, sender=CustomUser)
def save_user_profile(sender, instance, **kwargs):
    """
    Signal for saving the profiles.
    """
    if instance.role == CustomUser.STUDENT:
        instance.studentprofile.save()
    elif instance.role == CustomUser.MENTOR:
        instance.mentorprofile.save()


class OTPManager(models.Manager):
    """
    OTP model manager to generate OTP and return.
    """

    def create_otp(self, user):
        """
        Generate a random OTP, hash it, and store it with an expiration time.
        """
        plain_otp_code = "".join(secrets.choice("0123456789") for i in range(5))
        hashed_otp = hashlib.sha256(plain_otp_code.encode("utf-8")).hexdigest()
        expires_at = timezone.now() + timedelta(minutes=10)
        self.create(user=user, otp_code=hashed_otp, expires_at=expires_at)

        # Returning plain otp to send to the user.
        return plain_otp_code


class OTP(models.Model):
    """
    Otp information with expiration time
    """

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    otp_code = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    objects = OTPManager()

    def is_valid(self):
        """
        Check if the OTP is still valid based on the expiration time.
        """
        return self.expires_at > timezone.now()

    def __str__(self) -> str:
        return f"OTP for {self.user.email} - {self.otp_code}"
