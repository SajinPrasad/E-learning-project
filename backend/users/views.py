from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_200_OK, HTTP_201_CREATED
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView
from rest_framework.exceptions import PermissionDenied, NotFound
import logging

from .serializer import (
    OTPResendSerializer,
    ResetPasswordSerializer,
    UserRegistrationResponseSerializer,
    UserRegistrationSerializer,
    UserLoginSerializer,
    StudentProfileSerializer,
    OTPVerificationSerializer,
)
from .models import StudentProfile, MentorProfile
from .permissions import IsProfileOwner
from .utils import send_otp_email

# Create your views here.

User = get_user_model()

logger = logging.getLogger(__name__)


class UserRegistrationView(CreateAPIView):
    """
    View to register new users
    """

    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer

    def perform_create(self, serializer):
        """
        Save the User instance using provided serializer.
        Returns the necessary user data.
        """
        user = serializer.save()
        # Serialize the user data to return only necessary fields
        response_serializer = UserRegistrationResponseSerializer(user)
        return response_serializer.data

    def post(self, request, *args, **kwargs):
        """
        Handle POST request to register a new user
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_data = self.perform_create(serializer)
        return Response(user_data, status=HTTP_201_CREATED)


class UserLoginView(APIView):
    """
    View to authenticate users and provide JWT tokens.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)

        if serializer.is_valid():
            # Extract the tokens and user information from the serializer
            tokens = serializer.validated_data
            return Response(tokens, status=HTTP_200_OK)

        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class OTPVerificationView(APIView):
    """
    View to handle OTP verification requests.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        """
        Handle POST requests to verify the provided OTP.
        """
        serializer = OTPVerificationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "OTP verified successfully."}, status=HTTP_200_OK
            )
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class OTPResendView(APIView):
    """
    View to handle the request for resending the OTP.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OTPResendSerializer(data=request.data)
        if serializer.is_valid():
            # Send OTP email after validation
            self.send_otp(serializer.user)
            return Response(
                {"message": "OTP has been resent to your email."},
                status=HTTP_200_OK,
            )
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    def send_otp(self, user):
        """
        Utility method to send the OTP email to the user.
        """
        send_otp_email(user)


class ResetPasswordView(APIView):
    """
    Resetting password.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)

        if serializer.is_valid():
            user_role = serializer.save()

            # Returning the user role for the proper navigation in the front end.
            return Response({"role": user_role}, HTTP_200_OK)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class StudentProfileView(RetrieveUpdateAPIView):
    """
    For updating and retrieving for profile object.
    Using custom permission class to only allow owners to access their profile
    """

    permission_classes = [IsProfileOwner]
    serializer_class = StudentProfileSerializer
    queryset = StudentProfile.objects.all()

    def get_object(self):
        try:
            obj = super().get_object()
            self.check_object_permissions(self.request, obj)
            return obj
        except PermissionDenied:
            raise NotFound("Profile not found.")
