from django.db import models
class Users(models.Model):
    first_name = models.CharField(max_length=30,blank=False,default="")
    last_name = models.CharField(max_length=30,blank=True)
    email = models.EmailField()
    mobile_phone = models.CharField(max_length=15)

class Appusers(models.Model):
    first_name = models.CharField(max_length=30,blank=False,default="")
    last_name = models.CharField(max_length=30,blank=True)
    email = models.EmailField()
    mobile_phone = models.CharField(max_length=15)
    year_of_birth = models.IntegerField(default=2000)
    height_in_cm = models.IntegerField(default=0)
    weight = models.DecimalField(max_digits=3,decimal_places=1,default=0)
 
class bookings(models.Model):
    booking_date = models.DateField()
    bookingstart_time = models.TimeField()
    bookingend_time = models.TimeField()
    booking_capacity= models.IntegerField(default=0)
    booking_remaining = models.IntegerField(default=0)
class bookings_attendance(models.Model):
    bookingsNo = models.ForeignKey(bookings,on_delete=all)
    appusersNo = models.ForeignKey(Appusers,on_delete=all)

    def __str__(self):
        return self.bookingsNo


    
