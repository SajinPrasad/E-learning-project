import hashlib
from django.contrib.auth import get_user_model

from ..models import OTP

User = get_user_model()


def verify_otp(email, otp_code) -> tuple[bool, str]:
    """
    Verifying the email and returns boolean value with message
    """
    try:
        user = User.objects.get(email=email)
        otp = OTP.objects.get(user=user)

        # Hash the provided otp_code to compare with the stored hashed OTP
        hashed_otp = hashlib.sha256(otp_code.encode("utf-8")).hexdigest()

        if otp.otp_code != hashed_otp:
            return False, "Invalid OTP."

        if not otp.is_valid():
            return False, "OTP has expired."

        otp.delete()
        return True, "OTP verified successfully."
    except User.DoesNotExist:
        return False, "User does not exist"
    except OTP.DoesNotExist:
        return False, "Invalid OTP"
