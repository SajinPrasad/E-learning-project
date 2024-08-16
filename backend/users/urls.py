from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", views.UserRegistrationView.as_view(), name="user_register"),
    path("login/", views.UserLoginview.as_view(), name="user_login"),
    path("otp/verify/", views.OTPVerificationView.as_view(), name="otp_verification"),
    path("otp/resend/", views.OTPResendView.as_view(), name="otp_resend"),
]
