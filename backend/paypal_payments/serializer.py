from rest_framework.serializers import ModelSerializer
from .models import Payment


class PaymentSerializer(ModelSerializer):
    class Meta:
        model = Payment
        fields = ["id", "order", "amount", "payment_status"]
