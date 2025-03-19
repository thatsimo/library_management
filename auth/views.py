from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from django.contrib.auth import authenticate, logout
from user.serializers import UserSerializer

class RegisterView(APIView):
    """
    Endpoint for user registration.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "User registered successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    Endpoint for user login and returning JWT token.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
            }, status=status.HTTP_200_OK)

        return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

class MeView(APIView):
    """
    Endpoint to get the details of the currently logged-in user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = {
            'username': user.username,
            'is_staff': user.is_staff
        }
        return Response(user_data, status=status.HTTP_200_OK)
