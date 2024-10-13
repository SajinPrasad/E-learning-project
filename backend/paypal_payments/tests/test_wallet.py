from decimal import Decimal
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.db import transaction

from ..models import AdminWallet, MentorWallet

class WalletTests(TestCase):
    def setUp(self):
        self.User = get_user_model()
        # Create a mentor user
        self.mentor = self.User.objects.create_user(
            username='testmentor',
            email='mentor@test.com',
            password='testpass123',
            role=self.User.MENTOR
        )
        # Create a student user
        self.student = self.User.objects.create_user(
            username='teststudent',
            email='student@test.com',
            password='testpass123',
            role=self.User.STUDENT
        )

    def test_mentor_wallet_creation(self):
        """Test that a wallet is automatically created for mentors"""
        self.assertTrue(hasattr(self.mentor, 'mentorwallet'))
        self.assertEqual(self.mentor.mentorwallet.balance, Decimal('0.00'))

    def test_student_no_wallet(self):
        """Test that students don't get a wallet"""
        with self.assertRaises(MentorWallet.DoesNotExist):
            self.student.mentorwallet

    def test_admin_wallet_singleton(self):
        """Test that only one admin wallet exists"""
        self.assertEqual(AdminWallet.objects.count(), 1)
        
    def test_wallet_balance_update(self):
        """Test updating wallet balance"""
        wallet = self.mentor.mentorwallet
        initial_balance = wallet.balance
        
        # Update balance
        new_amount = Decimal('50.00')
        with transaction.atomic():
            wallet.balance += new_amount
            wallet.save()
        
        # Refresh from database
        wallet.refresh_from_db()
        self.assertEqual(wallet.balance, initial_balance + new_amount)

    def test_user_role_change(self):
        """Test what happens when a user's role changes"""
        # Change student to mentor
        with transaction.atomic():
            self.student.role = self.User.MENTOR
            self.student.save()
        
        # Check if wallet was created
        self.assertTrue(hasattr(self.student, 'mentorwallet'))
        
        # Change back to student
        with transaction.atomic():
            self.student.role = self.User.STUDENT
            self.student.save()
        
        # Check if wallet was removed (this assumes your signal deletes the wallet)
        with self.assertRaises(MentorWallet.DoesNotExist):
            self.student.mentorwallet