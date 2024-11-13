from django.db import models
from django.contrib.auth import get_user_model

from courses.models import Course

# Create your models here.

User = get_user_model()


class Comment(models.Model):
    """
    Comment model for storing comments.
    Self referencing the comments for replies
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="comments", null=True
    )
    comment = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    parent = models.ForeignKey(
        "self", null=True, blank=True, on_delete=models.CASCADE, related_name="replies"
    )

    def __str__(self):
        return f"Comments of {self.course.title} by {self.user.get_full_name()}"

    @property
    def is_parent(self):
        """Check if the comment is a parent comment (not a reply)"""
        return self.parent is None

    @property
    def is_reply(self):
        """Check if the comment is a reply to another comment"""
        return self.parent is not None

    def get_replies(self):
        """Get all direct replies to this comment"""
        return self.replies.all()

    def get_replies_count(self):
        """Get the count of direct replies to this comment"""
        return self.replies.count()

    def get_all_replies(self):
        """
        Get all replies including nested replies (recursive)
        Returns a flat list of all nested replies
        """
        all_replies = []
        for reply in self.replies.all():
            all_replies.append(reply)
            all_replies.extend(reply.get_all_replies())
        return all_replies

    def get_reply_tree(self):
        """
        Get replies organized in a tree structure
        Returns a list of dictionaries representing the reply tree
        """
        tree = []
        for reply in self.replies.all():
            tree.append({"comment": reply, "replies": reply.get_reply_tree()})
        return tree

    def get_parent_thread(self):
        """Get all parent comments up to the root comment"""
        thread = []
        current = self
        while current.parent:
            thread.append(current.parent)
            current = current.parent
        return thread[::-1]  # Reverse to get chronological order

    def get_replies(self):
        """Method to get all replies for a comment"""
        return self.replies.all()

    def get_root_parent(self):
        """Method to get the top-level parent comment (the root comment in a thread)"""
        if self.parent:
            return self.parent.get_root_parent()  # Recursively find the root parent
        return self  # If no parent, it's the root
