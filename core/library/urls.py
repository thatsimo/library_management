from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookViewSet,ReturnBookViewSet

router = DefaultRouter()
router.register(r'books', BookViewSet, basename='book')

urlpatterns = [
    path('', include(router.urls)), 
    path('books/<int:pk>/return_book/', ReturnBookViewSet.as_view(), name='return_book'),
]
