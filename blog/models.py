import os

from django.conf import settings
from django.db import models
from django.utils import timezone


class User(models.Model):
    User_Id = models.CharField(max_length=20, unique=True)
    User_Password = models.CharField(max_length=20)
    User_Nickname = models.CharField(max_length=20, unique=True)
    created_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.User_Nickname


class File(models.Model):
    File_Name = models.CharField(max_length=40)
    Owner = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    upload_date = models.DateTimeField(default=timezone.now)
    class Meta:
        unique_together = (('File_Name', 'Owner'),)


class Document(models.Model):
    file = models.FileField()
