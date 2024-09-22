from django.db import models
from django.contrib.auth import get_user_model
from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete

from courses.models import Course

# Create your models here.

User = get_user_model()


class Review(models.Model):
    """
    Model for storing reviews of courses by students.
    """

    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0.0)
    review_text = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    def __str__(self):
        return f"Review by {self.user.first_name} {self.user.last_name} for {self.course.title}"

    def save(self, *args, **kwargs):
        # Validate rating range
        if not (1.0 <= self.rating <= 5.0):
            raise ValueError("Rating must be between 1.0 and 5.0")
        super().save(*args, **kwargs)


class CourseReviewStats(models.Model):
    """
    Storing average rating and total number of reviews for each course.
    """

    average_rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    total_reviews = models.IntegerField(default=0)
    course = models.OneToOneField(Course, on_delete=models.CASCADE)

    def __str__(self):
        return f"Stats for {self.course.title}"


@receiver(post_save, sender=Review)
def update_course_review_stats(sender, instance, created, **kwargs):
    """
    Signal to update the CourseReviewStats whenever a review is created or updated.
    Recalculate the average rating and total number of reviews.
    """
    course = instance.course
    stats, created = CourseReviewStats.objects.get_or_create(course=course)

    # Calculate new average rating and total reviews
    reviews = Review.objects.filter(course=course)
    total_reviews = reviews.count()
    average_rating = reviews.aggregate(models.Avg("rating"))["rating__avg"] or 0.0

    # Update the stats
    stats.total_reviews = total_reviews
    stats.average_rating = round(average_rating, 1)  # Keep one decimal place
    stats.save()


@receiver(post_delete, sender=Review)
def delete_course_review_stats(sender, instance, **kwargs):
    """
    Signal to update the CourseReviewStats when a review is deleted.
    Recalculate the average rating and total number of reviews.
    """
    course = instance.course
    stats, created = CourseReviewStats.objects.get_or_create(course=course)

    # Calculate new average rating and total reviews after deletion
    reviews = Review.objects.filter(course=course)
    total_reviews = reviews.count()
    if total_reviews > 0:
        average_rating = reviews.aggregate(models.Avg("rating"))["rating__avg"] or 0.0
    else:
        average_rating = 0.0

    # Update or reset stats
    stats.total_reviews = total_reviews
    stats.average_rating = round(average_rating, 1)  # Keep one decimal place
    stats.save()
