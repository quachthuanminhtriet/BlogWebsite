from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import User, Blog, Comment


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
    user = UserSerializer(read_only=True)
    blog = BlogSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'
