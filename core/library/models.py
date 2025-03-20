from django.db import models
from django.contrib.auth.models import User

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    isbn = models.CharField(max_length=13, unique=True)
    published_date = models.DateField()
    available = models.BooleanField(default=True)
    borrowed_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='borrowed_books')

    BOOK_TYPE_CHOICES = [
        ('printed', 'Printed'),
        ('ebook', 'Ebook'),
        ('audiobook', 'Audiobook'),
    ]

    book_type = models.CharField(
        max_length=20, 
        choices=BOOK_TYPE_CHOICES, 
        default='printed'
    )
    # Extra fields for specific types
    pages = models.PositiveIntegerField(null=True, blank=True)      # for printed books
    file_format = models.CharField(max_length=10, null=True, blank=True)  # for ebooks
    duration = models.PositiveIntegerField(null=True, blank=True)     # for audiobooks (duration in minutes)

    def __str__(self):
        return f"{self.title} by {self.author}"
