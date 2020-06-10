from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.urls import reverse
from django.conf import settings

from django_rest_passwordreset.signals import reset_password_token_created
import smtplib
import ssl


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
    print("Go Fuck Yourself")
    # TODO - send password reset token via email/text

    # send an e-mail to the user
    context = {
        'current_user': reset_password_token.user,
        'username': reset_password_token.user.username,
        'email': reset_password_token.user.email,
        'reset_password_url': "{}?token={}".format(reverse('password_reset:reset-password-request'), reset_password_token.key)
    }
    IP_ADDRESS = reset_password_token.ip_address

    EMAIL_ADDRESS = settings.EMAIL_ADDRESS
    EMAIL_PASSWORD = settings.EMAIL_PASSWORD

    print(EMAIL_ADDRESS, EMAIL_PASSWORD)

    port = 465  # For SSL
    # password = input("Type your password and press enter: ")

    # Create a secure SSL context
    context = ssl.create_default_context()

    with smtplib.SMTP_SSL("smtp.gmail.com", port, context=context) as server:
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)

    # # render email text
    # email_html_message = render_to_string('email/user_reset_password.html', context)
    email_plaintext_message = "{}:3000{}?token={}".format(IP_ADDRESS, reverse('password_reset:reset-password-request'), reset_password_token.key)

    print(email_plaintext_message)

    # msg = EmailMultiAlternatives(
    #     # title:
    #     "Password Reset for {}".format(reset_password_token.user.username),
    #     # message:
    #     email_plaintext_message,
    #     # from:
    #     "scrapmap.login@gmail.com",
    #     # to:
    #     [reset_password_token.user.email]
    # )
    # # msg.attach_alternative(email_html_message, "text/html")
    # msg.send()
