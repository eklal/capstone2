from django.db import models


class User(models.Model):
    ROLE_CHOICES = [
        ('A', 'Admin'),
        ('S', 'Staff'),
        ('U', 'User'),
    ]
    
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    
    user_no = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    role = models.CharField(max_length=1, choices=ROLE_CHOICES)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    age = models.IntegerField()
    weight = models.FloatField()
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    
    class Meta:
        db_table = 'users'
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Payment(models.Model):
    payment_no = models.AutoField(primary_key=True)
    user_no = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    amount = models.FloatField()
    date = models.DateField()
    
    class Meta:
        db_table = 'payments'
    
    def __str__(self):
        return f"Payment {self.payment_no} - User {self.user_no}"


class Product(models.Model):
    product_no = models.AutoField(primary_key=True)
    product_name = models.CharField(max_length=255)
    product_category = models.CharField(max_length=10)
    
    class Meta:
        db_table = 'products'
    
    def __str__(self):
        return self.product_name


class MediaFile(models.Model):
    MEDIA_TYPE_CHOICES = [
        ('I', 'Image'),
        ('V', 'Video'),
        ('D', 'Document'),
    ]
    
    STATUS_CHOICES = [
        ('A', 'Active'),
        ('AR', 'Archived'),
        ('I', 'Inactive'),
    ]
    
    media_no = models.AutoField(primary_key=True)
    media_type = models.CharField(max_length=1, choices=MEDIA_TYPE_CHOICES)
    upload_date = models.DateField()
    status = models.CharField(max_length=2, choices=STATUS_CHOICES)
    product_no = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='media_files')
    
    class Meta:
        db_table = 'media_files'
    
    def __str__(self):
        return f"Media {self.media_no} - {self.get_media_type_display()}"


class Subscription(models.Model):
    SUBSCRIBER_CATEGORY_CHOICES = [
        ('T', 'Trainer'),
        ('C', 'Customer'),
        ('V', 'VIP'),
    ]
    
    subscription_no = models.AutoField(primary_key=True)
    user_no = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    product_no = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='subscriptions')
    subscriber_category = models.CharField(max_length=1, choices=SUBSCRIBER_CATEGORY_CHOICES)
    
    class Meta:
        db_table = 'subscriptions'
    
    def __str__(self):
        return f"Subscription {self.subscription_no} - User {self.user_no}"


class Booking(models.Model):
    booking_no = models.AutoField(primary_key=True)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    capacity = models.IntegerField()
    remaining_positions = models.IntegerField()
    
    class Meta:
        db_table = 'bookings'
    
    def __str__(self):
        return f"Booking {self.booking_no} - {self.date}"


class Attendance(models.Model):
    attendance_no = models.AutoField(primary_key=True)
    booking_no = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='attendances')
    user_no = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attendances')
    
    class Meta:
        db_table = 'attendance'
    
    def __str__(self):
        return f"Attendance {self.attendance_no} - Booking {self.booking_no} - User {self.user_no}"
