from django.db import models
from django.template.defaultfilters import slugify
from django.contrib.auth.models import User

# Create your models here.
class Destination(models.Model):
    #this allows one user to be linked to multiple destinations
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    city = models.CharField(max_length=120)
    country = models.CharField(max_length=120)
    latitude = models.FloatField(default=0)
    longitude = models.FloatField(default=0)
    #user = models.CharField(max_length=120)

    def __str__(self):
        return self.city

class DestinationImages(models.Model):
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE)
    image = models.FileField(blank=True, null=True)

    def __str__(self):
        return self.image.name