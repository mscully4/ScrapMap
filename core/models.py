from django.db import models
from django.template.defaultfilters import slugify
from django.contrib.auth.models import User, AbstractUser
from django_countries.fields import CountryField
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

alpha = RegexValidator(r'^[a-zA-Z,. _\']*$', 'Only letters are allowed.')

def validate_latitude(lat):
    if not (-90 <= lat <= 90):
        raise ValidationError(_('Latitude must be between -90 and 90'))

def validate_longitude(lng):
    if not (-180 <= lng <= 180):
        raise ValidationError(_('Longitude must be between -180 and 180'))


class User(AbstractUser):
    email = models.EmailField(unique=True, blank=False, null=False)
    first_name = models.CharField(blank=False, null=False, max_length=60)
    last_name = models.CharField(blank=False, null=False, max_length=60)


class Destination(models.Model):
    #this allows one user to be linked to multiple destinations
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    city = models.CharField(max_length=120, validators=[alpha])
    country = models.CharField(max_length=120, validators=[alpha])
    countryCode = models.CharField(max_length=2, validators=[alpha])
    latitude = models.FloatField(default=0, validators=[validate_latitude])
    longitude = models.FloatField(default=0, validators=[validate_longitude])

    def __str__(self):
        return self.city

# class DestinationImages(models.Model):
#     destination = models.ForeignKey(Destination, on_delete=models.CASCADE)
#     image = models.ImageField(blank=True, null=True)
#     name = models.CharField(max_length=500, blank=True, null=True)

#     def __str__(self):
#         return self.image.name

class Place(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE)
    name = models.CharField(max_length=120, validators=[alpha])
    address = models.CharField(max_length=150, blank=True, null=True)
    city = models.CharField(max_length=60, validators=[alpha])
    # county = models.CharField(max_length=100, null=True, blank=True, validators=[alpha])
    state = models.CharField(max_length=50, null=True, blank=True, validators=[alpha])
    country = models.CharField(max_length=50, validators=[alpha])
    # countryCode = models.CharField(max_length=2, null=True, blank=True, validators=[alpha])
    zip_code = models.CharField(max_length=6, null=True, blank=True, default="00000")
    latitude = models.FloatField(default=0, validators=[validate_latitude])
    longitude = models.FloatField(default=0, validators=[validate_longitude])
    placeId = models.CharField(max_length=150, null=True, blank=True)
    types = models.CharField(max_length=500, null=True, blank=True, validators=[alpha])
    main_type = models.CharField(max_length=100, default="establishment", validators=[alpha])

class PlaceImages(models.Model):
    place = models.ForeignKey(Place, on_delete=models.CASCADE)
    image = models.ImageField(blank=True, null=True)
    name = models.CharField(max_length=500, blank=True, null=True)
    width = models.IntegerField()
    height = models.IntegerField()

    def __str__(self):
        return self.image.name