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


class UserLoginview(APIView):
    """
    View to authenticate the users
    """

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            response = Response(data, status=status.HTTP_200_OK)
            # Set access token cookie
            response.set_cookie(
                key=settings.SIMPLE_JWT["AUTH_COOKIE"],
                value=data["access"],
                expires=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
                httponly=True,
                secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
                samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
            )

            # Set refresh token cookie
            response.set_cookie(
                key="refresh_token",
                value=data["refresh"],
                expires=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
                httponly=True,
                secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
                samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
            )

            # Generate and set CSRF token
            csrf_token = csrf.get_token(request)
            response["X-CSRFToken"] = csrf_token

            return response

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


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response(
                {"detail": "Refresh token cookie not provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Add the refresh token to the request data
        request.data["refresh"] = refresh_token

        try:
            logger.info("Attempting to call super().post()")
            response = super().post(request, *args, **kwargs)
            logger.debug(f"Response received: {response.status_code}")

            if response.status_code == 200:
                logger.info("Setting new access token in cookie")
                response.set_cookie(
                    key=settings.SIMPLE_JWT["AUTH_COOKIE"],
                    value=response.data["access"],
                    expires=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
                    httponly=True,
                    secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
                    samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
                )
                
                # Set the new refresh token in the cookie
                if "refresh" in response.data:
                    logger.info("Setting new refresh token in cookie")
                    response.set_cookie(
                        key="refresh_token",
                        value=response.data["refresh"],
                        expires=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
                        httponly=True,
                        secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
                        samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
                    )
            
            return response

        except TokenError as e:
            logger.error(f"TokenError encountered: {str(e)}")
            if "blacklisted" in str(e).lower():
                logger.warning("Token is blacklisted, forcing re-login")
                return Response(
                    {"detail": "Session expired. Please log in again."},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            return Response({"detail": str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        except InvalidToken as e:
            logger.error(f"InvalidToken encountered: {str(e)}")
            return Response({"detail": str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            logger.exception("An unexpected error occurred during token refresh")
            return Response(
                {"detail": "An error occurred during token refresh"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )