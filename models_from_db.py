# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class CartCart(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    user = models.OneToOneField('UsersCustomuser', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'cart_cart'


class CartCartitem(models.Model):
    id = models.BigAutoField(primary_key=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField()
    added_at = models.DateTimeField()
    cart = models.ForeignKey(CartCart, models.DO_NOTHING)
    course = models.ForeignKey('CoursesCourse', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'cart_cartitem'
        unique_together = (('cart', 'course'),)


class CartOrder(models.Model):
    id = models.BigAutoField(primary_key=True)
    order_status = models.CharField(max_length=20)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    user = models.ForeignKey('UsersCustomuser', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'cart_order'


class CartOrdercourse(models.Model):
    id = models.BigAutoField(primary_key=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField()
    course = models.ForeignKey('CoursesCourse', models.DO_NOTHING)
    order = models.ForeignKey(CartOrder, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'cart_ordercourse'


class CartPayment(models.Model):
    id = models.BigAutoField(primary_key=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=20)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    order = models.OneToOneField(CartOrder, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'cart_payment'


class CoursesCategory(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(unique=True, max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    parent = models.ForeignKey('self', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'courses_category'


class CoursesCourse(models.Model):
    id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    preview_image = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    category = models.ForeignKey(CoursesCategory, models.DO_NOTHING, blank=True, null=True)
    mentor = models.ForeignKey('UsersCustomuser', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'courses_course'


class CoursesCourserequirement(models.Model):
    id = models.BigAutoField(primary_key=True)
    description = models.TextField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    course = models.OneToOneField(CoursesCourse, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'courses_courserequirement'


class CoursesEnrollment(models.Model):
    id = models.BigAutoField(primary_key=True)
    purchased_at = models.DateTimeField()
    is_active = models.BooleanField()
    course = models.ForeignKey(CoursesCourse, models.DO_NOTHING)
    user = models.ForeignKey('UsersCustomuser', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'courses_enrollment'
        unique_together = (('user', 'course'),)


class CoursesLesson(models.Model):
    id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=255)
    content = models.TextField()
    video_file = models.CharField(max_length=100, blank=True, null=True)
    order = models.IntegerField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    course = models.ForeignKey(CoursesCourse, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'courses_lesson'


class CoursesPrice(models.Model):
    id = models.BigAutoField(primary_key=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    course = models.OneToOneField(CoursesCourse, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'courses_price'


class CoursesSuggestion(models.Model):
    id = models.BigAutoField(primary_key=True)
    suggestion_text = models.TextField()
    is_done = models.BooleanField()
    created_at = models.DateTimeField()
    is_approved = models.BooleanField()
    admin = models.ForeignKey('UsersCustomuser', models.DO_NOTHING)
    course = models.OneToOneField(CoursesCourse, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'courses_suggestion'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('UsersCustomuser', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class TokenBlacklistBlacklistedtoken(models.Model):
    id = models.BigAutoField(primary_key=True)
    blacklisted_at = models.DateTimeField()
    token = models.OneToOneField('TokenBlacklistOutstandingtoken', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'token_blacklist_blacklistedtoken'


class TokenBlacklistOutstandingtoken(models.Model):
    id = models.BigAutoField(primary_key=True)
    token = models.TextField()
    created_at = models.DateTimeField(blank=True, null=True)
    expires_at = models.DateTimeField()
    user = models.ForeignKey('UsersCustomuser', models.DO_NOTHING, blank=True, null=True)
    jti = models.CharField(unique=True, max_length=255)

    class Meta:
        managed = False
        db_table = 'token_blacklist_outstandingtoken'


class UsersAcademicspecialisation(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(unique=True, max_length=100)

    class Meta:
        managed = False
        db_table = 'users_academicspecialisation'


class UsersCustomuser(models.Model):
    id = models.BigAutoField(primary_key=True)
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    username = models.CharField(unique=True, max_length=150)
    email = models.CharField(unique=True, max_length=254)
    phone_number = models.CharField(max_length=128)
    is_active = models.BooleanField()
    is_verified = models.BooleanField()
    is_superuser = models.BooleanField()
    is_staff = models.BooleanField()
    date_joined = models.DateTimeField()
    role = models.CharField(max_length=10)

    class Meta:
        managed = False
        db_table = 'users_customuser'


class UsersCustomuserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    customuser = models.ForeignKey(UsersCustomuser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'users_customuser_groups'
        unique_together = (('customuser', 'group'),)


class UsersCustomuserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    customuser = models.ForeignKey(UsersCustomuser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'users_customuser_user_permissions'
        unique_together = (('customuser', 'permission'),)


class UsersInterestarea(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(unique=True, max_length=100)

    class Meta:
        managed = False
        db_table = 'users_interestarea'


class UsersMentorprofile(models.Model):
    id = models.BigAutoField(primary_key=True)
    profile_picture = models.CharField(max_length=100, blank=True, null=True)
    bio = models.TextField()
    date_of_birth = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    highest_education_level = models.CharField(max_length=20, blank=True, null=True)
    experience = models.DecimalField(max_digits=5, decimal_places=1, blank=True, null=True)
    average_rating = models.DecimalField(max_digits=3, decimal_places=1, blank=True, null=True)
    user = models.OneToOneField(UsersCustomuser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'users_mentorprofile'


class UsersMentorprofileInterestedAreas(models.Model):
    id = models.BigAutoField(primary_key=True)
    mentorprofile = models.ForeignKey(UsersMentorprofile, models.DO_NOTHING)
    interestarea = models.ForeignKey(UsersInterestarea, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'users_mentorprofile_interested_areas'
        unique_together = (('mentorprofile', 'interestarea'),)


class UsersMentorprofileSpecialisations(models.Model):
    id = models.BigAutoField(primary_key=True)
    mentorprofile = models.ForeignKey(UsersMentorprofile, models.DO_NOTHING)
    academicspecialisation = models.ForeignKey(UsersAcademicspecialisation, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'users_mentorprofile_specialisations'
        unique_together = (('mentorprofile', 'academicspecialisation'),)


class UsersOtp(models.Model):
    id = models.BigAutoField(primary_key=True)
    otp_code = models.CharField(unique=True, max_length=64)
    created_at = models.DateTimeField()
    expires_at = models.DateTimeField()
    user = models.ForeignKey(UsersCustomuser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'users_otp'


class UsersStudentprofile(models.Model):
    id = models.BigAutoField(primary_key=True)
    profile_picture = models.CharField(max_length=100, blank=True, null=True)
    bio = models.TextField()
    date_of_birth = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    highest_education_level = models.CharField(max_length=20, blank=True, null=True)
    current_education_level = models.CharField(max_length=20)
    expected_graduation_date = models.DateField(blank=True, null=True)
    user = models.OneToOneField(UsersCustomuser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'users_studentprofile'


class UsersStudentprofileInterestedAreas(models.Model):
    id = models.BigAutoField(primary_key=True)
    studentprofile = models.ForeignKey(UsersStudentprofile, models.DO_NOTHING)
    interestarea = models.ForeignKey(UsersInterestarea, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'users_studentprofile_interested_areas'
        unique_together = (('studentprofile', 'interestarea'),)
