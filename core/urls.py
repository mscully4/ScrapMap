from django.urls import path, include
from .views import CurrentUser, CreateUser, SearchUsers, DestinationListView, DestinationView, PlaceView, PlaceImagesView
from django.conf.urls.static import static

urlpatterns = [
    path('password_reset/', include('django_rest_passwordreset.urls')),

    path('current_user/', CurrentUser.as_view()),
    path('users/', CreateUser.as_view()),

    path('search/<str:term>/', SearchUsers.as_view()),

    path('destinations/<str:username>/', DestinationListView.as_view()),

    path('destination/<int:pk>/', DestinationView.as_view()),
    path('destination/', DestinationView.as_view()),

    path('place/', PlaceView.as_view()),
    path('place/<int:pk>/', PlaceView.as_view()),

    path('image/<int:pk>/', PlaceImagesView.as_view())
]

# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)