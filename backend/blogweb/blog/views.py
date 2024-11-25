import time
from pydoc import pager

from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.http import StreamingHttpResponse, HttpResponse
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, generics, permissions
from . import serializers
from .models import User, Blog, Comment, Like, Notification
from .page import BlogPagination, NotificationPagination
from .serializers import UserSerializer


# User ViewSet
class UserViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.UpdateAPIView, generics.ListAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer

    def get_permissions(self):
        if self.action in ['get_current_user', 'update-info',
                           'notifications', 'unread-notifications',
                           'mark-all-notifications-read']:
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

    @action(methods=['patch'], url_path='update-info', detail=True)
    def update_user_info(self, request, pk=None):
        # Check if the logged-in user is trying to edit their own information
        if str(request.user.id) != pk:
            return Response({"error": "Bạn không có quyền thay đổi thông tin của người khác."},
                            status=status.HTTP_403_FORBIDDEN)

        user = request.user
        # Get the data from the request
        email = request.data.get('email')
        birth_day = request.data.get('birthDay')
        nationality = request.data.get('nationality')

        # Prepare the updated data
        updated_data = {}
        if email:
            updated_data['email'] = email
        if birth_day:
            updated_data['birthDay'] = birth_day
        if nationality:
            updated_data['nationality'] = nationality

        # If there is data to update, apply it
        if updated_data:
            serializer = serializers.UserSerializer(user, data=updated_data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Thông tin đã được cập nhật thành công."}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"error": "Không có thông tin để cập nhật."}, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save(password=make_password(serializer.validated_data['password']))
            return Response(serializers.UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='notifications',
            permission_classes=[permissions.IsAuthenticated])
    def get_notifications(self, request):
        user = request.user
        notifications = user.notifications.all().order_by('-create_date')

        paginator = NotificationPagination()
        page = paginator.paginate_queryset(notifications, request)

        if page is not None:
            serializer = serializers.NotificationSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = serializers.NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='unread-notifications',
            permission_classes=[permissions.IsAuthenticated])
    def get_unread_notifications_count(self, request):
        user = request.user
        unread_notifications = Notification.objects.filter(user=user, is_read=False)
        return Response({'unread_count': unread_notifications.count()})

    # Đánh Dấu những thông báo đã đọc
    @action(detail=False, methods=['patch'], url_path='mark-all-notifications-read',
            permission_classes=[permissions.IsAuthenticated])
    def mark_all_notifications_read(self, request):
        user = request.user

        # Cập nhật tất cả thông báo chưa đọc của người dùng thành "đã đọc"
        unread_notifications = Notification.objects.filter(user=user, is_read=False)
        unread_notifications.update(is_read=True)

        return Response({"message": "All notifications marked as read"}, status=status.HTTP_200_OK)


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

            # if user.role != 'blogger':
            Notification.objects.create(
                user=blog.author,  # Chủ bài viết
                message=f"{user.first_name} đã thích bài viết '{blog.title}' của bạn",
                urlImage=blog.cover_image.url,
                notification_type="like"
            )

            return Response({'message': 'Liked', 'likes_count': blog.likes, 'liked': True},
                            status=status.HTTP_201_CREATED)


# Comment ViewSet
class CommentViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView, generics.DestroyAPIView):
    queryset = Comment.objects.filter(active=True)
    serializer_class = serializers.CommentSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        comment = serializer.save(user=request.user)

        # Gửi thông báo cho tác giả bài viết
        # if user.role != 'blogger':
        Notification.objects.create(
            user=comment.blog.author,  # Chủ bài viết
            message=f"{request.user.first_name} đã bình luận bài viết '{comment.blog.title}' của bạn",
            notification_type="comment"
        )

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get_queryset(self):
        queryset = self.queryset
        if self.action == 'list':
            blog_slug = self.request.query_params.get('blog_slug')
            if blog_slug:
                queryset = queryset.filter(blog__slug=blog_slug)
        return queryset


#Chạy realtime
def event_stream(user):
    while True:
        notifications = Notification.objects.filter(user=user, is_read=False)
        if notifications.exists():
            for notification in notifications:
                yield f'data: {notification.message}\n\n'
                notification.is_read = True
                notification.save()
        time.sleep(1)

def sse_notifications_view(request):
    token_key = request.GET.get('token')
    if not token_key:
        return HttpResponse(status=401)

    jwt_authenticator = JWTAuthentication()
    try:
        validated_token = jwt_authenticator.get_validated_token(token_key)
        user = jwt_authenticator.get_user(validated_token)
    except (InvalidToken, TokenError) as e:
        return HttpResponse(status=401)

    response = StreamingHttpResponse(event_stream(user), content_type='text/event-stream')
    response['Cache-Control'] = 'no-cache'
    return response

