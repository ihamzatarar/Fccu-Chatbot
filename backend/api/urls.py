from django.urls import path
from .views import ChatListCreate, ChatDelete, ChatSessionListCreate, ChatSessionMessagesView,ChatMessageView, ChatSessionDelete, CreateUserView

urlpatterns = [
    path("chat/", ChatListCreate.as_view(), name="chat-list"),
    path("chat/delete/<int:pk>/", ChatDelete.as_view(), name="delete-chat"),
    path('session/', ChatSessionListCreate.as_view(), name='create-session'),
    path('session/<int:session_id>/message/', ChatMessageView.as_view(), name='send-message'),
    path('session/<int:pk>/', ChatSessionDelete.as_view(), name='delete-session'),
    path('session/<int:session_id>/messages/', ChatSessionMessagesView.as_view(), name='session-messages'),
]


