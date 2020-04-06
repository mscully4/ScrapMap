from django.db import models
from django.template.defaultfilters import slugify
from django.contrib.auth.models import User
from django_countries.fields import CountryField
from django.dispatch import receiver
from django.db.models.signals import post_save


# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  
    email = models.CharField(max_length=120)
    first_name = models.CharField(max_length=60)
    last_name = models.CharField(max_length=60)
    city = models.CharField(max_length=120)
    country = models.CharField(max_length=120)
    zip_code = models.CharField(max_length=6)

# @receiver(post_save, sender=User)
# def create_user_profile(sender, instance, created, **kwargs):
#     if created:
#         UserInfo.objects.create(user=instance)

# @receiver(post_save, sender=User)
# def save_user_profile(sender, instance, **kwargs):
#     instance.userinfo.save()

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
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE)
    name = models.CharField(max_length=240)
    address = models.CharField(max_length=300, blank=True, null=True)
    city = models.CharField(max_length=60)
    county = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=50, null=True, blank=True)
    country = models.CharField(max_length=50)
    countryCode = models.CharField(max_length=2, null=True, blank=True)
    latitude = models.FloatField(default=0)
    longitude = models.FloatField(default=0)
    placeId = models.CharField(max_length=150, null=True, blank=True)
    types = models.CharField(max_length=500, null=True, blank=True)
    main_type = models.CharField(max_length=100, default="establishment")

class PlaceImages(models.Model):
    place = models.ForeignKey(Place, on_delete=models.CASCADE)
    image = models.ImageField(blank=True, null=True)
    name = models.CharField(max_length=500, blank=True, null=True)

    def __str__(self):
        return self.image.name