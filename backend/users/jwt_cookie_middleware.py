from django.conf import settings

class JWTCookieMiddleware:
    """
    Middleware for extracting the JWT from the cookie and adding it to the 
    Authorization header for requests. This allows backend authentication 
    using the token stored in the HTTP-only cookie.
    """

    def __init__(self, get_response):
        """
        Initialize the middleware with the next middleware or view in the chain.
        """
        self.get_response = get_response

    def __call__(self, request):
        """
        Extract the JWT from the cookie and set it as the Authorization header 
        for the request. This allows the backend to authenticate the request using 
        the token from the cookie.
        """
        # Get the JWT token from the cookie
        jwt_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE'])

        # If the token exists, set the Authorization header
        if jwt_token:
            request.META['HTTP_AUTHORIZATION'] = f"Bearer {jwt_token}"
        
        # Proceed with the next middleware or view
        response = self.get_response(request)

        return response