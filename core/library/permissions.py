from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admins to perform CRUD operations on books,
    and allow read-only access to others (like users).
    """

    def has_permission(self, request, view):
        # Allow read-only access (GET requests) for everyone
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Allow full access to admins for other methods
        return request.user and request.user.is_staff  # Check if user is an admin
        

class IsUserOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow users to borrow and return books.
    Admins can perform all actions.
    """

    def has_permission(self, request, view):
        if request.user.is_staff:
            # Admins can perform any actions
            return True
        
        # Regular users can only access borrow and return actions
        if request.method in ['POST']:
            if view.action in ['borrow', 'return_book']:
                return True
        
        # Deny access to other CRUD operations for regular users
        return False
