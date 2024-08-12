from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import Token
from rest_framework_simplejwt.tokens import RefreshToken

from .utils import email_validation as email_is_valid, send_otp_email
from .services.otp import verify_otp


User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serlizer for validating registration requests and User creation.
    """
    password2 = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'password', 'password2', 'role')
        extra_kwargs = {
            'password': {'write_only': True},
            'password2': {'write_only': True}
        }
        
    def validate(self, data):
        """
        Password and email validation
        """
        if data['password'] != data['password2']:
            raise serializers.ValidationError('Passwords do not match!')

        password = data.get('password', '')
        email = data.get('email', '')
        
        #If user already exists with the same email
        try:
            user = User.objects.get(email=email)
            if user:
                raise serializers.ValidationError('Account already exists with entered email')
        except User.DoesNotExist:
            pass
        
        #Password length
        if len(password) < 6:
            raise serializers.ValidationError('Password length should be atleast 6!')
            
        #Uppercase and lower case letters
        if not any(char.isupper() for char in password):
            raise serializers.ValidationError('Password should contain atleast one uppercase letter')

        if not any(char.lower() for char in password):
            raise serializers.ValidationError('Password should contain atleast one lowercase letter')

        #Email validating
        valid, error_message = email_is_valid(email)
        if not valid:
            raise serializers.ValidationError(error_message)

        return data
    
    def create(self, validated_data):
        """
        Return user after creation
        """
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        user.is_verified = False
        user.save()

        send_otp_email(user)
        return user
    

class UserRegistrationResponseSerializer(serializers.ModelSerializer):
    """
    Serializer for returning necessary user data after registration.
    """
    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'username')


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for  validating Login requests and authenticating.
    """
    email = serializers.EmailField(max_length=150)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        """
        Validating and return user login information
        Raises validation error mismatch or invalid input.
        """

        email = data.get('email', None)
        password = data.get('password', None)
        if email is None:
            raise serializers.ValidationError('An email address is required to log in.')

        if password is None:
            raise serializers.ValidationError('A password is required to log in.')

        try:
            user = User.objects.get(email=email) #Checking the user exist or not.
        except User.DoesNotExist:
            raise serializers.ValidationError('A user with this email is not found.')

        user = authenticate(email=email, password=password)
        if not user:
            raise serializers.ValidationError('Invalid password!')
        
        if not user.is_active:
            raise serializers.ValidationError('This user is not currently activated.')
        
        if not user.is_verified:
            raise serializers.ValidationError('Account not verified')

        # Generate token
        refresh = RefreshToken.for_user(user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role,
            }
        }
    

class OTPVerificationSerializer(serializers.Serializer):
    """
    Serializer for verifying the otp during the authentication process.
    """
    otp_code = serializers.CharField(max_length=8)
    email = serializers.EmailField(max_length=150)

    def validate(self, data):
        """
        Validates the provided OTP against the user's stored OTP.
        Raises a ValidationError if the OTP is incorrect or expired.
        """
        email = data.get('email')
        otp_code = data.get('otp_code')
        is_valid, message = verify_otp(email, otp_code)
        if not is_valid:
            raise serializers.ValidationError({'non_field_errors': [message]})
        return data

    def save(self):
        """
        Changing the varification status to True and saving the user instance.
        Returns the user object after setting it to verified.
        """
        email = self.validated_data['email']
        user = User.objects.get(email=email)
        user.is_verified = True
        user.save()
        
        return user

class OTPResendSerializer(serializers.Serializer):
    """
    Serializer for validating the request to resend the OTP.
    """
    email = serializers.EmailField()

    def validate_email(self, value):
        """
        Validate the email and ensure the user exists and is eligible to receive an OTP.
        """
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")

        if user.is_verified:
            raise serializers.ValidationError("User is already verified.")
        
        if not user.is_active:
            raise serializers.ValidationError("User is not permitted for verification.")

        # Store the user in the serializer instance for use later
        self.user = user

        return value
