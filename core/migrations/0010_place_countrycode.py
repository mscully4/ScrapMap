# Generated by Django 3.0.1 on 2020-03-19 04:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0009_auto_20200304_0412'),
    ]

    operations = [
        migrations.AddField(
            model_name='place',
            name='countryCode',
            field=models.CharField(blank=True, max_length=2, null=True),
        ),
    ]