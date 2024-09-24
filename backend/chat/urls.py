from django.urls import path
from .views import ChatMessageListView
from .views import SendMessageView

urlpatterns = [
    path("messages/", ChatMessageListView.as_view(), name="message"),
    path("send-messages/", SendMessageView.as_view(), name="send-message"),
]
