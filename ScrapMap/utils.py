from core.serializers import UserSerializerLogin, DestinationListSerializer
from django.core import serializers
from core.models import Destination
import json

def my_jwt_response_handler(token, user=None, request=None):
    destinations = serializers.serialize("json", Destination.objects.filter(user=user)) 
    return {
        'token': token,
        'user': UserSerializerLogin(user, context={'request': request}).data,
        'destinations': DestinationListSerializer(Destination.objects.filter(user=user), many=True).data
    }