import smtplib
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.conf import settings
from django.core.mail import send_mail

from .models import OTP


def email_validation(value: str) -> tuple[bool, str]:
    """
    Validating single email
    """

    error_message = 'Enter a valid email address'

    if not value:
        return False, error_message
    
    # Check the regex, using the validate_email from django.
    try:
        validate_email(value)
    except ValidationError:
        return False, error_message
    
    return True, ''


def send_otp_email(user):
    """
    Send generated OTP to the user's email.
    Delete existing OTP for the user before creating a new one 
    to avoid conflict during OTP resend.
    """
    # Delete existing OTP if it exists for the user
    existing_otp = OTP.objects.filter(user=user)
    if existing_otp.exists():
        existing_otp.delete()
        
    email = user.email
    otp_code = OTP.objects.create_otp(user) #Generate new OTP
    
    subject = 'Please verify your account with OTP'
    message = f"Your OTP code is {otp_code}. It is valid for 10 minutes."
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [email]
    
    try:
        send_mail(subject, message, from_email, recipient_list, fail_silently=False)
    except smtplib.SMTPException as e:
        raise Exception(f"Failed to send OTP email to {email}. SMTP error: {str(e)}")
    except Exception as e:
        raise Exception(f"An unexpected error occurred while sending the OTP email: {str(e)}")