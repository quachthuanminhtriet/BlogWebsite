# Generated by Django 5.0.1 on 2024-11-08 01:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0003_blog_highlighted_alter_blog_content'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blog',
            name='like',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='blog',
            name='views',
            field=models.IntegerField(default=0),
        ),
    ]
