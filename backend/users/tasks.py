from celery import shared_task
from datetime import timedelta
from django.utils import timezone
import logging
import boto3
from django.conf import settings

# from .models import StudentProfile, MentorProfile

logger = logging.getLogger(__name__)


@shared_task
def remove_expired_otps():
    """
    This task removes all OTPs that are expired.
    """
    
    from .models import OTP
    # Define the expiration threshold (5 minutes in this case)
    expiration_threshold = timedelta(minutes=5)
    # Get the current time
    now = timezone.now()
    # Query for expired OTPs
    expired_otps = OTP.objects.filter(expires_at__lt=now - expiration_threshold)
    # Delete all expired OTPs
    expired_otps.delete()
    # Log information (optional)
    logger.info(f"Deleted {expired_otps.count()} expired OTPs.")


@shared_task
def delete_s3_file(file_url):
    s3 = boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME,
    )
    bucket_name = settings.AWS_STORAGE_BUCKET_NAME
    file_key = file_url.split(f"/{bucket_name}/")[-1]  # Extract file key from URL

    print('File key: ', file_key)
    s3.delete_object(Bucket=bucket_name, Key=file_key)


# @shared_task
# def clean_up_orphaned_files():
#     # Example: Get a list of all files from the S3 bucket
#     s3 = boto3.client(
#         "s3",
#         aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
#         aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
#         region_name=settings.AWS_S3_REGION_NAME,
#     )
#     bucket_name = settings.AWS_STORAGE_BUCKET_NAME
#     objects = s3.list_objects_v2(Bucket=bucket_name).get("Contents", [])

#     # Filter for files that aren't in the database
#     for obj in objects:
#         file_key = obj["Key"]
#         file_url = f"https://{bucket_name}.s3.amazonaws.com/{file_key}"

#         # Check if file_url exists in your database. If not, delete it.
#         if not StudentProfile.objects.filter(profile_picture=file_url).exists():
#             delete_s3_file.delay(file_url)  # Use Celery to delete
