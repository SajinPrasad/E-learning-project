"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

from chat.route import websocket_urlpatterns as chat_websocket_urlpatterns
from comments.route import websocket_urlpatterns as comment_websocket_urlpatterns
from chat.channels_middleware import JWTAuthMiddleware

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

# Merge both chat and comment websocket_urlpatterns

# Configure the ASGI application with combined routes
application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": JWTAuthMiddleware(
            AuthMiddlewareStack(
                URLRouter(chat_websocket_urlpatterns + comment_websocket_urlpatterns)
            )
        ),
    }
)

# # asgi.py
# import os
# from django.core.asgi import get_asgi_application
# from channels.routing import ProtocolTypeRouter, URLRouter
# from channels.auth import AuthMiddlewareStack
# from chat.channels_middleware import JWTAuthMiddleware

# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

# # Define application without immediately loading websocket routes
# application = ProtocolTypeRouter({
#     "http": get_asgi_application(),
#     "websocket": JWTAuthMiddleware(
#         AuthMiddlewareStack(
#             URLRouter(
#                 (lambda: __import__('chat.route').route.websocket_urlpatterns)() + 
#                 (lambda: __import__('comments.route').route.websocket_urlpatterns)()
#             )
#         )
#     ),
# })

