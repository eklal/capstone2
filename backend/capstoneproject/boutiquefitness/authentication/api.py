from .models import Appusers,bookings, bookings_attendance
from .serializers import UsersSerializer,bookingsSerializers,bookingsattendanceSerializers
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt


class UsersList(APIView):

    def get(self, request, format=None):
        users = Appusers.objects.all()
        serializer = UsersSerializer(users, many=True)
        return Response(serializer.data)
    @csrf_exempt
    def post(self, request, format=None):
        serializer = UsersSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetail(APIView):
   

    def get_object(self, pk):
        try:
            return Appusers.objects.get(pk=pk)
        except Appusers.DoesNotExist:
            raise Http404
    @csrf_exempt
    def get(self, request, pk, format=None):
        user = self.get_object(pk)
        serializer = UsersSerializer(user)
        return Response(serializer.data)

    @csrf_exempt
    def put(self, request, pk, format=None):
        user = self.get_object(pk)
        serializer = UsersSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    @csrf_exempt
    def delete(self, request, pk, format=None):
        user = self.get_object(pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class BookingsList(APIView):

    def get(self, request, format=None):
        readybookings = bookings.objects.all()
        serializer = bookingsSerializers(readybookings, many=True)
        return Response(serializer.data)
    @csrf_exempt
    def post(self, request, format=None):
        serializer = bookingsSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BookingDetail(APIView):
   

    def get_object(self, pk):
        try:
            return bookings.objects.get(pk=pk)
        except bookings.DoesNotExist:
            raise Http404
    @csrf_exempt
    def get(self, request, pk, format=None):
        readybookings = self.get_object(pk)
        serializer = bookingsSerializers(readybookings)
        return Response(serializer.data)

    @csrf_exempt
    def put(self, request, pk, format=None):
        readybookings = self.get_object(pk)
        serializer = bookingsSerializers(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    @csrf_exempt
    def delete(self, request, pk, format=None):
        readybookings = self.get_object(pk)
        readybookings.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class AttendanceList(APIView):

    def get(self, request, format=None):
        attendance = bookings_attendance.objects.all()
        serializer = bookingsattendanceSerializers(attendance, many=True)
        return Response(serializer.data)
    @csrf_exempt
    def post(self, request, format=None):
        serializer = bookingsattendanceSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AttendanceDetail(APIView):
   

    def get_object(self, pk):
        try:
            return bookings_attendance.objects.get(pk=pk)
        except bookings_attendance.DoesNotExist:
            raise Http404
    @csrf_exempt
    def get(self, request, pk, format=None):
        attendance = self.get_object(pk)
        serializer = UsersSerializer(user)
        return Response(serializer.data)

    @csrf_exempt
    def put(self, request, pk, format=None):
        attendance = self.get_object(pk)
        serializer = bookingsattendanceSerializers(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    @csrf_exempt
    def delete(self, request, pk, format=None):
        attendance = self.get_object(pk)
        attendance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

