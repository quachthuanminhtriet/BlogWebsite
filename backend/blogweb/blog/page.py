from rest_framework import pagination


class BlogPagination(pagination.PageNumberPagination):
    page_size = 4

class NotificationPagination(pagination.PageNumberPagination):
    page_size = 10