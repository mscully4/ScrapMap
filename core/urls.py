from django.urls import path
from .views import CurrentUser, CreateUser, DestinationListView, DestinationImagesView, DestinationView

urlpatterns = [
    path('current_user/', CurrentUser.as_view()),
    path('users/', CreateUser.as_view()),
    path('destinations/', DestinationListView.as_view()),
    path('destinations/<int:pk>/', DestinationView.as_view()),
    path('images/<int:pk>/<str:image>', DestinationImagesView.as_view())
]