from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from django.shortcuts import get_object_or_404
from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Chat
from .modules.chatbot_init import chatbot_instance

class ChatListCreate(generics.ListCreateAPIView):
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Chat.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class ChatDelete(generics.DestroyAPIView):
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Chat.objects.filter(author=user)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]



class GetResponseView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        message = request.data.get('message')
        if message:
            response = (
                # chatbot_instance.send_message(message).text
                print("Hello")
            )

            return Response({'response': response})
        return Response({'error': 'Message not provided'}, status=400)


class ChatSessionListCreate(generics.ListCreateAPIView):
    serializer_class = ChatSessionSerializer
    print("ChatSessionListCreate")
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ChatSession.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
class ChatMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id, *args, **kwargs):
        session = get_object_or_404(ChatSession, id=session_id, user=request.user)
        user_message = request.data.get('message')

        if not user_message:
            return Response({'error': 'Message not provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Save the user message
        user_chat_message = ChatMessage.objects.create(session=session, role='user', message=user_message)
        user_message_serializer = ChatMessageSerializer(user_chat_message)

        print("Sennnding message to chatbot")

        # Get the bot response from the chatbot
        bot_response = chatbot_instance.send_message(user_message).text # Assuming chatbot_instance has a method `chat` that takes a message and returns a response

        # Save the bot message
        bot_chat_message = ChatMessage.objects.create(session=session, role='bot', message=bot_response)
        bot_message_serializer = ChatMessageSerializer(bot_chat_message)
        print(user_message_serializer.data)
        print(bot_message_serializer.data)

        return Response({
            'user_message': user_message_serializer.data,
            'bot_response': bot_message_serializer.data
        }, status=status.HTTP_200_OK)

class ChatSessionDelete(generics.DestroyAPIView):
    serializer_class = ChatSessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ChatSession.objects.filter(user=self.request.user)

    def perform_destroy(self, instance):
        ChatMessage.objects.filter(session=instance).delete()
        instance.delete()

