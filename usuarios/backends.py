from django.db import models
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password
from .models import Usuarios

class CustomAuthBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        # Buscar usuario por correo o teléfono de forma eficiente
        user = Usuarios.objects.filter(models.Q(correo=username) | models.Q(telefono=username)).first()
        if user and check_password(password, user.password):
            return user  # Retorna el usuario si la contraseña es correcta
        return None

    def get_user(self, user_id):
        try:
            return Usuarios.objects.get(pk=user_id)
        except Usuarios.DoesNotExist:
            return None
