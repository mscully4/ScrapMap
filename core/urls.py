from django.urls import path
from .views import CurrentUser, CreateUser, DestinationList, DestinationImagesView, DestinationView

urlpatterns = [
    path('current_user/', CurrentUser.as_view()),
    path('users/', CreateUser.as_view()),
    path('destinations/', DestinationList.as_view()),
    path('destinations/<int:pk>/', DestinationView.as_view()),
    path('upload/', DestinationImagesView.as_view())
]