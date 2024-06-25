from django.urls import path
from .views import ChatListCreate, ChatDelete, GetResponseView, ChatSessionListCreate, ChatMessageView, ChatSessionDelete, CreateUserView

urlpatterns = [
    path("chat/", ChatListCreate.as_view(), name="chat-list"),
    path("chat/delete/<int:pk>/", ChatDelete.as_view(), name="delete-chat"),
    path("get/", GetResponseView.as_view(), name="get-response"),
    path('session/', ChatSessionListCreate.as_view(), name='create-session'),
    path('session/<int:session_id>/message/', ChatMessageView.as_view(), name='send-message'),
    path('session/<int:pk>/', ChatSessionDelete.as_view(), name='delete-session'),
]


