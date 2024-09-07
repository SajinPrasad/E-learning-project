from rest_framework.serializers import ValidationError
from django.conf import settings

from .models import Category
import magic


def validate_course(course_data):
    """
    Validating the entire course data adn raising validation error if any.
    """
    required_fields = [
        "title",
        "description",
        "requirements",
        "category",
        "preview_image",
        "lessons",
        "price",
    ]
    for field in required_fields:
        if field not in course_data:
            raise ValidationError(f"Missing required field: {field}")

    if len(course_data["title"]) < 5:
        raise ValidationError("Course title should be at least 5 characters.")

    if len(course_data["description"]) < 200:
        raise ValidationError(
            "Course description should contain at least 200 characters."
        )

    if len(course_data["requirements"]["description"]) < 100:
        raise ValidationError(
            "Course requirements should contain at least 100 characters."
        )

    if course_data["price"]["amount"] < 0.00:
        raise ValidationError("Invalid price")

    try:
        category = Category.objects.get(name=course_data["category"])
        course_data["category"] = category
    except Category.DoesNotExist:
        raise ValidationError("Invalid course category.")

    validate_preview_image(course_data["preview_image"])  # Validating preview image

    if len(course_data["lessons"]) < 1:
        raise ValidationError("Atleast one lesson is required")

    lesson_titles = set()  # Storing lesson titles for checking uniqueness.
    for lesson in course_data["lessons"]:
        if not lesson.get("title"):
            raise ValidationError("Lesson title is required.")

        if lesson["title"] in lesson_titles:
            raise ValidationError(f"Duplicate lesson title: {lesson['title']}")
        lesson_titles.add(lesson["title"])

        if len(lesson.get("content", "")) < 200:
            raise ValidationError(
                f"Content for lesson '{lesson['title']}' is too short"
            )

        if lesson["video_file"]:
            validate_lesson_video(lesson["video_file"])  # Validating video


def validate_file(file, allowed_types, max_size=None, min_size=None):
    """
    Validate the file's content type, size, and MIME type.
    """
    if max_size and file.size > max_size:
        raise ValidationError(
            f"File exceeds maximum size of {max_size / (1024 * 1024):.2f} MB."
        )
    if min_size and file.size < min_size:
        raise ValidationError(f"File size must be at least {min_size / 1024:.2f} KB.")

    content_type = file.content_type
    if content_type not in allowed_types:
        raise ValidationError(f"Unsupported file type: {content_type}")

    try:
        # Read the first 1024 bytes without using 'with' statement
        file_content = file.read(1024)
        mime_type = magic.from_buffer(file_content, mime=True)
    except Exception as e:
        raise ValidationError(f"Error reading file: {str(e)}")
    finally:
        # Always reset the file pointer to the beginning
        file.seek(0)

    if mime_type not in allowed_types:
        raise ValidationError(f"Invalid file type detected: {mime_type}")


def validate_preview_image(preview_image):
    """
    Validate the preview image using the validate_file function.
    """
    validate_file(
        preview_image,
        allowed_types=settings.WHITELISTED_IMAGE_TYPES.values(),
        max_size=settings.MAX_PREVIEW_IMAGE_SIZE,
        min_size=settings.MIN_PREVIEW_IMAGE_SIZE,
    )


def validate_lesson_video(video_file):
    """
    Validate the lesson video using the validate_file function.
    """
    validate_file(
        video_file,
        allowed_types=["video/mp4"],
        max_size=settings.MAX_VIDEO_FILE_SIZE,
        min_size=settings.MIN_VIDEO_FILE_SIZE,
    )
