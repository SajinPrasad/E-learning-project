from django.shortcuts import get_object_or_404, render
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_201_CREATED
import paypalrestsdk
from django.conf import settings
from django.urls import reverse

from .serializers import (
    CartItemSerializer,
    OrderCourseSerializer,
    OrderSerializer,
    PaymentSerializer,
)
from .models import CartItem, Cart, Order, Payment
from courses.models import Course

# Create your views here.

paypalrestsdk.configure(
    {
        "mode": settings.PAYPAL_MODE,
        "client_id": settings.PAYPAL_CLIENT_ID,
        "client_secret": settings.PAYPAL_CLIENT_SECRET,
    }
)


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


class OrderCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        course_ids = request.data.get("course_ids", [])

        # Check if courses are active
        courses = Course.objects.filter(id__in=course_ids, status="approved")
        if not courses.exists():
            return Response(
                {"error": "One or more courses are not active."},
                status=HTTP_400_BAD_REQUEST,
            )

        payment_amount = sum(course.price.amount for course in courses)

        # Create the Order and OrderCourse entries
        order_data = {
            "user": user.id,
            "order_status": "pending",
            "order_courses": [
                {"course": course.id, "price": course.price.amount}
                for course in courses
            ],
        }
        order_serializer = OrderSerializer(data=order_data)

        if order_serializer.is_valid():
            # Save the order
            order = order_serializer.save()

            # Create PayPal payment with item details
            payment = paypalrestsdk.Payment(
                {
                    "intent": "sale",
                    "payer": {"payment_method": "paypal"},
                    "transactions": [
                        {
                            "amount": {
                                "total": f"{payment_amount:.2f}",
                                "currency": "USD",
                            },
                            "description": f"Payment for Order {order.id}",
                            "item_list": {
                                "items": [
                                    {
                                        "name": course.title,
                                        "sku": f"course-{course.id}",
                                        "price": f"{course.price.amount:.2f}",
                                        "currency": "USD",
                                        "quantity": 1,
                                    }
                                    for course in courses
                                ]
                            },
                        }
                    ],
                    "redirect_urls": {
                        "return_url": request.build_absolute_uri(
                            reverse("payment_execute")
                        ),
                        "cancel_url": request.build_absolute_uri(
                            reverse("payment_cancel")
                        ),
                    },
                }
            )

            if payment.create():
                # Save payment entry
                payment_data = {
                    "order": order.id,
                    "amount": payment_amount,
                    "payment_status": "pending",
                    "paypal_payment_id": payment.id,
                }
                payment_serializer = PaymentSerializer(data=payment_data)

                if payment_serializer.is_valid():
                    payment_serializer.save()

                    # Find approval URL
                    approval_url = next(
                        (
                            link.href
                            for link in payment.links
                            if link.rel == "approval_url"
                        ),
                        None,
                    )

                    # Prepare the response data
                    response_data = {
                        "message": "Order and payment successfully processed.",
                        "data": order_serializer.data,
                        "approval_url": approval_url,
                    }

                    return Response(response_data, status=HTTP_201_CREATED)

                # If payment creation fails, delete the order to maintain consistency
                order.delete()
                return Response(payment_serializer.errors, status=HTTP_400_BAD_REQUEST)
            else:
                # Log the PayPal payment creation error
                print(f"PayPal Payment Error: {payment.error}")
                order.delete()
                return Response(
                    {
                        "error": "Failed to create PayPal payment.",
                        "details": payment.error,
                    },
                    status=HTTP_400_BAD_REQUEST,
                )

        return Response(order_serializer.errors, status=HTTP_400_BAD_REQUEST)
