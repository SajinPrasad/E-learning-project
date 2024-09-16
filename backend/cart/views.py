from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from .serializers import CartItemSerializer
from .models import CartItem, Cart

# Create your views here.


class CartItemViewSet(ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Fetch the cart items for the current user, if the cart exists
        user = self.request.user
        try:
            cart = Cart.objects.get(user=user)
            return CartItem.objects.filter(cart=cart)
        except Cart.DoesNotExist:
            # If no cart exists, return an empty queryset
            return CartItem.objects.none()

