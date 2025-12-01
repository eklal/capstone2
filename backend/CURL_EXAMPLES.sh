#!/bin/bash
# Booking API - Curl Command Examples
# This file contains useful curl commands to test the Booking API

# Base URL
BASE_URL="http://localhost:8000/api"

echo "=========================================="
echo "Booking API - Curl Command Examples"
echo "=========================================="
echo ""

# ==========================================
# USER OPERATIONS
# ==========================================
echo ">>> USER OPERATIONS <<<"
echo ""

# 1. Create a new user
echo "1. Create a new user:"
echo "curl -X POST $BASE_URL/users/ \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"first_name\": \"John\","
echo "    \"last_name\": \"Doe\","
echo "    \"role\": \"U\","
echo "    \"gender\": \"M\","
echo "    \"age\": 30,"
echo "    \"weight\": 75.5,"
echo "    \"email\": \"john@example.com\","
echo "    \"password\": \"password123\""
echo "  }'"
echo ""

# 2. List all users
echo "2. List all users:"
echo "curl $BASE_URL/users/"
echo ""

# 3. Get a specific user
echo "3. Get user with ID 1:"
echo "curl $BASE_URL/users/1/"
echo ""

# 4. Get user by email
echo "4. Get user by email:"
echo "curl \"$BASE_URL/users/by_email/?email=john@example.com\""
echo ""

# 5. Update a user
echo "5. Update user 1:"
echo "curl -X PUT $BASE_URL/users/1/ \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"first_name\": \"Johnny\","
echo "    \"last_name\": \"Doe\","
echo "    \"role\": \"U\","
echo "    \"gender\": \"M\","
echo "    \"age\": 31,"
echo "    \"weight\": 76.0,"
echo "    \"email\": \"johnny@example.com\","
echo "    \"password\": \"newpassword123\""
echo "  }'"
echo ""

# 6. Delete a user
echo "6. Delete user 1:"
echo "curl -X DELETE $BASE_URL/users/1/"
echo ""

# 7. Get user payments
echo "7. Get payments for user 1:"
echo "curl $BASE_URL/users/1/get_payments/"
echo ""

# 8. Get user subscriptions
echo "8. Get subscriptions for user 1:"
echo "curl $BASE_URL/users/1/get_subscriptions/"
echo ""

# ==========================================
# BOOKING OPERATIONS
# ==========================================
echo ">>> BOOKING OPERATIONS <<<"
echo ""

# 1. Create a new booking
echo "1. Create a new booking:"
echo "curl -X POST $BASE_URL/bookings/ \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"date\": \"2025-12-20\","
echo "    \"start_time\": \"14:00:00\","
echo "    \"end_time\": \"15:00:00\","
echo "    \"capacity\": 20,"
echo "    \"remaining_positions\": 20"
echo "  }'"
echo ""

# 2. List all bookings
echo "2. List all bookings:"
echo "curl $BASE_URL/bookings/"
echo ""

# 3. Get a specific booking
echo "3. Get booking with ID 1:"
echo "curl $BASE_URL/bookings/1/"
echo ""

# 4. Get available bookings
echo "4. Get all available bookings (with remaining positions):"
echo "curl $BASE_URL/bookings/available_bookings/"
echo ""

# 5. Add attendee to booking
echo "5. Add user 1 to booking 1:"
echo "curl -X POST $BASE_URL/bookings/1/add_attendee/ \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"user_no\": 1}'"
echo ""

# 6. Get booking attendees
echo "6. Get all attendees for booking 1:"
echo "curl $BASE_URL/bookings/1/get_attendees/"
echo ""

# 7. Remove attendee from booking
echo "7. Remove user 1 from booking 1:"
echo "curl -X DELETE $BASE_URL/bookings/1/remove_attendee/ \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"user_no\": 1}'"
echo ""

# 8. Update a booking
echo "8. Update booking 1:"
echo "curl -X PUT $BASE_URL/bookings/1/ \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"date\": \"2025-12-21\","
echo "    \"start_time\": \"15:00:00\","
echo "    \"end_time\": \"16:00:00\","
echo "    \"capacity\": 25,"
echo "    \"remaining_positions\": 25"
echo "  }'"
echo ""

# 9. Delete a booking
echo "9. Delete booking 1:"
echo "curl -X DELETE $BASE_URL/bookings/1/"
echo ""

# ==========================================
# PAYMENT OPERATIONS
# ==========================================
echo ">>> PAYMENT OPERATIONS <<<"
echo ""

# 1. Create a new payment
echo "1. Create a new payment:"
echo "curl -X POST $BASE_URL/payments/ \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"user_no\": 1,"
echo "    \"amount\": 99.99,"
echo "    \"date\": \"2025-11-27\""
echo "  }'"
echo ""

