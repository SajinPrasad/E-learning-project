from decimal import Decimal
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, FileExtensionValidator

# Create your models here.

User = get_user_model()


class Category(models.Model):
    """
    Course category model with self foreign key relation for subcategories.
    """

    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    # Foreign key relation with self
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="subcategories",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def get_full_path(self):
        # Recursively get the full path of the category (e.g., "Parent > Subcategory > ...")
        if self.parent:
            return f"{self.parent.get_full_path()} > {self.name}"
        return self.name


class Course(models.Model):
    """
    Model for courses.
    """

    # Course status
    STATUS_CHOICES = [
        ("pending", "Pending Approval"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    preview_image = models.ImageField(
        upload_to="course_preview/",
        blank=True,
        null=True,
    )
    # User (Mentor) submitted the course.
    mentor = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Lesson(models.Model):
    """
    Model for storing lessons of each course.
    """

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="lessons")
    title = models.CharField(max_length=255)
    content = models.TextField()
    video_file = models.FileField(
        upload_to="videos/",
        blank=True,
        null=True,
        validators=[FileExtensionValidator(["mp4"])],
    )
    # For sequential order of each lesson
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class CourseRequirement(models.Model):
    """
    Model for storing requirements for each courses.
    """

    course = models.OneToOneField(
        Course, on_delete=models.CASCADE, related_name="requirements"
    )
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Requirement for {self.course.title}: {self.description[:50]}"


class Suggestion(models.Model):
    """
    Model for storing course suggestions if any.
    Users can make changes according to the suggestions made by the admins.
    """

    course = models.OneToOneField(
        Course, on_delete=models.CASCADE, related_name="suggestions"
    )
    admin = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="suggestions"
    )
    suggestion_text = models.TextField()
    is_done = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return f"Suggestion for {self.course.title}"


class Price(models.Model):
    """
    Price for each course.
    """

    course = models.OneToOneField(
        Course, on_delete=models.CASCADE, related_name="price"
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(Decimal("0.00"))],
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.amount} for {self.course.title}"


class Enrollment(models.Model):
    """
    Model for storing purchased courses (enrollments) of each user
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="enrollments")
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="enrollments"
    )
    purchased_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        # A user can purchase a course once, this constrint esures the uniqueness.
        constraints = [
            models.UniqueConstraint(fields=["user", "course"], name="unique_enrollment")
        ]

    def __str__(self):
        return f"{self.course.title} purchased by {self.user.username}"

    @property
    def is_completed(self):
        # Logic to implement couse completion (For later use)
        pass
