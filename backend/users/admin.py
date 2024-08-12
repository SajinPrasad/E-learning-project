from django.contrib import admin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm

from .models import CustomUser

# Register your models here.

class CustomUserCreationForm(UserCreationForm):
    """
    Custom user creation form.
    """
    class Meta:
        model = CustomUser
        fields = ('first_name', 'last_name', 'email', 'role', 'password1', 
                  'password2')
        
class CustomUserChangeForm(UserChangeForm):
    """
    Custom user update form.
    """
    class Meta:
        model = CustomUser
        fields = ('first_name', 'last_name', 'email', 'role')

class CustomUserAdmin(admin.ModelAdmin):
    form = CustomUserCreationForm  # Use the custom creation form
    add_form = CustomUserCreationForm  # Use the same form for creating users
    change_form = CustomUserChangeForm  # Use a separate form for updating users

admin.site.register(CustomUser, CustomUserAdmin)