from django.urls import path
from .views import CurrentUser, CreateUser, DestinationListView, DestinationView, PlaceView
from django.conf.urls.static import static

urlpatterns = [
    path('current_user/', CurrentUser.as_view()),
    path('users/', CreateUser.as_view()),

    path('destinations/<str:username>/', DestinationListView.as_view()),

    path('destination/<int:pk>/', DestinationView.as_view()),
    path('destination/', DestinationView.as_view()),

    path('place/', PlaceView.as_view()),
    path('place/<int:pk>/', PlaceView.as_view()),


]

# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)