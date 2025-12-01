from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import User, Booking, Attendance
from datetime import date, time


class UserAPITestCase(TestCase):
    """Test cases for User API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'role': 'U',
            'gender': 'M',
            'age': 30,
            'weight': 75.5,
            'email': 'john@example.com',
            'password': 'password123'
        }
    
    def test_create_user(self):
        """Test creating a new user"""
        response = self.client.post('/api/users/', self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['email'], 'john@example.com')
    
    def test_list_users(self):
        """Test listing all users"""
        User.objects.create(**self.user_data)
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_retrieve_user(self):
        """Test retrieving a specific user"""
        user = User.objects.create(**self.user_data)
        response = self.client.get(f'/api/users/{user.user_no}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'john@example.com')
    
    def test_update_user(self):
        """Test updating a user"""
        user = User.objects.create(**self.user_data)
        updated_data = {**self.user_data, 'age': 31}
        response = self.client.put(f'/api/users/{user.user_no}/', updated_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['age'], 31)
    
    def test_delete_user(self):
        """Test deleting a user"""
        user = User.objects.create(**self.user_data)
        response = self.client.delete(f'/api/users/{user.user_no}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    
    def test_get_user_by_email(self):
        """Test getting user by email"""
        User.objects.create(**self.user_data)
        response = self.client.get(f'/api/users/by_email/?email=john@example.com')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'john@example.com')


class BookingAPITestCase(TestCase):
    """Test cases for Booking API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.booking_data = {
            'date': '2025-12-20',
            'start_time': '14:00:00',
            'end_time': '15:00:00',
            'capacity': 20,
            'remaining_positions': 20
        }
        self.user_data = {
            'first_name': 'Jane',
            'last_name': 'Smith',
            'role': 'U',
            'gender': 'F',
            'age': 28,
            'weight': 65.0,
            'email': 'jane@example.com',
            'password': 'password123'
        }
    
    def test_create_booking(self):
        """Test creating a new booking"""
        response = self.client.post('/api/bookings/', self.booking_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['capacity'], 20)
    
    def test_list_bookings(self):
        """Test listing all bookings"""
        Booking.objects.create(**self.booking_data)
        response = self.client.get('/api/bookings/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_available_bookings(self):
        """Test getting available bookings"""
        Booking.objects.create(**self.booking_data)
        response = self.client.get('/api/bookings/available_bookings/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)
    
    def test_add_attendee_to_booking(self):
        """Test adding an attendee to a booking"""
        booking = Booking.objects.create(**self.booking_data)
        user = User.objects.create(**self.user_data)
        
        response = self.client.post(
            f'/api/bookings/{booking.booking_no}/add_attendee/',
            {'user_no': user.user_no}
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Check that remaining positions decreased
        booking.refresh_from_db()
        self.assertEqual(booking.remaining_positions, 19)
    
    def test_get_booking_attendees(self):
        """Test getting attendees for a booking"""
        booking = Booking.objects.create(**self.booking_data)
        user = User.objects.create(**self.user_data)
        Attendance.objects.create(booking_no=booking, user_no=user)
        
        response = self.client.get(f'/api/bookings/{booking.booking_no}/get_attendees/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)


class AttendanceAPITestCase(TestCase):
    """Test cases for Attendance API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(
            first_name='Bob',
            last_name='Johnson',
            role='U',
            gender='M',
            age=35,
            weight=80.0,
            email='bob@example.com',
            password='password123'
        )
        self.booking = Booking.objects.create(
            date='2025-12-25',
            start_time='10:00:00',
            end_time='11:00:00',
            capacity=10,
            remaining_positions=10
        )
    
    def test_create_attendance(self):
        """Test creating an attendance record"""
        data = {
            'booking_no': self.booking.booking_no,
            'user_no': self.user.user_no
        }
        response = self.client.post('/api/attendance/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_list_attendance(self):
        """Test listing all attendance records"""
        Attendance.objects.create(booking_no=self.booking, user_no=self.user)
        response = self.client.get('/api/attendance/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
