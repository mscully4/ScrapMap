from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.urls import reverse
from django.conf import settings

from django_rest_passwordreset.signals import reset_password_token_created
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    """
    Handles password reset tokens
    When a token is created, an e-mail needs to be sent to the user
    :param sender: View Class that sent the signal
    :param instance: View Instance that sent the signal
    :param reset_password_token: Token Model Object
    :param args:
    :param kwargs:
    :return:
    """

    IP_ADDRESS = 'http://35.237.65.50/'

    EMAIL_ADDRESS = settings.EMAIL_ADDRESS
    EMAIL_PASSWORD = settings.EMAIL_PASSWORD

    message = MIMEMultipart("alternative")
    message["Subject"] = "Scrapmap Password Reset"
    message["From"] = EMAIL_ADDRESS
    message["To"] = reset_password_token.user.email

    text = """\
Hi {},
Reset your password here:
{}password_reset?token={}
""".format(reset_password_token.user.username, IP_ADDRESS, reset_password_token.key)

    plain = MIMEText(text, "plain")
    message.attach(plain)


    port = 465  # For SSL

    # Create a secure SSL context
    context = ssl.create_default_context()

    with smtplib.SMTP_SSL("smtp.gmail.com", port, context=context) as server:
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        server.sendmail(EMAIL_ADDRESS, reset_password_token.user.email, message.as_string())
