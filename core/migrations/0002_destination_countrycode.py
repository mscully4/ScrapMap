# Generated by Django 3.0.1 on 2020-01-03 05:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='destination',
            name='countryCode',
            field=models.CharField(default='us', max_length=2),
            preserve_default=False,
        ),
    ]
