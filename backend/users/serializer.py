from django.contrib.auth import authenticate, get_user_model
from rest_framework.serializers import (
    ModelSerializer,
    CharField,
    ValidationError,
    Serializer,
    EmailField,
)
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password

from .utils import (
    email_validation as email_is_valid,
    send_otp_email,
    password_validation,
)
from .services.otp import verify_otp
from .models import StudentProfile, MentorProfile


User = get_user_model()


class UserRegistrationSerializer(ModelSerializer):
    """
    Serlizer for validating registration requests and User creation.
    """

    password2 = CharField(write_only=True)

    class Meta:
        model = User
        fields = ("first_name", "last_name", "email", "password", "password2", "role")
        extra_kwargs = {
            "password": {"write_only": True},
            "password2": {"write_only": True},
        }

    def validate(self, data):
        """
        Password and email validation
        """
        password = data.get("password", "")
        password2 = data.get("password2", "")
        email = data.get("email", "")

        # If user already exists with the same email
        try:
            user = User.objects.get(email=email)
            if user:
                raise ValidationError("Account already exists with entered email")
        except User.DoesNotExist:
            pass

        # Validating password with custom validation function
        password_validation(password, password2)

        # Validating email with custom validation function
        valid, error_message = email_is_valid(email)
        if not valid:
            raise ValidationError(error_message)

        return data

    def create(self, validated_data):
        """
        Return user after creation
        """
        validated_data.pop("password2")
        user = User.objects.create_user(**validated_data)
        user.is_verified = False
        user.save()

        send_otp_email(user)
        return user


class UserRegistrationResponseSerializer(ModelSerializer):
    """
    Serializer for returning necessary user data after registration.
    """

    class Meta:
        model = User
        fields = ("email", "first_name", "last_name", "username")


class UserLoginSerializer(Serializer):
    """
    Serializer for  validating Login requests and authenticating.
    """

    email = EmailField(max_length=150)
    password = CharField(write_only=True)

    def validate(self, data):
        """
        Validating and return user login information
        Raises validation error mismatch or invalid input.
        """

        email = data.get("email", None)
        password = data.get("password", None)
        if email is None:
            raise ValidationError("An email address is required to log in.")

        if password is None:
            raise ValidationError("A password is required to log in.")

        try:
            user = User.objects.get(email=email)  # Checking the user exist or not.
        except User.DoesNotExist:
            raise ValidationError("A user with this email is not found.")

        user = authenticate(email=email, password=password)
        if not user:
            raise ValidationError("Invalid password!")

        if not user.is_active:
            raise ValidationError("This user is not currently activated.")

        if not user.is_verified and not user.is_superuser:
            raise ValidationError("Account not verified")

        # Generate token
        refresh = RefreshToken.for_user(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role,
            },
        }


class OTPVerificationSerializer(Serializer):
    """
    Serializer for verifying the otp during the authentication process.
    """

    otp_code = CharField(max_length=8)
    email = EmailField(max_length=150)

    def validate(self, data):
        """
        Validates the provided OTP against the user's stored OTP.
        Raises a ValidationError if the OTP is incorrect or expired.
        """
        email = data.get("email")
        otp_code = data.get("otp_code")
        is_valid, message = verify_otp(email, otp_code)
        if not is_valid:
            raise ValidationError({"non_field_errors": [message]})
        return data

    def save(self):
        """
        Changing the varification status to True and saving the user instance.
        Returns the user object after setting it to verified.
        """
        email = self.validated_data["email"]
        user = User.objects.get(email=email)
        user.is_verified = True
        user.save()

        return user


class OTPResendSerializer(Serializer):
    """
    Serializer for validating the request to resend the OTP.
    """

    email = EmailField()

    def validate_email(self, value):
        """
        Validate the email and ensure the user exists and is eligible to receive an OTP.
        """
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise ValidationError("User with this email does not exist.")

        if user.is_verified:
            raise ValidationError("User is already verified.")

        if not user.is_active:
            raise ValidationError("User is not permitted for verification.")

        # Store the user in the serializer instance for use later
        self.user = user

        return value


class ResetPasswordSerializer(Serializer):
    """
    Serializer for resetting the password via email.
    """

    email = EmailField(max_length=150)
    new_password = CharField(max_length=150)
    confirm_password = CharField(max_length=150)

    def validate(self, data):
        email = data.get("email")
        new_password = data.get("new_password")
        confirm_password = data.get("confirm_password")

        if not email:
            raise ValidationError("Email is required!")

        if not new_password:
            raise ValidationError("New password is required!")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise ValidationError("User not found!")

        # Validating password with custom validation function
        password_validation(new_password, confirm_password)

        # Check if the new password is the same as the old one
        if check_password(new_password, user.password):
            raise ValidationError(
                "The new password cannot be the same as the old password!"
            )

        data["user"] = user  # Pass the user object to use in save method
        return data

    def save(self, **kwargs):
        user = self.validated_data["user"]
        new_password = self.validated_data["new_password"]

        # Set and hash the new password
        user.set_password(new_password)
        user.save()

        return user.role  # Returning the role of the user.


class StudentProfileSerializer(ModelSerializer):
    """
    Serializer for managing student profile.
    * Creatiion, Updation, Lisiting and retrieval
    """

    class Meta:
        model = StudentProfile
        fields = [
            "profile_picture",
            "bio",
            "date_of_birth",
            "interested_areas",
            "highest_education_level",
            "current_education_level",
            "expected_graduation_date",
        ]
