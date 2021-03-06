"""
Django settings for ScrapMap project.

Generated by 'django-admin startproject' using Django 2.2.6.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""

import os
import datetime
import configparser

config = configparser.ConfigParser()
config.read('./ScrapMap/config.ini')

def read_secret(path):
    assert os.path.exists(path)
    with open(path, 'r') as fh:
        return fh.read().strip('\n')


import boto3

bucket='elasticbeanstalk-us-east-2-735029168602'
item = 'secrets.json'

s3 = boto3.resource('s3')
obj = s3.Object(bucket, item)
body = obj.get()
raw = body['Body'].read()

import json

secrets = json.loads(raw)

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config['DJANGO'].get('SECRET_KEY', "", raw=True)
assert SECRET_KEY != ""

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'core',
    'rest_framework',
    'corsheaders',
    'storages',
    'django_rest_passwordreset',
    'django_cleanup.apps.CleanupConfig'
]

MIDDLEWARE = [
    'ScrapMap.middleware.HealthCheckMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ),
}

CORS_ORIGIN_WHITELIST = (
    'http://localhost:3000',
)

JWT_AUTH = {
    'JWT_RESPONSE_PAYLOAD_HANDLER': 'ScrapMap.utils.my_jwt_response_handler',
    'JWT_EXPIRATION_DELTA': datetime.timedelta(days=2),
}

ROOT_URLCONF = 'ScrapMap.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'ScrapMap.wsgi.application'

AUTH_USER_MODEL = 'core.user'


# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/
LOCAL = False

if LOCAL == False:
    # aws settings
    AWS_ACCESS_KEY_ID = secrets['AWS'].get('ACCESS_KEY')
    AWS_SECRET_ACCESS_KEY = secrets['AWS'].get('SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME = secrets['AWS'].get('BUCKET_NAME')
    AWS_DEFAULT_ACL = None
    AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
    AWS_S3_OBJECT_PARAMETERS = {'CacheControl': 'max-age=86400'}
    # s3 static settings
    STATIC_LOCATION = 'static'
    STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/{STATIC_LOCATION}/'
    STATICFILES_STORAGE = 'ScrapMap.storage_backends.StaticStorage'
    # s3 public media settings
    PUBLIC_MEDIA_LOCATION = 'media'
    MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/{PUBLIC_MEDIA_LOCATION}/'
    DEFAULT_FILE_STORAGE = 'ScrapMap.storage_backends.PrivateMediaStorage'
    #Email
    EMAIL_ADDRESS = secrets['GMAIL'].get('EMAIL')
    EMAIL_PASSWORD = secrets['GMAIL'].get('PASSWORD')

    #Database Information
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'USER': secrets['AWS'].get('DATABASE_USER'),
            'PASSWORD': secrets['AWS'].get('DATABASE_USER_PASSWORD'),
            'HOST': secrets['AWS'].get('DATABASE_ENDPOINT'),
            'PORT': '5432',
            'NAME': 'scrapmap'  
        }
    }
else:
    # aws settings
    AWS_ACCESS_KEY_ID = config['AWS'].get('ACCESS_KEY')
    AWS_SECRET_ACCESS_KEY = config['AWS'].get('SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME = config['AWS'].get('BUCKET_NAME')
    AWS_DEFAULT_ACL = None
    AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
    AWS_S3_OBJECT_PARAMETERS = {'CacheControl': 'max-age=86400'}
    # s3 static settings
    STATIC_LOCATION = 'static'
    STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/{STATIC_LOCATION}/'
    STATICFILES_STORAGE = 'ScrapMap.storage_backends.StaticStorage'
    # s3 public media settings
    PUBLIC_MEDIA_LOCATION = 'media'
    MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/{PUBLIC_MEDIA_LOCATION}/'
    DEFAULT_FILE_STORAGE = 'ScrapMap.storage_backends.PrivateMediaStorage'

        # Email Information
    EMAIL_ADDRESS = config['GMAIL'].get('EMAIL')
    EMAIL_PASSWORD = config['GMAIL'].get('PASSWORD')

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        }
    }

# else:
    # MEDIA_URL = '/media/'
    # MEDIA_ROOT = os.getcwd() + "/ScrapMap/media"
