from cloudinary.models import CloudinaryField
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.text import slugify


class BaseModel(models.Model):
    create_date = models.DateTimeField(auto_now_add=True, null=True)
    update_date = models.DateTimeField(auto_now=True, null=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Quản trị viên'),
        ('blogger', 'Chủ trang blog'),
        ('viewer', 'Người xem')
    ]

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='viewer')
    birthday = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    nationality = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        verbose_name_plural = 'Tài Khoản Người Dùng'

    def __str__(self):
        return self.username

class Blog(BaseModel):
    title = models.CharField(max_length=255)
    content = models.TextField(null=True, blank=True)
    author = models.ForeignKey(User, related_name='blogs', on_delete=models.CASCADE, blank=True)
    cover_image = CloudinaryField(null=True)
    slug = models.SlugField(null=True, blank=True, unique=True)
    highlighted = models.BooleanField(default=False)
    views = models.IntegerField(default=0)
    likes = models.IntegerField(default=0)

    class Meta:
        verbose_name_plural = 'Bài Viết'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Comment(BaseModel):
    DoesNotExist = None
    blog = models.ForeignKey(Blog, related_name='comments', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='comments', on_delete=models.CASCADE)
    content = models.TextField()
    parent = models.ForeignKey('self', null=True, blank=True, related_name='replies', on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = 'Bình Luận'

    def __str__(self):
        return f'Comment by {self.user.username} on {self.blog.title}'


class Like(BaseModel):
    user = models.ForeignKey(User, related_name='like', on_delete=models.CASCADE)
    blog = models.ForeignKey(Blog, related_name='like', on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'blog')  # Đảm bảo mỗi người dùng chỉ like một lần
        verbose_name_plural = 'Lượt Thích'

    def __str__(self):
        return f"{self.user.username} liked {self.blog.title}"


class Notification(BaseModel):
    user = models.ForeignKey(User, related_name='notifications', on_delete=models.CASCADE)
    message = models.CharField(max_length=255)
    urlImage = models.CharField(max_length=255, blank=True, null=True)
    is_read = models.BooleanField(default=False)
    notification_type = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        verbose_name_plural = 'Thông Báo'

    def __str__(self):
        return f"Thông báo cho {self.user.username}: {self.message}"