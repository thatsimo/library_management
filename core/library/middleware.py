import logging

logger = logging.getLogger(__name__)

class BookOperationLoggingMiddleware:
    """
    Middleware to log all operations on book-related endpoints.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if 'books' in request.path:
            user = request.user.username if request.user.is_authenticated else 'Anonymous'
            logger.info(f"Book Operation: {request.method} {request.path} by {user}")
        return response
