from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter

from .views import (
    OTPResendView,
    OTPVerificationView,
    ResetPasswordView,
    UserLoginView,
    UserRegistrationView,
    ProfileView,
    AdminUserManagementViewSet,
    AdminUserSearchView,
    LogoutView,
)

router = DefaultRouter()

router.register(r"users", AdminUserManagementViewSet, basename="user")

urlpatterns = [
    path("", include(router.urls)),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", UserRegistrationView.as_view(), name="user_register"),
    path("login/", UserLoginView.as_view(), name="user_login"),
    path("otp/verify/", OTPVerificationView.as_view(), name="otp_verification"),
    path("otp/resend/", OTPResendView.as_view(), name="otp_resend"),
    path("reset/password/", ResetPasswordView.as_view(), name="password-reset"),
    path("studentprofile/<int:pk>/", ProfileView.as_view(), name="studentprofile"),
    path("user-search/", AdminUserSearchView.as_view(), name="user-search"),
    path("logout/", LogoutView.as_view(), name="logout"),
]
