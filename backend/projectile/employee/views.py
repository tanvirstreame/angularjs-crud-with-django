from django.shortcuts import render
from rest_framework import generics
from employee.models import Employee
from employee.serializers import EmployeeSerializer
# Create your views here.

class EmployeeList(generics.ListCreateAPIView):
  queryset= Employee.objects.all()
  serializer_class = EmployeeSerializer


