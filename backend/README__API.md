API

A lightweight Django REST Framework API for managing users, bookings, payments, products, subscriptions, and attendance—built for fitness/training businesses.

Features

User, booking, payment, product & subscription management

Attendance + capacity tracking

Role-based users (Admin/Staff/User)

Media file support

Clean REST API with DRF

Fully browsable API + Django admin

Tech Stack

Django 4.2, Django REST Framework

Python 3.9+

SQLite (default) — easily switchable to PostgreSQL/MySQL

Installation
pip install djangorestframework
python manage.py makemigrations booking
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver


API: http://localhost:8000/api/
Admin: http://localhost:8000/admin/

Quick Examples

Create a user:

curl -X POST http://localhost:8000/api/users/ -H "Content-Type: application/json" \
-d '{"first_name":"John","last_name":"Doe","role":"U","email":"john@example.com","password":"pass"}'


Create a booking:

curl -X POST http://localhost:8000/api/bookings/ \
-d '{"date":"2025-12-20","start_time":"14:00","end_time":"15:00","capacity":20,"remaining_positions":20}'


Add attendee:

curl -X POST http://localhost:8000/api/bookings/1/add_attendee/ -d '{"user_no":1}'

Endpoints (Summary)

/users/ – Users CRUD + payments/subscriptions

/bookings/ – Bookings CRUD + attendees + availability

/payments/ – Payment records

/products/ – Products/services

/subscriptions/ – User subscriptions

/media/ – Media files

/attendance/ – Attendance records

Project Structure
booking/
  models.py
  serializers.py
  views.py
  urls.py
  tests.py

Testing
python manage.py test booking

Production Notes

Set DEBUG = False

Use environment variables for secrets

Add authentication (JWT/Token)

Switch to PostgreSQL/MySQL

Enable permissions & HTTPS