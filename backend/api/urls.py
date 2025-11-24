from django.urls import path
from . import views

urlpatterns = [
    path("chats/create/", views.create_chat, name="create_chat"),
    path("chats/send/", views.send_message, name="send_message"),
    path("chats/<str:user_id>/", views.list_chats, name="list_chats"),
]
