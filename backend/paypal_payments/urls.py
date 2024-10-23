from django.urls import path

from .views import (
    execute_payment,
    payment_cancel,
    payment_sucess,
    WalletRetrievalView,
    CourseProfitInfoAdminMentor,
    CourseProfitDateFilter,
)


urlpatterns = [
    path("payment/execute/", execute_payment, name="payment_execute"),
    path("payment/cancel/", payment_cancel, name="payment_cancel"),
    path("payment/success", payment_sucess, name="payment_success"),
    path("wallet/", WalletRetrievalView.as_view(), name="wallet"),
    path(
        "course-profits/", CourseProfitInfoAdminMentor.as_view(), name="course-profit"
    ),
    path(
        "course-profits/date-filter/",
        CourseProfitDateFilter.as_view(),
        name="course-profit-date-filter",
    ),
]
