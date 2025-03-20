from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from .models import Book
from .serializers import BookSerializer
from .permissions import IsAdminOrReadOnly, IsUserOrReadOnly
from .book_operations import BasicBookOperation
from rest_framework import viewsets

class BookViewSet(viewsets.ModelViewSet):
    """
    A viewset for performing CRUD operations on Book.
    """
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    # Only authenticated users can access book data
    # Admins will be able to do full CRUD, others can only read or borrow/return books
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]

    def perform_create(self, serializer):
        """
        Override perform_create to add an admin-only restriction.
        Only admins can create a new book.
        """
        if self.request.user.is_staff:
            serializer.save()
        else:
            raise PermissionDenied("You do not have permission to create a book.")

    def get_queryset(self):
        queryset = Book.objects.all()
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(title__icontains=search_query) | queryset.filter(author__icontains=search_query)
        return queryset

    @action(detail=True, methods=['post'], permission_classes=[IsUserOrReadOnly])
    def borrow(self, request, pk=None):
        book = self.get_object()
        operation = BasicBookOperation()
        return operation.borrow(book, request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsUserOrReadOnly])
    def return_book(self, request, pk=None):
        book = self.get_object()
        operation = BasicBookOperation()
        return operation.return_book(book, request.user)
