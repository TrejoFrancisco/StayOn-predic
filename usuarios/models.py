from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UsuariosManager(BaseUserManager):
    def create_user(self, correo, nombre, telefono, password=None):
        if not correo:
            raise ValueError("El usuario debe tener un correo electrónico válido")
        
        usuario = self.model(
            correo=self.normalize_email(correo),
            nombre=nombre,
            telefono=telefono
        )
        usuario.set_password(password)  
        usuario.save(using=self._db)
        return usuario

    def create_superuser(self, correo, nombre, telefono, password):
        usuario = self.create_user(correo, nombre, telefono, password)
        usuario.is_staff = True
        usuario.is_superuser = True
        usuario.save(using=self._db)
        return usuario

class Usuarios(AbstractBaseUser, PermissionsMixin):  
    nombre = models.CharField(max_length=45)
    telefono = models.CharField(max_length=10)
    correo = models.EmailField(max_length=45, unique=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuariosManager()

    USERNAME_FIELD = "correo"
    REQUIRED_FIELDS = ["nombre", "telefono"]  

    def __str__(self):
        return self.correo
