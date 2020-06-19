# from rest_framework import routers
from rest_framework_jwt.views import JSONWebTokenAPIView, JSONWebTokenSerializer
from rest_framework_jwt.settings import api_settings
# from .utils import my_jwt_response_handler
from rest_framework.response import Response
from rest_framework import status
from core.models import User

# jwt_response_payload_handler = my_jwt_response_handler
jwt_response_payload_handler = api_settings.JWT_RESPONSE_PAYLOAD_HANDLER

#For overriding the login process, so we can generate custom error messages
class ObtainJSONWebToken(JSONWebTokenAPIView):
    """
    API View that receives a POST with a user's username and password.
    Returns a JSON Web Token that can be used for authenticated requests.
    """
    serializer_class = JSONWebTokenSerializer

    def post(self, request, *args, **kwargs):
        if User.objects.filter(username=request.data.get('username')).exists():

            serializer = self.get_serializer(data=request.data)

            if serializer.is_valid():
                user = serializer.object.get('user') or request.user
                token = serializer.object.get('token')
                response_data = jwt_response_payload_handler(token, user, request)
                response = Response(response_data)
                if api_settings.JWT_AUTH_COOKIE:
                    expiration = (datetime.utcnow() +
                                api_settings.JWT_EXPIRATION_DELTA)
                    response.set_cookie(api_settings.JWT_AUTH_COOKIE,
                                        token,
                                        expires=expiration,
                                        httponly=True)
                return response

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response("User Not Found", status=status.HTTP_404_NOT_FOUND)