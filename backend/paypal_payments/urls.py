from django.urls import path

from .views import execute_payment, payment_cancel, payment_sucess


urlpatterns = [
    path("payment/execute/", execute_payment, name="payment_execute"),
    path("payment/cancel/", payment_cancel, name="payment_cancel"),
    path("payment/success", payment_sucess, name="payment_success"),
]
