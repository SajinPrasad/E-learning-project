from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings
from rest_framework.authentication import CSRFCheck
from rest_framework import exceptions


def enforce_csrf(request):
    # Creates an instance of CSRFCheck, which is responsible for validating CSRF tokens
    check = CSRFCheck()
    
    # Processes the request to ensure it contains a valid CSRF token
    check.process_request(request)
    
    # Checks the view's request and response for CSRF validation
    reason = check.process_view(request, None, (), {})
    
    # If the CSRF check fails, raise a PermissionDenied exception with a failure reason
    if reason:
        raise exceptions.PermissionDenied('CSRF Failed: %s' % reason)

class CustomAuthentication(JWTAuthentication):
    """
    CustomAuthentication class to handle JWT authentication 
    using tokens stored in HttpOnly cookies and enforce CSRF protection.
    """
    def authenticate(self, request):
        # Attempt to retrieve the JWT token from the Authorization header
        header = self.get_header(request)

        if header is None:
            # If no Authorization header is found, try to retrieve the JWT token from cookies
            raw_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE']) or None
        else:
            # If the Authorization header exists, extract the raw token from it
            raw_token = self.get_raw_token(header)
        
        # If no token is found in either cookies or the header, return None (unauthenticated)
        if raw_token is None:
            return None

        # Validate the JWT token to ensure it's correct and unexpired
        validated_token = self.get_validated_token(raw_token)
        
        # Enforce CSRF protection for requests containing the JWT token
        enforce_csrf(request)
        
        # If everything is valid, return the user associated with the token and the validated token
        return self.get_user(validated_token), validated_token