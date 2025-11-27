from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from .models import Appusers
from .serializers import UsersSerializer
def welcome(request):
   return HttpResponse('Welcome to BoutiqueFitness')

# @csrf_exempt
# def users_list(request):
    
#     if request.method == "GET":
#         users = Appusers.objects.all()
#         serializer = UsersSerializer(users, many=True)
#         return JsonResponse(serializer.data, safe=False)

#     elif request.method == "POST":
#         data = JSONParser().parse(request)
#         serializer = UsersSerializer(data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return JsonResponse(serializer.data, status=201)
#         return JsonResponse(serializer.errors, status=400)

# @csrf_exempt
# def user_detail(request, pk):
#     """
#     Retrieve, update or delete a code snippet.
#     """
#     try:
#         user = Appusers.objects.get(pk=pk)
#     except Users.DoesNotExist:
#         return HttpResponse(status=404)

#     if request.method == "GET":
#         serializer = UsersSerializer(user)
#         return JsonResponse(serializer.data)

#     elif request.method == "PUT":
#         data = JSONParser().parse(request)
#         serializer = UsersSerializer(user, data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return JsonResponse(serializer.data)
#         return JsonResponse(serializer.errors, status=400)

#     elif request.method == "DELETE":
#         user.delete()
#         return HttpResponse(status=204)