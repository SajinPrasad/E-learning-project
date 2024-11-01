from celery import shared_task
from datetime import timedelta
from django.utils import timezone
import logging
from .models import OTP

logger = logging.getLogger(__name__)

@shared_task
def remove_expired_otps():
    """
    This task removes all OTPs that are expired.
    """
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
