from functools import wraps
from rest_framework.exceptions import PermissionDenied

def can_borrow_and_return(func):
    @wraps(func)
    def wrapper(self, request, *args, **kwargs):
        if request.user.is_staff:
            # Admins can perform any actions
            return func(self, request, *args, **kwargs)
        
        # Regular users can only access borrow and return actions
        if request.method in ['POST']:
            if 'borrow' in request.path or 'return_book' in request.path:
                return func(self, request, *args, **kwargs)
            
        raise PermissionDenied("User must be admin to perform this action.")
    return wrapper
