from django.shortcuts import render

from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView 
from rest_framework.parsers import FileUploadParser

from .serializers import UserSerializerLogin, UserSerializerSignUp, DestinationSerializer, DestinationListSerializer, DestinationImagesSerializer, PlaceSerializer
from .models import Destination, DestinationImages, Place
from django.core import serializers
import json
import copy

import logging
logger = logging.getLogger('django')

#@api_view(['GET'])
#def CurrentUser(request):
#    '''
#    Determine the current user by their token and return their data
#    '''
#    user = UserSerializerLogin(request.user)
#    destinations = serializers.serialize("json", Destination.objects.filter(user=request.user))
#    return Response({
#        "user": user.data,
#        "destinations": json.loads(destinations),
#        })

class CurrentUser(APIView):
    '''
    Determine the current user by their token and return his/her data
    '''
    #GET requests only
    def get(self, request, format=None):
        #combine the user data with the destinations data
        data = {
            "user": UserSerializerLogin(request.user).data,
            "destinations": DestinationListSerializer(Destination.objects.filter(user=request.user), many=True).data,
        }
        return Response(data)

class CreateUser(APIView):
    '''
    Create a new user
    '''
    permission_classes = (permissions.AllowAny,)

    #POST requests only
    def post(self, request, format=None):
        serializer = UserSerializerSignUp(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.error("Cannot Create New User: %s" % serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#this returns the list of all destinations for a specified user and allows users to create new locations
class DestinationListView(APIView):
    '''
    Access destination data and create new destination entries
    '''
    permission_classes = (permissions.AllowAny,)
    #permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get(self, request, username=None, format=None):
        #logger.info(request.user)
        data = DestinationListSerializer(Destination.objects.filter(user=User.objects.get(username=username).pk if username != None else request.user), many=True)
        return Response({"destinations" : data.data})
    
    #this has to be here because there is no pk in the url path
    # #update: I think this can be deleted
    # def post(self, request, format=None):
    #     serializer = DestinationListSerializer(data=request.data, context={'request': request})
    #     print(request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     logger.error("Cannot Create Destination: %s" % serializer.errors)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#this is for individual destinations, for retreiving the data/editing or deleting existing ones
class DestinationView(APIView):
    '''
    Access/Manipulate Individual Destination Data
    '''
    permission_classes = (permissions.IsAuthenticated,)
    parser_class = (FileUploadParser,)

    #need to save primary key with marker and send it this way when viewing or editing an instance
    def get(self, request, pk, format=None):
        data = Destination.objects.get(pk=pk)
        serializer = DestinationSerializer(data)
        #for now users can only see their own data
        #TODO change this to allow all to see each others data
        if request.user.id == data.user_id:
#            logger.info(DestinationImages.objects.filter(destination=data.pk))
            return Response(serializer.data)
        else:
            return Response({'error': 'You are not authorized to view that information'}, status=status.HTTP_403_FORBIDDEN)

    def put(self, request, pk, format=None):
        #the files will be handled by the serializer
        logger.info("There are files: {}".format(bool(request.FILES)))
        instance = Destination.objects.get(pk=pk)
        # only allow the update to take place if the user owns the data
        if request.user.id == instance.user_id:
            serializer = DestinationSerializer(instance, data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                logger.info(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'You are not authorized to edit that information'}, status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, pk, format=None):
        Destination.objects.get(pk=pk).delete()
        #rturn an updated list of cities to user
        data = DestinationListSerializer(Destination.objects.filter(user=request.user), many=True)
        return Response({"destinations" : data.data})

    def post(self, request, format=None):
        serializer = DestinationListSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.error("Cannot Create Destination: %s" % serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        

class DestinationImagesView(APIView):
    parser_class = (FileUploadParser,)

    def get(self, request, pk, image):
        data = DestinationImagesSerializer(DestinationImages.objects.get(image=image, destination=pk))
        return Response(data.data)

    def delete(self, request, pk, image):
        DestinationImages.objects.get(image=image, destination=pk).delete()
        data = DestinationSerializer(Destination.objects.get(user=pk))
        return Response(data.data)

    # def post(self, request, *args, **kwargs):
    #     file_serializer = FileSerializer(data=request.data, context={'request': request})

    #     if file_serializer.is_valid():
    #         file_serializer.save()
    #         return Response(file_serializer.data, status=status.HTTP_201_CREATED)
    #     else:
    #         return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PlaceView(APIView):
    '''
    The View for individual places
    GET retrieves the information for the specified place
    POST creates a new place
    '''
    def get(self, request, pk, format=None):
        data = Place.objects.get(pk=pk)
        serializer = PlaceSerializer(data)
        #if request.user.id == data.user_id:
#            logger.info(DestinationImages.objects.filter(destination=data.pk))
        return Response(serializer.data)
        #else:
           # return Response({'error': 'You are not authorized to view that information'}, status=status.HTTP_403_FORBIDDEN)

    
    def post(self, request, format=None):
        serializer = PlaceSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.error("Cannot Create Destination: %s" % serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    def put(self, request, pk, format=None):
        #the files will be handled by the serializer
        logger.info("There are files: {}".format(bool(request.FILES)))
        instance = Place.objects.get(pk=pk)
        # only allow the update to take place if the user owns the data
        if request.user.id == instance.user_id:
            serializer = PlaceSerializer(instance, data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                logger.info(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'You are not authorized to edit that information'}, status=status.HTTP_403_FORBIDDEN)

class PlaceImagesView(APIView):
    parser_class = (FileUploadParser,)

    def get(self, request, pk, image):
        # boof = DestinationImages.objects.filter(image=image)
        # logger.info(boof)
        # serializer = DestinationImagesSerializer(boof)
        # if not serializer.is_valid():
        #     logger.info(serializer.errors)
        serializer = DestinationImagesSerializer(DestinationImages.objects.get(image=image, destination=pk))
        return Response(serializer.data)

    def delete(self, request, pk, image):
        PlaceImages.objects.get(image=image, destination=pk).delete()
        serializer = PlaceSerializer(Destination.objects.get(user=pk))
        return Response(serializer.data)

