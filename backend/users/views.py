from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework import generics
from django.conf import settings
from django.middleware import csrf

from .serializer import OTPResendSerializer, UserRegistrationResponseSerializer, UserRegistrationSerializer, UserLoginSerializer
from .serializer import OTPVerificationSerializer
from .utils import send_otp_email
# Create your views here.

User = get_user_model()

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
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'],  # Cookie name
                value=data['access'],  # Access token value
                expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],  # Expiry time
                httponly=True,  # HTTP-only flag
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],  # Secure flag (use True in production)
                samesite='Lax',  # SameSite attribute
            )
            response.set_cookie(
                key='refresh_token',
                value=data['refresh'],
                httponly=True,
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                samesite='Lax',
            )
            csrf.get_token(request)  # Generate and attach CSRF token
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
            return Response({'message': 'OTP verified successfully.'}, status=status.HTTP_200_OK)
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
            return Response({"message": "OTP has been resent to your email."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def send_otp(self, user):
        """
        Utility method to send the OTP email to the user.
        """
        send_otp_email(user)
        

