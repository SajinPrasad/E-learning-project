from rest_framework.permissions import BasePermission


class ChatAccessPermission(BasePermission):
    """
    Custom permission class to control access to chat messages.

    This permission ensures that:
    1. Only authenticated users can access chat-related views.
    2. Users can only access chat messages where they are either
       the sender or the receiver.
    """

    def has_permission(self, request, view):
        """
        Check if the user has permission to access the view.
        Returns:
            bool: True if the user is authenticated, False otherwise.
        """
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        """
        Check if the user has permission to perform the requested action
        on a specific chat message.

        Returns:
            bool: True if the user is authenticated and is either the
            sender or receiver of the message, False otherwise.
        """
        user = request.user
        return user.is_authenticated and (
            user == getattr(obj, "sender", None)
            or user == getattr(obj, "receiver", None)
        )
