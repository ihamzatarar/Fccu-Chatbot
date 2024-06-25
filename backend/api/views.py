from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, ChatSerializer
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
                chatbot_instance.send_message(message).text
            )

            return Response({'response': response})
        return Response({'error': 'Message not provided'}, status=400)


# chatbot/minne.py
def get_chatbot_response(message):
    # Your logic to process `message` and generate a response
    return "Sample response from minne.py"

