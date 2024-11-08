from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, generics, permissions

from . import serializers
from .models import User, Blog, Comment
from .perm import IsBlogerUser


# Create your views here.

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

        if request.method == 'PATCH':
            # Cập nhật thông tin người dùng
            for k, v in request.data.items():
                setattr(user, k, v)
            user.save()

        return Response(serializers.UserSerializer(user).data)

    @action(methods=['patch'], url_path='change-password', detail=True)
    def change_password(self, request, pk=None):
        # Kiểm tra xem người dùng có quyền thay đổi mật khẩu của chính họ không
        if str(request.user.id) != pk:
            return Response({"error": "Bạn không có quyền thay đổi mật khẩu của người khác."},
                            status=status.HTTP_403_FORBIDDEN)

        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        # Kiểm tra mật khẩu hiện tại
        if not user.check_password(current_password):
            return Response({"error": "Mật khẩu hiện tại không chính xác."}, status=status.HTTP_400_BAD_REQUEST)

        # Cập nhật mật khẩu mới
        user.password = make_password(new_password)
        user.save()

        return Response({"message": "Mật khẩu đã được thay đổi thành công."}, status=status.HTTP_200_OK)

    # Đăng Ký Tài Khoản Mới
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save(password=make_password(serializer.validated_data['password']))
            return Response(serializers.UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BlogViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView, generics.DestroyAPIView):
    queryset = Blog.objects.filter(active=True)
    serializer_class = serializers.BlogSerializer

    def get_permissions(self):
        return [permissions.AllowAny()]

    def get_queryset(self):
        queryset = self.queryset
        action = self.request.query_params.get('action')

        if action == 'latest':
            queryset = queryset.order_by('-create_date')
        elif action == 'hot':
            queryset = queryset.order_by('-views')
        elif action == 'highlighted':
            queryset = queryset.filter(highlighted=True)

        return queryset

    @action(detail=False, methods=['get'], url_path='(?P<slug>[-\w]+)/increment-views')
    def increment_views(self, request, slug=None):
        try:
            blog = Blog.objects.get(slug=slug)
            blog.views = blog.views + 1
            blog.save()
            serializer = serializers.BlogSerializer(blog)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Blog.DoesNotExist:
            return Response({'error': 'Blog not found'}, status=status.HTTP_404_NOT_FOUND)


class CommentViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView, generics.DestroyAPIView):
    queryset = Comment.objects.filter(active=True)
    serializer_class = serializers.CommentSerializer

    def get_permissions(self):
        if self.action in ['create', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        queryset = self.queryset

        if self.action.__eq__('list'):
            blog_id = self.request.query_params.get('blog_id')
            if blog_id:
                queryset = queryset.filter(blog_id=blog_id)

        return queryset

    def create(self, request, *args, **kwargs):
        parent_id = request.data.get('parent', None)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            comment = serializer.save(user=request.user, parent=parent_id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        comment_id = kwargs.get('pk')
        try:
            comment = self.queryset.get(id=comment_id)
            comment.active = False
            comment.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Comment.DoesNotExist:
            return Response({"detail": "Comment not found."}, status=status.HTTP_404_NOT_FOUND)
