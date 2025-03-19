from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from .models import Book

class TestBookViewSet(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.book = Book.objects.create(
            title='Test Book',
            author='Test Author',
            isbn='9783161484100',
            published_date='2021-01-01',
        )
        url = reverse('login')
        response = self.client.post(url, {'username': 'testuser', 'password': 'testpass'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access_token' in response.data)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.data["access_token"]}')

    def test_borrow_and_return_book(self):
        url = reverse('book-borrow', kwargs={'pk': self.book.pk})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        url = reverse('book-return-book', kwargs={'pk': self.book.pk})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
