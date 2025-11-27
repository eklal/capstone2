

from django.urls import path
from . import views
from authentication.api import UserDetail,UsersList, BookingsList,BookingDetail,AttendanceDetail, AttendanceList
urlpatterns = [
    path('',views.welcome,name = 'welcome'),
    path("users/",UsersList.as_view(), name= "usersList"),
    path("users/<int:pk>/",UserDetail.as_view(), name = "usersdetail"),
    path("bookings/",BookingsList.as_view(), name= "bookingList"),
    path("bookings/<int:pk>/",BookingDetail.as_view(), name = "usedetail"),
    path("attendance/",AttendanceList.as_view(), name= "attendanceList"),
    path("attendance/<int:pk>/",AttendanceDetail.as_view(), name = "attendancedetail"),
    
]
