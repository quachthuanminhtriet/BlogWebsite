from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import User, Blog, Comment, Like


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }


class BlogSerializer(serializers.ModelSerializer):
    likes_count = serializers.IntegerField(source='likes', read_only=True)
    liked = serializers.BooleanField(read_only=True)

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if instance.cover_image:
            rep['cover_image'] = instance.cover_image.url
        else:
            rep['cover_image'] = None
        return rep

    class Meta:
        model = Blog
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    user_first_name = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = '__all__'

    def get_user_first_name(self, obj):
        return obj.user.first_name
