from django.urls import path
from .views import receive_message

urlpatterns = [
    path("receive-message/", receive_message),
]
