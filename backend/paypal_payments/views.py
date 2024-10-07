from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render, redirect
from django.conf import settings
import paypalrestsdk

from cart.models import Order, CartItem
from courses.models import Enrollment
from .models import Payment
from orders.models import OrderCourse

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

    print("Payment object:", payment.to_dict())

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

            for ordered_course in ordered_courses:
                # Delete the corresponding cart item
                CartItem.objects.filter(course=ordered_course.course, cart__user=order.user).delete()

                # Create an enrollment for the purchased course
                Enrollment.objects.create(user=order.user, course=ordered_course.course)
                
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
