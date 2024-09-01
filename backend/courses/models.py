from django.db import models
from django.contrib.auth import get_user_model

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

    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    preview_image = models.ImageField(
        upload_to="course_preview/", blank=True, null=True
    )
    # User (Mentor) submitted the course.
    mentor = models.ForeignKey(User, on_delete=models.CASCADE)
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
    video_url = models.URLField(null=True, blank=True)
    video_file = models.FileField(upload_to="videos/", blank=True)
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


class Price(models.Model):
    """
    Price for each course.
    """

    course = models.OneToOneField(
        Course, on_delete=models.CASCADE, related_name="price"
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.amount} for {self.course.title}"
