from django.apps import AppConfig
from decimal import Decimal
from django.db.models.signals import post_migrate


class PaypalPaymentsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "paypal_payments"

    def ready(self):
        # Connect to the post_migrate signal instead of running directly
        post_migrate.connect(self.create_admin_wallet, sender=self)

    def create_admin_wallet(self, sender, **kwargs):
        AdminWallet = sender.get_model("AdminWallet")
        try:
            admin_wallet, created = AdminWallet.objects.get_or_create(
                defaults={"balance": Decimal("0.00")}
            )
            if created:
                print("Created admin wallet successfully")
        except Exception as e:
            print(f"Error creating admin wallet: {str(e)}")
