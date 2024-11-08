from django.urls import path, include
from rest_framework import routers
from . import views
from rest_framework_simplejwt import views as jwt_views

r = routers.DefaultRouter()

r.register('users', views.UserViewSet, 'users')
r.register('blogs', views.BlogViewSet, 'blogs')
r.register('comments', views.CommentViewSet, 'comments')

urlpatterns = [
    path('', include(r.urls)),
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]
