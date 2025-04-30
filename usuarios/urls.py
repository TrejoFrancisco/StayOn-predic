from django.urls import path
from .views import registro_usuario
from .views import login_view
from .views import dashboard_api
from .views import dashboard_view
from .views import logout_view
from .views import inicio
from .views import cargar_csv_y_predecir
from .views import dataOriginal
from .views import scholarship_holder
from .views import scholarship_holderCarga
from .views import totaldataOriginal
from .views import totaldataCarga
from .views import Gender
from .views import GenderCarga
from .views import Age_at_enrollment
from .views import Age_at_enrollmentCarga
from .views import beca_vs_prediccion
from .views import beca_vs_prediccionCarga
from .views import enrolled_vs_approved_sem1
from .views import enrolled_vs_approved_sem1Carga
from .views import enrolled_vs_approved_sem2
from .views import enrolled_vs_approved_sem2Carga
from .views import boxplot_grades_vs_prediction
from .views import boxplot_grades_vs_predictionCarga
from . import views
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('', inicio, name="inicio"),
    path('inicio/', inicio, name="inicio"),
    path('registro/', registro_usuario, name='registro_usuario'),
    path('login/', login_view, name='login'),
    path('dashboard/', dashboard_view, name='dashboard_view'), 
    path('api/dashboard/', dashboard_api, name='dashboard_api'),  
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/logout/', logout_view, name='logout'),
    path('api/cargar_csv/', cargar_csv_y_predecir, name='cargar_csv'),
    path('api/dataOriginal/', dataOriginal, name='cargar_dataOriginal'),
    path('api/scholarship_holder/', scholarship_holder, name='cargar_scholarship_holder'),
    path('api/predicciones/', views.datos_predicciones, name='api_predicciones'),
    path('api/totaldataOriginal/', totaldataOriginal, name='totaldataOriginal'),
    path('api/totaldataCarga/', totaldataCarga, name='totaldataCarga'),
    path('api/scholarship_holderCarga/', scholarship_holderCarga, name='scholarship_holderCarga'),
    path('api/Gender/', Gender, name='Gender'),
    path('api/GenderCarga/', GenderCarga, name='GenderCarga'),
    path('api/Age_at_enrollment/', Age_at_enrollment, name='Age_at_enrollment'),
    path('api/Age_at_enrollmentCarga/', Age_at_enrollmentCarga, name='Age_at_enrollmentCarga'),
    path('api/beca_vs_prediccion/', beca_vs_prediccion, name='beca_vs_prediccion'),
    path('api/beca_vs_prediccionCarga/', beca_vs_prediccionCarga, name='beca_vs_prediccionCarga'),
    path('api/enrolled_vs_approved_sem1/', enrolled_vs_approved_sem1, name='enrolled_vs_approved_sem1'),
    path('api/enrolled_vs_approved_sem1Carga/', enrolled_vs_approved_sem1Carga, name='enrolled_vs_approved_sem1Carga'),
    path('api/enrolled_vs_approved_sem2/', enrolled_vs_approved_sem2, name='enrolled_vs_approved_sem2'),
    path('api/enrolled_vs_approved_sem2Carga/', enrolled_vs_approved_sem2Carga, name='enrolled_vs_approved_sem2Carga'),
    path('api/boxplot_grades_vs_prediction/', boxplot_grades_vs_prediction, name='boxplot_grades_vs_prediction'),
    path('api/boxplot_grades_vs_predictionCarga/', boxplot_grades_vs_predictionCarga, name='boxplot_grades_vs_predictionCarga'),

    

]
