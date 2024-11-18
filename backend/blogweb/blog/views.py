from django.contrib.auth.hashers import make_password
from django.db.models import Exists, OuterRef, Value, BooleanField
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, generics, permissions
from . import serializers, models
from .models import User, Blog, Comment, Like
from .page import BlogPagination


# User ViewSet
class UserViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.UpdateAPIView, generics.ListAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer

    def get_permissions(self):
        if self.action in ['get_current_user', 'change_password']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @action(methods=['get', 'patch'], url_path='current-user', detail=False)
    def get_current_user(self, request):
        user = request.user

        print("User ID:", self.request.user.id)
        if request.method == 'PATCH':
            for k, v in request.data.items():
                setattr(user, k, v)
            user.save()
        return Response(serializers.UserSerializer(user).data)

    @action(methods=['patch'], url_path='change-password', detail=True)
    def change_password(self, request, pk=None):
        if str(request.user.id) != pk:
            return Response({"error": "Bạn không có quyền thay đổi mật khẩu của người khác."},
                            status=status.HTTP_403_FORBIDDEN)

        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        if not user.check_password(current_password):
            return Response({"error": "Mật khẩu hiện tại không chính xác."}, status=status.HTTP_400_BAD_REQUEST)

        user.password = make_password(new_password)
        user.save()

        return Response({"message": "Mật khẩu đã được thay đổi thành công."}, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save(password=make_password(serializer.validated_data['password']))
            return Response(serializers.UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Blog ViewSet
class BlogViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView, generics.DestroyAPIView):
    queryset = Blog.objects.filter(active=True)
    serializer_class = serializers.BlogSerializer
    pagination_class = BlogPagination
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = self.queryset
        action = self.request.query_params.get('action')

        if action == 'recent':
            queryset = queryset.order_by('-create_date')
        elif action == 'latest':
            queryset = queryset.order_by('-create_date')[:1]

        return queryset

    @action(detail=False, methods=['get'], url_path='(?P<slug>[-\w]+)/increment-views')
    def increment_views(self, request, slug=None):
        try:
            blog = Blog.objects.get(slug=slug)
            blog.views += 1
            blog.save()
            serializer = serializers.BlogSerializer(blog)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Blog.DoesNotExist:
            return Response({'error': 'Blog not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'], url_path="toggle-like")
    def toggle_like(self, request, pk=None):
        blog = self.get_object()  # Lấy bài viết từ ID
        user = request.user  # Người dùng hiện tại

        if not user.is_authenticated:
            return Response({'error': 'Authentication required to like a post'}, status=status.HTTP_401_UNAUTHORIZED)

        # Kiểm tra nếu đã tồn tại like từ người dùng này cho bài viết
        like = Like.objects.filter(user=user, blog=blog).first()

        if like:
            like.delete()
            blog.likes -= 1
            blog.liked = False
            blog.save()
            return Response({'message': 'Unliked', 'likes_count': blog.likes, 'liked': False},
                            status=status.HTTP_200_OK)
        else:
            Like.objects.create(user=user, blog=blog)
            blog.likes += 1
            blog.liked = True
            blog.save()
            return Response({'message': 'Liked', 'likes_count': blog.likes, 'liked': True, }, status=status.HTTP_200_OK)


# Comment ViewSet
class CommentViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView, generics.DestroyAPIView):
    queryset = Comment.objects.filter(active=True)
    serializer_class = serializers.CommentSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = self.queryset
        if self.action == 'list':
            blog_slug = self.request.query_params.get('blog_slug')
            if blog_slug:
                queryset = queryset.filter(blog__slug=blog_slug)
        return queryset


