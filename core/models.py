from django.db import models
from django.template.defaultfilters import slugify
from django.contrib.auth.models import User

# Create your models here.
class Destination(models.Model):
    #this allows one user to be linked to multiple destinations
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    city = models.CharField(max_length=120)
    country = models.CharField(max_length=120)
    countryCode = models.CharField(max_length=2)
    latitude = models.FloatField(default=0)
    longitude = models.FloatField(default=0)
    #user = models.CharField(max_length=120)

    def __str__(self):
        return self.city

class DestinationImages(models.Model):
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE)
    image = models.ImageField(blank=True, null=True)
    name = models.CharField(max_length=500, blank=True, null=True)

    def __str__(self):
        return self.image.name

class Place(models.Model):
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE)
    name = models.CharField(max_length=240)
    number = models.CharField(max_length=40)
    street = models.CharField(max_length=80)
    city = models.CharField(max_length=60)
    state = models.CharField(max_length=15, null=True, blank=True)
    country = models.CharField(max_length=50)
    # address = models.CharField(max_length=240)
    # city = models.CharField(max_length=120)
    # country = models.CharField(max_length=120)
    latitude = models.FloatField(default=0)
    longitude = models.FloatField(default=0)

class PlaceImages(models.Model):
    place = models.ForeignKey(Place, on_delete=models.CASCADE)
    image = models.ImageField(blank=True, null=True)
    name = models.CharField(max_length=500, blank=True, null=True)

    def __str__(self):
        return self.image.name