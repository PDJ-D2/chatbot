from django.db import models

class Message(models.Model):
    user = models.CharField(max_length=10)
    sender = models.CharField(
        max_length=10,
        choices=[("user", "User"), ("bot", "Bot")]
    )
    text = models.TextField()
    reply_to = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="replies"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender}: {self.text[:30]}"
