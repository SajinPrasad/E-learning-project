from decimal import Decimal
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render, redirect
from django.conf import settings
import paypalrestsdk
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from cart.models import Order, CartItem
from courses.models import Enrollment
from .models import Payment, CourseProfit, MentorWallet, AdminWallet
from .serializer import CourseProfitSeralizer
from orders.models import OrderCourse
from courses.permissions import MentorOrAdminPermission

# Create your views here.

paypalrestsdk.configure(
    {
        "mode": settings.PAYPAL_MODE,
        "client_id": settings.PAYPAL_CLIENT_ID,
        "client_secret": settings.PAYPAL_CLIENT_SECRET,
    }
)


def execute_payment(request):
    payment_id = request.GET.get("paymentId")
    payer_id = request.GET.get("PayerID")

    payment = paypalrestsdk.Payment.find(payment_id)

    if payment.execute({"payer_id": payer_id}):
        try:
            # Get the order ID from the payment description
            order_id = payment.transactions[0].description.split()[-1]
            order = get_object_or_404(Order, id=order_id)

            # Update payment status
            payment_record = Payment.objects.get(order=order)
            payment_record.payment_status = "completed"
            payment_record.save()

            # Update order status
            order.order_status = "completed"
            order.save()

            # Get all the ordered courses
            ordered_courses = OrderCourse.objects.filter(order=order)

            # Accumulate admin and mentor profits
            admin_wallet_amount = 0
            mentor_wallet_amount = 0

            for ordered_course in ordered_courses:
                # Delete the corresponding cart item
                CartItem.objects.filter(
                    course=ordered_course.course, cart__user=order.user
                ).delete()

                # Create an enrollment for the purchased course
                Enrollment.objects.create(user=order.user, course=ordered_course.course)

                # Create or update the course profit entry
                course_profit, created = CourseProfit.objects.get_or_create(
                    course=ordered_course.course
                )

                # Increment the number of purchases
                course_profit.number_of_purchases += 1

                # Convert 0.1 to a Decimal for multiplication
                admin_profit = ordered_course.course.price.amount * Decimal(
                    "0.1"
                )  # 10% goes to admin
                mentor_profit = (
                    ordered_course.course.price.amount - admin_profit
                )  # The rest goes to the mentor

                # Update course profit fields
                course_profit.admin_profit = (
                    Decimal(course_profit.admin_profit) + admin_profit
                )
                course_profit.mentor_profit = (
                    Decimal(course_profit.mentor_profit) + mentor_profit
                )
                course_profit.save()

                # Accumulate wallet amounts
                admin_wallet_amount += admin_profit
                mentor_wallet_amount += mentor_profit

            # Update mentor wallet balance
            mentor_wallet, created = MentorWallet.objects.get_or_create(
                mentor=ordered_course.course.mentor
            )
            mentor_wallet.balance = (
                Decimal(mentor_wallet.balance) + mentor_wallet_amount
            )
            mentor_wallet.save()

            # Update admin wallet balance (assuming there's only one admin wallet)
            admin_wallet, created = AdminWallet.objects.get_or_create(id=1)
            admin_wallet.balance = Decimal(admin_wallet.balance) + admin_wallet_amount
            admin_wallet.save()

            return redirect("payment_success")
        except Exception as e:
            print(f"Error processing payment object: {e}")
            return render(request, "payment_error.html", {"error": str(e)})
    else:
        print(f"PayPal Execution Error: {payment.error}")
        return render(request, "payment_error.html", {"error": payment.error})


def payment_cancel(request):
    # You can customize the response or render a template as needed
    return HttpResponse("Payment was canceled. Please try again or contact support.")


def payment_sucess(request):
    return HttpResponse("Payment sucess")


class WalletRetrievalView(APIView):
    """
    Retrieving the wallet balance of both admin and mentor.
    """

    permission_classes = [MentorOrAdminPermission]  # Custom Permission

    def get(self, request, *args, **kwargs):
        if self.request.user.role == "mentor":
            wallet = MentorWallet.objects.get(mentor=self.request.user)
        elif self.request.user.role == "admin":
            # There is only one common wallet instance for the admin.
            wallet = AdminWallet.objects.get(id=1)
            
        else: return None

        # Construct and return the response manually
        return Response({"balance": wallet.balance})


class CourseProfitInfoAdminMentor(ListAPIView):
    """
    Returning the Course profit information for admin and mentor.
    """

    permission_classes = [MentorOrAdminPermission]  # Custom Permission
    serializer_class = CourseProfitSeralizer

    def get_queryset(self):
        if self.request.user.role == "mentor":
            return CourseProfit.objects.filter(course__mentor=self.request.user)
        return CourseProfit.objects.all()
