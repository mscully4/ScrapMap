from rest_framework import serializers
from rest_framework_jwt.settings import api_settings
import random
import hashlib
import io
from PIL import Image
from django.core.files.uploadedfile import InMemoryUploadedFile, TemporaryUploadedFile
from the_big_username_blacklist import validate

# from django.contrib.auth.models import User
from .models import Destination, Place, PlaceImages, User

from datetime import datetime

# Serializer for User log-ins
class UserSerializerLogin(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'id', 'first_name', 'last_name')

# Serializer for sign-ups
class UserSerializerSignUp(serializers.ModelSerializer):
    # this field is generated using the get_token method below
    token = serializers.SerializerMethodField()

    # write only means that this field will not be serialized
    password = serializers.CharField(write_only=True)

    # there are a couple of usernames that we don't want people taking
    def validate_username(self, value):
        if not validate(value) or value.lower() in ('backend', 'core', 'password_reset'):
            raise serializers.ValidationError("Invalid Username: Please Try Another")
        return value

    # passwords need to have at least 7 characters
    def validate_password(self, value):
        if len(value) < 7:
            raise serializers.ValidationError("Password Must Be At Least 7 Characters")
        return value

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        '''
        Creates a new user
        '''
        # remove password from the validated data
        password = validated_data.pop('password', None)

        # create an instance on the model with the validated data
        instance = self.Meta.model(**validated_data)

        # this hashes the password
        if password is not None:
            instance.set_password(password)

        # save the instance to the DB
        instance.save()

        return instance

    class Meta:
        model = User
        fields = ('id', 'token', 'username', 'password','first_name', 'last_name', 'email')

class DestinationSerializer(serializers.ModelSerializer):

    user = serializers.SerializerMethodField()

    def get_user(self, obj):
        return obj.user_id

    places = serializers.SerializerMethodField()

    def get_places(self, obj):
        places = Place.objects.filter(destination=obj.pk)
        return [PlaceSerializer(place).data for place in Place.objects.filter(destination=obj.pk)]

    class Meta:
        model = Destination
        fields = ('pk', "city", "country", "countryCode", "latitude", "longitude", "user", "places")

     # called when a new city is created
    def create(self, validated_data):
        '''
        Create a new destination
        '''
        validated_data['user'] = self.context['request'].user
        return Destination.objects.create(**validated_data)

    def update(self, instance, validated_data):
        '''
        Edit an existing destination
        '''
        # update all the fields of the Destination Model object
        instance.city = validated_data.get('city', instance.city)
        instance.country = validated_data.get('country', instance.country)
        instance.latitude = validated_data.get('latitude', instance.latitude)
        instance.longitude = validated_data.get('longitude', instance.longitude)
        instance.save()

        return instance


class PlaceSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()

    # serializes the image information, the actual images are hosted on S3
    def get_images(self, obj):
        images = [{'pk': obj.pk, 'src': obj.image.url, 'width': obj.width, 'height': obj.height, 'name': obj.image.__str__() } for obj in PlaceImages.objects.filter(place=obj.pk)]
        return images

    class Meta:
        model = Place
        fields= ('pk', 'destination', 'name', 'address', 'city', 'state',
            'country', 'zip_code', 'latitude', 'longitude', 'placeId', 'types', 'images', 'main_type')

    def create(self, validated_data):
        '''
        The creation of a new place
        '''
        validated_data['user']=self.context['request'].user
        instance=Place.objects.create(**validated_data)
        return instance

    def update(self, instance, validated_data):
        '''
        Editing an existing place
        '''
        # update all the fields of the Destination Model object
        instance.name = validated_data.get('name', instance.name)
        instance.address = validated_data.get('address', instance.address)
        instance.city = validated_data.get('city', instance.city)
        instance.state = validated_data.get('state', instance.state)
        instance.zip_code = validated_data.get('zip_code', instance.zip_code)
        instance.country = validated_data.get('country', instance.country)
        instance.latitude = validated_data.get('latitude', instance.latitude)
        instance.longitude = validated_data.get('longitude', instance.longitude)
        instance.main_type = validated_data.get('main_type', instance.main_type)

        # save the new information to the instance
        instance.save()

        image_names=[i.image.name for i in PlaceImages.objects.filter(place = instance)]

        # if the request has images attached to it
        if self.context['request'].FILES:
            images=self.context['request'].FILES.getlist('images')
            # iterate over the list of images
            for i in range(len(images)):
                image=images[i]
                img = Image.open(images[i])
                height, width = img.height, img.width

                # generate a unique name for the image
                name = "{}/{}".format(self.context['request'].user,hashlib.sha224(image.__dict__['file'].read()).hexdigest() + ".png")
                print("Image: " + name)

                # check to see if the image is already in the database
                if name not in image_names:
                    image.__dict__['_name'] = name
                    ## this was for the now dead image editor
                    # if images[i].__dict__['content_type'] != "image/png":
                    #     # convert all incoming images to PNG for consistency/the Image Editor needs all images to be PNGs
                    #     buffer=io.BytesIO()
                    #     Image.open(images[i]).save(buffer, "PNG")
                    #     image=InMemoryUploadedFile(
                    #         buffer, None, name, 'image/png', buffer.getbuffer().nbytes, None)
                    PlaceImages.objects.create(place=instance, image=image, width=width, height=height)
        return instance


class PlaceImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model=PlaceImages
        fields=("__all__")
