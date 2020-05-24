from core.serializers import UserSerializerLogin, DestinationSerializer
from django.core import serializers
from core.models import Destination
import json

def my_jwt_response_handler(token, user=None, request=None):
    return {
        'token': token,
        'user': UserSerializerLogin(user, context={'request': request}).data,
        'destinations': DestinationSerializer(Destination.objects.filter(user=user), many=True).data
    }