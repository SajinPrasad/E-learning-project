from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    OTPResendView,
    OTPVerificationView,
    ResetPasswordView,
    UserLoginView,
    UserRegistrationView,
    StudentProfileView,
)

urlpatterns = [
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", UserRegistrationView.as_view(), name="user_register"),
    path("login/", UserLoginView.as_view(), name="user_login"),
    path("otp/verify/", OTPVerificationView.as_view(), name="otp_verification"),
    path("otp/resend/", OTPResendView.as_view(), name="otp_resend"),
    path("reset/password/", ResetPasswordView.as_view(), name="password-reset"),
    path(
        "studentprofile/<int:pk>/", StudentProfileView.as_view(), name="studentprofile"
    ),
]
