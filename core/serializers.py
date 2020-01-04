from rest_framework import serializers
from rest_framework_jwt.settings import api_settings
from django.contrib.auth.models import User
from .models import Destination, DestinationImages
import random
# from PIL import image
# from PIL.ExifTags import TAGS, GPSTAGS

import logging

logger = logging.getLogger('django')

#Serializer for User log-ins
class UserSerializerLogin(serializers.ModelSerializer):
    class Meta:
        model = User
        #only serialize the username and id fields
        fields = ('username', 'id')

#Serializer for sign-ups
class UserSerializerSignUp(serializers.ModelSerializer):
    #this field is generated using the get_token method below
    token = serializers.SerializerMethodField()
    #write only means that this field will not be serialized
    password = serializers.CharField(write_only=True)

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        #remove password from the validated data
        password = validated_data.pop('password', None)
        #create an instance on the model with the validated data
        instance = self.Meta.model(**validated_data)
        
        #this hashes the password
        if password is not None:
            instance.set_password(password)
        
        #save the instance to the DB
        instance.save()
        return instance

    class Meta:
        #Use Django's built in User class
        model = User
        #serialize these fields
        fields = ('token', 'username', 'password')

#This is the serializer for new cities entered or when the user has a token stored on the browser
class DestinationListSerializer(serializers.ModelSerializer):
    urls = serializers.SerializerMethodField()
    def get_urls(self, obj):
        urls = [obj.image.url for obj in DestinationImages.objects.filter(destination=obj.pk)]
        # if len(urls) > 2: 
        #     return random.sample(urls, 2)
        return urls
    
    class Meta:
        model = Destination
        fields = ('pk', "city", "country", "countryCode", "latitude", "longitude", "urls")

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        #image_data = self.context.get('view').request.FILES
        #logger.info(image_data)
        instance = Destination.objects.create(**validated_data)
        print(validated_data)
        # #if the request has files attached to it
        if self.context['request'].FILES:
            images = self.context['request'].FILES.getlist('images')
            #iterate over the list of images
            for i in range(len(images)):
                #And create a new image object
                DestinationImages.objects.create(destination=instance, image=images[i])
        
        return instance

class DestinationSerializer(serializers.ModelSerializer):
    #retrieve the image urls that correspond to the destination
    urls = serializers.SerializerMethodField()
    def get_urls(self, obj):
        urls = [el.image.url for el in DestinationImages.objects.filter(destination=obj.pk)]
        return urls

    user = serializers.SerializerMethodField()
    def get_user(self, obj):
        return obj.user_id

    class Meta:
        model = Destination
        fields = ('pk', "city", "country", "latitude", "longitude", "user", "urls")

    def update(self, instance, validated_data):
        #update all the fields of the Destination Model object
        instance.city = validated_data.get('city', instance.city)
        instance.country = validated_data.get('country', instance.country)
        instance.latitude = validated_data.get('latitude', instance.latitude)
        instance.longitude = validated_data.get('longitude', instance.longitude)
        instance.save()

        # #if the request has files attached to it
        if self.context['request'].FILES:
            images = self.context['request'].FILES.getlist('images')
            #iterate over the list of images
            for i in range(len(images)):
                # print(gpsphoto.getGPSData(image[i]))
                #And create a new image object
                DestinationImages.objects.create(destination=instance, image=images[i])
        return instance


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model=DestinationImages
        fields="__all__"

    def create(self, validated_data):
        images = self.context['request'].FILES.getlist('images')
        for i in range(len(images)):
            DestinationImages.objects.create(image=images[i])
        return super(FileSerializer, self).create(validated_data)


class DestinationImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = DestinationImages
        fields=("__all__")