# 2. List all payments
echo "2. List all payments:"
echo "curl $BASE_URL/payments/"
echo ""

# 3. Get a specific payment
echo "3. Get payment with ID 1:"
echo "curl $BASE_URL/payments/1/"
echo ""

# ==========================================
# PRODUCT OPERATIONS
# ==========================================
echo ">>> PRODUCT OPERATIONS <<<"
echo ""

# 1. Create a new product
echo "1. Create a new product:"
echo "curl -X POST $BASE_URL/products/ \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"product_name\": \"Yoga Class\","
echo "    \"product_category\": \"fitness\""
echo "  }'"
echo ""

# 2. List all products
echo "2. List all products:"
echo "curl $BASE_URL/products/"
echo ""

# ==========================================
# SUBSCRIPTION OPERATIONS
# ==========================================
echo ">>> SUBSCRIPTION OPERATIONS <<<"
echo ""

# 1. Create a new subscription
echo "1. Create a new subscription:"
echo "curl -X POST $BASE_URL/subscriptions/ \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"user_no\": 1,"
echo "    \"product_no\": 1,"
echo "    \"subscriber_category\": \"C\""
echo "  }'"
echo ""

# 2. List all subscriptions
echo "2. List all subscriptions:"
echo "curl $BASE_URL/subscriptions/"
echo ""

# ==========================================
# MEDIA FILE OPERATIONS
# ==========================================
echo ">>> MEDIA FILE OPERATIONS <<<"
echo ""

# 1. Create a new media file
echo "1. Create a new media file:"
echo "curl -X POST $BASE_URL/media/ \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"media_type\": \"I\","
echo "    \"upload_date\": \"2025-11-27\","
echo "    \"status\": \"A\","
echo "    \"product_no\": 1"
echo "  }'"
echo ""

# 2. List all media files
echo "2. List all media files:"
echo "curl $BASE_URL/media/"
echo ""

# ==========================================
# ATTENDANCE OPERATIONS
# ==========================================
echo ">>> ATTENDANCE OPERATIONS <<<"
echo ""

# 1. Create attendance record
echo "1. Create an attendance record:"
echo "curl -X POST $BASE_URL/attendance/ \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"booking_no\": 1,"
echo "    \"user_no\": 1"
echo "  }'"
echo ""

# 2. List all attendance records
echo "2. List all attendance records:"
echo "curl $BASE_URL/attendance/"
echo ""

# ==========================================
# COMPLETE WORKFLOW EXAMPLE
# ==========================================
echo ">>> COMPLETE WORKFLOW EXAMPLE <<<"
echo ""
echo "Step 1: Create users"
echo "  curl -X POST $BASE_URL/users/ -H \"Content-Type: application/json\" -d '{...}'"
echo ""
echo "Step 2: Create a product"
echo "  curl -X POST $BASE_URL/products/ -H \"Content-Type: application/json\" -d '{...}'"
echo ""
echo "Step 3: Create a booking for that product"
echo "  curl -X POST $BASE_URL/bookings/ -H \"Content-Type: application/json\" -d '{...}'"
echo ""
echo "Step 4: Add users to the booking"
echo "  curl -X POST $BASE_URL/bookings/1/add_attendee/ -H \"Content-Type: application/json\" -d '{\"user_no\": 1}'"
echo ""
echo "Step 5: Record payment from user"
echo "  curl -X POST $BASE_URL/payments/ -H \"Content-Type: application/json\" -d '{...}'"
echo ""
echo "Step 6: Create subscription for product"
echo "  curl -X POST $BASE_URL/subscriptions/ -H \"Content-Type: application/json\" -d '{...}'"
echo ""
echo "Step 7: View all attendees for the booking"
echo "  curl $BASE_URL/bookings/1/get_attendees/"
echo ""

# ==========================================
# USEFUL TIPS
# ==========================================
echo ">>> USEFUL TIPS <<<"
echo ""
echo "1. Pretty print JSON responses:"
echo "   curl $BASE_URL/users/ | python -m json.tool"
echo ""
echo "2. Save response to file:"
echo "   curl $BASE_URL/users/ > users.json"
echo ""
echo "3. Include response headers:"
echo "   curl -i $BASE_URL/users/"
echo ""
echo "4. Show request and response details:"
echo "   curl -v $BASE_URL/users/"
echo ""
echo "5. Send data from file:"
echo "   curl -X POST $BASE_URL/users/ -H \"Content-Type: application/json\" -d @user.json"
echo ""
echo "=========================================="
echo "End of examples"
echo "=========================================="
