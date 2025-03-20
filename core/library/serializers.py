from rest_framework import serializers
from .models import Book

from rest_framework import serializers
from .models import Book

class BaseBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

class PrintedBookSerializer(BaseBookSerializer):
    pages = serializers.IntegerField(required=True)

    def validate(self, data):
        if data.get("book_type") != "printed":
            raise serializers.ValidationError("Invalid book type for PrintedBookSerializer.")
        if not data.get("pages"):
            raise serializers.ValidationError("Pages is required for printed books.")
        if data.get("pages") <= 0:
            raise serializers.ValidationError("Pages must be a positive integer.")
        return data

class EbookSerializer(BaseBookSerializer):
    file_format = serializers.CharField(required=True)

    def validate(self, data):
        if data.get("book_type") != "ebook":
            raise serializers.ValidationError("Invalid book type for EbookSerializer.")
        if not data.get("file_format"):
            raise serializers.ValidationError("File format is required for ebooks.")
        return data

class AudiobookSerializer(BaseBookSerializer):
    duration = serializers.IntegerField(required=True)

    def validate(self, data):
        if data.get("book_type") != "audiobook":
            raise serializers.ValidationError("Invalid book type for AudiobookSerializer.")
        if not data.get("duration"):
            raise serializers.ValidationError("Duration is required for audiobooks.")
        if data.get("duration") <= 0:
            raise serializers.ValidationError("Duration must be a positive integer.")
        return data


class BookSerializerFactory:
    serializer_mapping = {
        'printed': PrintedBookSerializer,
        'ebook': EbookSerializer,
        'audiobook': AudiobookSerializer,
    }

    @staticmethod
    def get_serializer(book_type, *args, **kwargs):
        serializer_class = BookSerializerFactory.serializer_mapping.get(book_type)

        if serializer_class is None:
            raise serializers.ValidationError({"book_type": "Invalid book type. Must be 'printed', 'ebook', or 'audiobook'."})

        return serializer_class(*args, **kwargs)


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'
    
    def set_null_for_unrelated_fields(self, validated_data):
        """Ensures unrelated fields are explicitly set to NULL (None)."""
        book_type = validated_data.get("book_type")

        null_fields = {
            "printed": {"duration": None, "file_format": None},
            "ebook": {"pages": None, "duration": None},
            "audiobook": {"pages": None, "file_format": None},
        }

        # Set unrelated fields to NULL
        for field, value in null_fields.get(book_type, {}).items():
            validated_data[field] = value

        return validated_data

    def create(self, validated_data):
        validated_data = self.set_null_for_unrelated_fields(validated_data)

        # Use factory to get the appropriate serializer
        book_type = validated_data.get("book_type")
        serializer = BookSerializerFactory.get_serializer(book_type, data=validated_data)
        serializer.is_valid(raise_exception=True)
        
        return serializer.save()

    def update(self, instance, validated_data):
        validated_data = self.set_null_for_unrelated_fields(validated_data)

        # Use factory to get the appropriate serializer
        book_type = validated_data.get("book_type")
        if book_type:
            serializer = BookSerializerFactory.get_serializer(book_type, instance, data=validated_data, partial=True)
        else:
            serializer = BaseBookSerializer(instance, data=validated_data, partial=True)
        
        serializer.is_valid(raise_exception=True)

        return serializer.save()