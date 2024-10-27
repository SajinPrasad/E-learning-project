from courses.models import Course, Lesson, CourseRequirement, Suggestion, Price, Category
from django.contrib.auth import get_user_model
from decimal import Decimal
from random import choice

# Get the mentor (you can change the mentor ID if needed)
User = get_user_model()
mentor = User.objects.get(id=1)  # Assuming mentor with ID 1

# Get the subcategories (only subcategories, not parent categories)
subcategories = Category.objects.filter(parent__isnull=False)

# Preview images
preview_images = [
    "course_preview/1046752801.jpg",
    "course_preview/1558277723.jpg",
    "course_preview/2344329256.jpg",
    "course_preview/2988318052.jpg",
    "course_preview/7912126758.jpg",
    "course_preview/Screenshot_from_2024-09-14_12-44-55.png",
    "course_preview/Screenshot_from_2024-09-17_10-21-10.png",
    "course_preview/WhatsApp_Image_2024-08-19_at_3.57.26_PM.jpeg",
    "course_preview/WhatsApp_Image_2024-09-09_at_12.23.24_PM.jpeg",
    "course_preview/Sign_up.png",
]

# Titles for the new courses
course_titles = [
    "Introduction to Data Science",
    "Advanced React.js",
    "Deep Learning with TensorFlow",
    "Frontend Development with Angular",
    "Cybersecurity Essentials",
    "Mobile App Development with Swift",
    "Data Structures and Algorithms",
    "DevOps with Docker and Kubernetes",
    "Introduction to Blockchain",
    "Machine Learning with Python",
]

# Create 10 new courses
for i in range(10):
    title = course_titles[i]
    description = f"{title} - This course will cover all the essential topics of {title}."
    category = choice(subcategories)  # Randomly assign a subcategory
    preview_image = preview_images[i]

    # Create the course
    course = Course.objects.create(
        title=title,
        description=description,
        category=category,
        mentor=mentor,
        preview_image=preview_image,
        status="approved",  # Approving the courses directly
    )
    
    # Create lessons (you can add more lessons if needed)
    Lesson.objects.create(
        course=course,
        title=f"Introduction to {title}",
        content="This lesson introduces the key concepts of the course.",
        completed=True,  # Marking lessons as completed
        order=1
    )
    Lesson.objects.create(
        course=course,
        title=f"Advanced Topics in {title}",
        content="This lesson dives into the advanced topics of the course.",
        completed=True,
        order=2
    )

    # Create course requirements
    CourseRequirement.objects.create(
        course=course,
        description=f"Basic understanding of {title.split()[-1]} is required."
    )

    # Create price for the course
    Price.objects.create(
        course=course,
        amount=Decimal("49.99"),  # Example price
    )

    # Create a suggestion for the course
    Suggestion.objects.create(
        course=course,
        admin=mentor,  # Assuming the mentor is the admin here for demo purposes
        suggestion_text=f"Consider adding more hands-on examples for {title}.",
        is_done=False,
        is_approved=True,
    )

print("10 new courses with related fields have been created.")
