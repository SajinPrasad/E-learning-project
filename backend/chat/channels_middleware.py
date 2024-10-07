from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware
from django.contrib.auth import get_user_model
from django.db import close_old_connections
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from channels.db import database_sync_to_async

User = get_user_model()


class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        close_old_connections()

        # Parse the token from the query string
        query_string = parse_qs(scope["query_string"].decode())
        token = query_string.get("token", [None])[0]

        if token is None:
            await self.close_connection(send)
            return

        try:
            # Verify the token and get the user
            user = await self.get_user_from_token(token)
            if user is None:
                await self.close_connection(send)
                return

            scope["user"] = user
            return await super().__call__(scope, receive, send)

        except (InvalidToken, TokenError):
            await self.close_connection(send)
            return

    async def close_connection(self, send):
        await send({"type": "websocket.close", "code": 4000})

    @database_sync_to_async
    def get_user_from_token(self, token):
        try:
            # This will verify the token and raise an error if it's invalid
            validated_token = AccessToken(token)
            user_id = validated_token["user_id"]
            try:
                return User.objects.get(id=user_id)
            except User.DoesNotExist:
                return None
        except Exception:
            return None
