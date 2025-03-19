from abc import ABC, abstractmethod
from rest_framework.response import Response
from rest_framework import status

class IBookOperation(ABC):
    @abstractmethod
    def borrow(self, book, user):
        pass

    @abstractmethod
    def return_book(self, book, user):
        pass

class BasicBookOperation(IBookOperation):
    """
    Concrete Component that implements the basic borrow and return operations.
    """
    def borrow(self, book, user):
        if not book.available:
            return Response(
                {"detail": "Book is not available for borrowing."},
                status=status.HTTP_400_BAD_REQUEST
            )
        book.available = False
        book.borrowed_by = user
        book.save()
        return Response(
            {"detail": "Book borrowed successfully."},
            status=status.HTTP_200_OK
        )

    def return_book(self, book, user):
        if book.available or book.borrowed_by != user:
            return Response(
                {"detail": "Book cannot be returned."},
                status=status.HTTP_400_BAD_REQUEST
            )
        book.available = True
        book.borrowed_by = None
        book.save()
        return Response(
            {"detail": "Book returned successfully."},
            status=status.HTTP_200_OK
        )
