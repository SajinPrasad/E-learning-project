from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_205_RESET_CONTENT,
)
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView, ListAPIView
from rest_framework.exceptions import NotFound, PermissionDenied
import logging
from django.db.models import Q
from rest_framework_simplejwt.tokens import RefreshToken

from .serializer import (
    MentorProfileSerializer,
    OTPResendSerializer,
    ResetPasswordSerializer,
    UserRegistrationResponseSerializer,
    UserRegistrationSerializer,
    UserLoginSerializer,
    StudentProfileSerializer,
    OTPVerificationSerializer,
    AdminUserSerializer,
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


class LogoutView(APIView):
    """
    Logout view
    Blacklisting the token.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")

            if refresh_token:
                # Blacklist the token
                token = RefreshToken(refresh_token)
                token.blacklist()

            return Response(HTTP_205_RESET_CONTENT)

        except Exception as e:
            return Response(HTTP_400_BAD_REQUEST)


class ProfileView(RetrieveUpdateAPIView):
    """
    For updating and retrieving the profile object for both students and mentors.
    Using custom permission class to only allow owners to access their profile.
    """

    permission_classes = [IsProfileOwner]

    def get_serializer_class(self):
        """
        Conditionally fetching serializer class.
        """
        print(self.request.user.role, self.request.user.id)
        if self.request.user.role == "student":
            return StudentProfileSerializer
        elif self.request.user.role == "mentor":
            return MentorProfileSerializer

    def get_object(self):
        try:
            obj = super().get_object()
            self.check_object_permissions(self.request, obj)
            return obj
        except PermissionDenied:
            raise NotFound("Profile not found.")

    def get_queryset(self):
        # Filter to only get the profile for the current user
        if self.request.user.role == "student":
            return StudentProfile.objects.filter(user=self.request.user)
        elif self.request.user.role == "mentor":
            return MentorProfile.objects.filter(user=self.request.user)


class AdminUserManagementViewSet(ModelViewSet):
    """
    View for accessing user and user profiles.
    * Only accessed by admins for user management.
    * Admin can block and unblock a user.
    """

    permission_classes = [IsAdminUser]
    serializer_class = AdminUserSerializer
    queryset = User.objects.exclude(role="admin")


class AdminUserSearchView(ListAPIView):
    """
    Admins can search users.
    * Only accessible by admins.
    """

    permission_classes = [IsAdminUser]
    serializer_class = AdminUserSerializer

    def get_queryset(self):
        query = self.request.query_params.get("q", None)
        queryset = []

        if query:
            queryset = User.objects.filter(
                Q(first_name__icontains=query)
                | Q(last_name__icontains=query)
                | Q(email__icontains=query)
            )
        else:
            queryset = User.objects.none()

        return queryset
