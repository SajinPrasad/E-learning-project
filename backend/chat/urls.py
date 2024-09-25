from django.urls import path
from .views import (
    SendMessageView,
    ReceiverProfileRetrieveView,
    ChatMessageListView,
    ChatProfileListView,
)

urlpatterns = [
    path("messages/", ChatMessageListView.as_view(), name="message"),
    path("send-message/", SendMessageView.as_view(), name="send-message"),
    path(
        "receiver-profile/",
        ReceiverProfileRetrieveView.as_view(),
        name="receiver-profile",
    ),
    path("chat-profiles/", ChatProfileListView.as_view(), name="chat-profile"),
]
