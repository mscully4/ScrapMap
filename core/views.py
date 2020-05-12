from django.contrib.auth.models import User
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView 
from rest_framework.parsers import FileUploadParser

from .serializers import UserSerializerLogin, UserSerializerSignUp, DestinationSerializer, PlaceSerializer, PlaceImagesSerializer
from .models import Destination, DestinationImages, Place, PlaceImages
from django.core import serializers
from django.db.models import Q

import logging
logger = logging.getLogger('django')

class CurrentUser(APIView):
    '''
    Determine the current user by their token and return his/her data
    '''
    #GET requests only
    def get(self, request, format=None):
        #combine the user data with the destinations data
        data = {
            "user": UserSerializerLogin(request.user).data,
            "destinations": DestinationSerializer(Destination.objects.filter(user=request.user), many=True).data,
        }

        return Response(data)

class CreateUser(APIView):
    '''
    Create a new user
    '''
    permission_classes = (permissions.AllowAny,)

    #POST requests only
    def post(self, request, format=None):
        user = {
            'username': request.data['username'], 
            'password': request.data['password']
            }
        serializer = UserSerializerSignUp(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            logger.error("Cannot Create New User: %s" % serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SearchUsers(APIView):
    '''
    Search for users based on their username or first/last name
    '''
    permission_classes = (permissions.AllowAny,)

    def get(self, request, term, format=None):
        #allow users to search based on username, first name and last name
        results = User.objects.filter(Q(username__istartswith=term) | Q(first_name__istartswith=term) | Q(last_name__istartswith=term))
        serializer = UserSerializerLogin(results[:10], many=True)
        return Response(serializer.data)

#this returns the list of all destinations for a specified user and allows users to create new locations
class DestinationListView(APIView):
    '''
    Access a list of all destinations for a given user
    '''
    permission_classes = (permissions.AllowAny,)
    #permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get(self, request, username=None, format=None):
        #logger.info(request.user)
        if User.objects.filter(username=username).exists():
            serializer = DestinationSerializer(Destination.objects.filter(user=User.objects.get(username=username).pk if username != None else request.user), many=True)
            return Response(serializer.data)
        else: 
            return Response(status=status.HTTP_404_NOT_FOUND)

#this is for individual destinations, for retreiving the data/editing or deleting existing ones
class DestinationView(APIView):
    '''
    Access/Manipulate Individual Destination Data
    '''
    permission_classes = (permissions.IsAuthenticated,)
    parser_class = (FileUploadParser,)


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
        #Get the instance being deleted
        instance = Destination.objects.get(pk=pk)
        #serialize it so the PK will be returned to the React app
        serializer = DestinationSerializer(instance=instance, data=instance.__dict__, context={'request', request})
        if serializer.is_valid():
            resp = Response(serializer.data)
            #Delete the instance
            instance.delete()
            return resp
        else:
            logger.info(serializer.errors)
            return Response(serializer.errors)
            
    def post(self, request, format=None):
        serializer = DestinationSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.error("Cannot Create Destination: %s" % serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PlaceView(APIView):
    '''
    The View for individual places
    GET retrieves the information for the specified place
    POST creates a new place
    '''
    
    def post(self, request, format=None):
        print(request.data)
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
                return Response(DestinationSerializer(Destination.objects.filter(user=request.user), many=True).data)
            else:
                logger.info(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'You are not authorized to edit that information'}, status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, pk, format=None):
        instance = Place.objects.get(pk=pk)
        print(instance.destination_id, Destination.objects.get(pk=instance.destination_id))
        serializer = PlaceSerializer(instance=instance, data={**instance.__dict__, 'destination': instance.destination.id})
        if serializer.is_valid():
            resp = Response(serializer.data)
            instance.delete()
            return resp
        else:
            logger.error(serializer.errors)
            return Response(serializer.errors)

class PlaceImagesView(APIView):
    def delete(self, request, pk):
        instance = PlaceImages.objects.get(pk=pk)
        serializer = PlaceImagesSerializer(instance)
        resp = Response(serializer.data)
        instance.delete()
        #return the PK of the image so that it can be deleted from state in the frontend app
        return resp

        

