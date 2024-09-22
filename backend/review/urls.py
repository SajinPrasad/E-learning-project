from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ReviewListView, ReviewViewSet, ReviewStatsView

router = DefaultRouter()

# Register the viewsets with the router
router.register(r"reviews", ReviewViewSet, basename="reviews")


urlpatterns = [
    path("", include(router.urls)),
    path("review/", ReviewListView.as_view(), name="review"),
    path("review-stats/", ReviewStatsView.as_view(), name="review-stats"),
]
