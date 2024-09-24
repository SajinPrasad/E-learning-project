from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.

User = get_user_model()


class ChatMessage(models.Model):
    """
    Model to store individual chat messages between two users.
    """

    sender = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="sent_messages"
    )
    receiver = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="received_messages"
    )
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["timestamp"]
        verbose_name_plural = "Messages"

    def __str__(self):
        return f"{self.sender} -> {self.receiver}: {self.message[:30]}"
