from django.contrib import admin
from .models import Blog, User, Comment


class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'is_active')
    search_fields = ('username', 'email')
    list_filter = ('is_active',)
    ordering = ('id',)


class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'content', 'user', 'blog')
    search_fields = ('content',)
    list_filter = ('user', 'blog')
    ordering = ('id', 'user')


class BlogAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'views', 'author', 'create_date')
    search_fields = ('title',)
    list_filter = ('author', 'create_date')
    ordering = ('id', 'title', 'views')


# Register your models here.
class BlogAdminSite(admin.AdminSite):
    site_header = "HỆ THỐNG QUẢN LÝ BLOG"
    site_title = "Quản Trị Hệ Thống"
    index_title = "Chào Mừng Đến Với Quản Trị"


admin_site = BlogAdminSite(name='ShopAppAdmin')

admin_site.register(User, UserAdmin)
admin_site.register(Blog, BlogAdmin)
admin_site.register(Comment, CommentAdmin)
