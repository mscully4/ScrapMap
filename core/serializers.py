from rest_framework import serializers
from rest_framework_jwt.settings import api_settings
import random, hashlib, io
from PIL import Image
from django.core.files.uploadedfile import InMemoryUploadedFile, TemporaryUploadedFile



from django.contrib.auth.models import User
from .models import Destination, DestinationImages, Place, PlaceImages

import logging
logger = logging.getLogger('django')

def pictures_2png(file):
    buffer = StringIO()
    Image.open(file).save(buffer, "PNG")
    return InMemoryUploadedFile(buffer, None, 'test.png', 'image/png', buffer.nbytes, None)

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
# class DestinationListSerializer(serializers.ModelSerializer):
#     images = serializers.SerializerMethodField()
#     def get_images(self, obj):
#         images = [{'src': obj.image.url, 'width': obj.image.width, 'height': obj.image.height, 'name': obj.image.__str__()} for obj in DestinationImages.objects.filter(destination=obj.pk)]
#         return images

#     places = serializers.SerializerMethodField()
#     def get_places(self, obj):
#         places = Place.objects.filter(destination=obj.pk)
#         return [PlaceSerializer(place).data for place in Place.objects.filter(destination=obj.pk)]

#     class Meta:
#         model = Destination
#         fields = ('pk', "city", "country", "countryCode", "latitude", "longitude", "images", "places")

#     #called when a new city is created
#     def create(self, validated_data):
#         validated_data['user'] = self.context['request'].user
#         #image_data = self.context.get('view').request.FILES
#         #logger.info(image_data)
#         instance = Destination.objects.create(**validated_data)
#         print(validated_data)
#         # #if the request has files attached to it
#         # if self.context['request'].FILES:
#         #     images = self.context['request'].FILES.getlist('images')
#         #     #iterate over the list of images
#         #     for i in range(len(images)):
#         #         image = images[i]
#         #         name = hashlib.sha224(images[i].__dict__['file'].getvalue()).hexdigest() + ".png"
#         #         if images[i].__dict__['content_type'] != "image/png":
#         #             #convert all incoming images to PNG for consistency/the Image Editor needs all images to be PNGs
#         #             buffer = io.BytesIO()
#         #             Image.open(images[i]).save(buffer, "PNG")
#         #             #generate a unique name for the image
#         #             #TODO run check to see if the image had already been uploaded for the user
#         #             image = InMemoryUploadedFile(buffer, None, name, 'image/png', buffer.getbuffer().nbytes, None)
#         #             #new.__dict__["_name"] = name
#         #         DestinationImages.objects.create(destination=instance, image=image)
        
#         return instance

class DestinationSerializer(serializers.ModelSerializer):
    #retrieve the image urls that correspond to the destination
    images = serializers.SerializerMethodField()
    def get_images(self, obj):
        images = [{'src': obj.image.url, 'width': obj.image.width, 'height': obj.image.height, 'name': obj.name, 'name': obj.image.__str__() } for obj in DestinationImages.objects.filter(destination=obj.pk)]
        return images

    user = serializers.SerializerMethodField()
    def get_user(self, obj):
        return obj.user_id

    places = serializers.SerializerMethodField()
    def get_places(self, obj):
        places = Place.objects.filter(destination=obj.pk)
        return [PlaceSerializer(place).data for place in Place.objects.filter(destination=obj.pk)]

    class Meta:
        model = Destination
        fields = ('pk', "city", "country", "countryCode", "latitude", "longitude", "user", "images", "places")

     #called when a new city is created
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return Destination.objects.create(**validated_data)


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
                #Copy validation from DestinationList create method
                DestinationImages.objects.create(destination=instance, image=images[i])
        return instance

class PlaceSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()
    def get_images(self, obj):
        images = [{'src': obj.image.url, 'width': obj.image.width, 'height': obj.image.height, 'name': obj.name, 'name': obj.image.__str__() } for obj in PlaceImages.objects.filter(place=obj.pk)]
        return images

    class Meta:
        model = Place
        fields = ('pk', 'destination', 'name', 'address', 'city', 'county', 'state', 
            'country', 'latitude', 'longitude', 'placeId', 'types', 'images')

    def create(self, validated_data):
        '''
        The creation of a new place
        '''
        validated_data['user'] = self.context['request'].user
        instance = Place.objects.create(**validated_data)
        print(validated_data)
        #if the request has files attached to it
        # if self.context['request'].FILES:
        #     images = self.context['request'].FILES.getlist('images')
        #     #iterate over the list of images
        #     for i in range(len(images)):
        #         image = images[i]
        #         name = hashlib.sha224(images[i].__dict__['file'].getvalue()).hexdigest() + ".png"
        #         if images[i].__dict__['content_type'] != "image/png":
        #             #convert all incoming images to PNG for consistency/the Image Editor needs all images to be PNGs
        #             buffer = io.BytesIO()
        #             Image.open(images[i]).save(buffer, "PNG")
        #             #generate a unique name for the image
        #             #TODO run check to see if the image had already been uploaded for the user
        #             image = InMemoryUploadedFile(buffer, None, name, 'image/png', buffer.getbuffer().nbytes, None)
        #             #new.__dict__["_name"] = name
        #         PlaceImages.objects.create(destination=instance, image=image)
        return instance

    def update(self, instance, validated_data):
        #update all the fields of the Destination Model object
        instance.name = validated_data.get('name', instance.name)
        instance.number = validated_data.get('number', instance.number)
        instance.street = validated_data.get('street', instance.street)
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
                image = images[i]
                #raw = images[i].__dict__['file'].read()
                name = hashlib.sha224(image.__dict__['file'].read()).hexdigest() + ".png"
                print(name)
                image.__dict__['_name'] = name
                if images[i].__dict__['content_type'] != "image/png":
                    #convert all incoming images to PNG for consistency/the Image Editor needs all images to be PNGs
                    buffer = io.BytesIO()
                    Image.open(images[i]).save(buffer, "PNG")
                    #generate a unique name for the image
                    #TODO run check to see if the image had already been uploaded for the user
                    image = InMemoryUploadedFile(buffer, None, name, 'image/png', buffer.getbuffer().nbytes, None)
                place = Place.objects.get(pk=instance.pk)
                PlaceImages.objects.create(place=place, image=image)
        return instance


class DestinationImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = DestinationImages
        fields=("__all__")

class PlaceImagesSerializer(serializers.ModelSerializer):
    class Meta: 
        model = PlaceImages
        fields = ("__all__")