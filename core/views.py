# from django.contrib.auth.models import User
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView 
from rest_framework.parsers import FileUploadParser

from .serializers import UserSerializerLogin, UserSerializerSignUp, DestinationSerializer, PlaceSerializer, PlaceImagesSerializer
from .models import Destination, Place, PlaceImages, User
from django.core import serializers
from django.db.models import Q

import logging
logger = logging.getLogger('django')

class CurrentUser(APIView):
    #GET requests only
    def get(self, request, format=None):
        '''
        Return the user's token information combined with destination data
        '''
        data = {
            "user": UserSerializerLogin(request.user).data,
            "destinations": DestinationSerializer(Destination.objects.filter(user=request.user), many=True).data,
        }
        return Response(data)

class CreateUser(APIView):
    #allow unauthenticated users to hit this endpoint
    permission_classes = (permissions.AllowAny,)

    #POST requests only
    def post(self, request, format=None):
        '''
        Create a new user
        '''
        serializer = UserSerializerSignUp(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.error("Cannot Create New User: %s" % serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SearchUsers(APIView):
    #allow unauthenticated users to hit this endpoint
    permission_classes = (permissions.AllowAny,)

    #GET requests only
    def get(self, request, term, format=None):
        '''
        Search for users based on their username or first/last name
        '''
        #allow users to search based on username, first name and last name
        results = User.objects.filter(Q(username__istartswith=term) | Q(first_name__istartswith=term) | Q(last_name__istartswith=term))
        serializer = UserSerializerLogin(results[:10], many=True)
        return Response(serializer.data)
        
#this returns the list of all destinations for a specified user and allows users to create new locations
class DestinationListView(APIView):
    #allow unauthenticated users to hit this endpoint, this way people can view other peoples accounts without needing to sign up
    permission_classes = (permissions.AllowAny,)

    def get(self, request, username=None, format=None):
        '''
        Access a list of all destinations for a given user
        '''
        if User.objects.filter(username=username).exists():
            serializer = DestinationSerializer(Destination.objects.filter(user=User.objects.get(username=username).pk if username != None else request.user), many=True)
            return Response(serializer.data)
        else: 
            logger.info('404: User not found')
            return Response({"username": username}, status=status.HTTP_404_NOT_FOUND)

class DestinationView(APIView):
    #Only authenticated users can make changes to saved data
    permission_classes = (permissions.IsAuthenticated,)
    parser_class = (FileUploadParser,)

    def put(self, request, pk, format=None):
        '''
        Edit an existing destination
        '''
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
        '''
        Delete an existing destination
        '''
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
        '''
        Create a new destination
        '''
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
        '''
        Create a new Place
        '''
        serializer = PlaceSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.error("Cannot Create Place: %s" % serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    def put(self, request, pk, format=None):
        '''
        Edit an existing place
        '''
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
        logger.info('403: You are not authorized to edit that information')
        return Response('You are not authorized to edit that information', status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, pk, format=None):
        '''
        Delete an existing place
        '''
        instance = Place.objects.get(pk=pk)
        # serialize the place being delete so it can be returned to the react app
        serializer = PlaceSerializer(instance=instance, data={**instance.__dict__, 'destination': instance.destination.id})
        if serializer.is_valid():
            #return the serialized data and delete the place
            resp = Response(serializer.data)
            instance.delete()
            return resp
        else:
            logger.error(serializer.errors)
            return Response(serializer.errors)

class PlaceImagesView(APIView):
    def delete(self, request, pk):
        '''
        Delete an existing image
        '''
        instance = PlaceImages.objects.get(pk=pk)
        data = {
            'id': instance.id, 
            'place': instance.place_id, 
            'image': instance.image, 
            'width': instance.width, 
            'height': instance.height
        }
        # serialize the place being deleted so it can be returned to the react app
        serializer = PlaceImagesSerializer(instance, data=data)
        if serializer.is_valid():
            #return the serialized data and delete the image
            resp = Response(serializer.data)
            instance.delete()
            return resp
        else:
            logger.error(serializer.errors)
            return Response(serializer.errors)

        

