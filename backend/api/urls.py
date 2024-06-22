from django.urls import path
from . import views

urlpatterns = [
    path("chat/", views.ChatListCreate.as_view(), name="chat-list"),
    path("chat/delete/<int:pk>/", views.ChatDelete.as_view(), name="delete-chat"),
]
