# Generated by Django 5.0.7 on 2024-08-04 11:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_alter_customuser_is_staff'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mentorprofile',
            name='date_of_birth',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='studentprofile',
            name='date_of_birth',
            field=models.DateField(blank=True, null=True),
        ),
    ]