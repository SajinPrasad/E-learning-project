from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework import generics
from django.conf import settings
from django.middleware import csrf
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
import logging

from .serializer import (
    OTPResendSerializer,
    UserRegistrationResponseSerializer,
    UserRegistrationSerializer,
    UserLoginSerializer,
)
from .serializer import OTPVerificationSerializer
from .utils import send_otp_email

# Create your views here.

User = get_user_model()

logger = logging.getLogger(__name__)


class UserRegistrationView(generics.CreateAPIView):
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
        return Response(user_data, status=status.HTTP_201_CREATED)


class UserLoginView(APIView):
    """
    View to authenticate users and provide JWT tokens.
    """

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        
        if serializer.is_valid():
            # Extract the tokens and user information from the serializer
            tokens = serializer.validated_data
            return Response(tokens, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OTPVerificationView(APIView):
    """
    View to handle OTP verification requests.
    """

    def post(self, request):
        """
        Handle POST requests to verify the provided OTP.
        """
        serializer = OTPVerificationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "OTP verified successfully."}, status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OTPResendView(APIView):
    """
    View to handle the request for resending the OTP.
    """

    def post(self, request):
        serializer = OTPResendSerializer(data=request.data)
        if serializer.is_valid():
            # Send OTP email after validation
            self.send_otp(serializer.user)
            return Response(
                {"message": "OTP has been resent to your email."},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def send_otp(self, user):
        """
        Utility method to send the OTP email to the user.
        """
        send_otp_email(user)