from django.db import models

# Create your models here.

class Employee(models.Model):
  first_name = models.CharField(max_length=50)
  last_name = models.CharField(max_length=50)
  age = models.IntegerField()
  address = models.CharField(max_length=100)
  email = models.CharField(max_length=100)