from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.hashers import check_password
from .models import Usuarios
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth.hashers import check_password
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password

from .models import Usuarios
import json


import os
import tempfile
import pandas as pd
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt

# Importa la función desde tu módulo
from ml.predictor import predecir_desde_dataframe
def registro_usuario(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            nombre = data.get('Nombre')
            telefono = data.get('Telefono')
            correo = data.get('gmail')  # El JS envía "gmail" como clave
            password = data.get('password')

            if not nombre or not telefono or not correo or not password:
                return JsonResponse({'error': 'Todos los campos son obligatorios.'}, status=400)

            if Usuarios.objects.filter(correo=correo).exists():
                return JsonResponse({'error': 'El correo ya está registrado.'}, status=400)

            nuevo_usuario = Usuarios(
                nombre=nombre,
                telefono=telefono,
                correo=correo,
                password=make_password(password) 
            )
            nuevo_usuario.save()

            return JsonResponse({'message': 'Usuario registrado exitosamente.'}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Datos JSON inválidos.'}, status=400)

    return JsonResponse({'error': 'Método no permitido.'}, status=405)
@csrf_exempt
def login_view(request):
    if request.method == "POST":
        is_json = request.content_type == "application/json"
        
        try:
            data = json.loads(request.body) if is_json else request.POST
            correo = data.get("username")
            password = data.get("password")
        except:
            correo = password = None

        if not correo or not password:
            mensaje = {"error": "Por favor, completa todos los campos."}
            return JsonResponse(mensaje, status=400) if is_json else render(request, "usuarios/login.html", {"error": mensaje["error"]})

        try:
            usuario = Usuarios.objects.get(correo=correo)
            if check_password(password, usuario.password):
                login(request, usuario)
                if is_json:
                    refresh = RefreshToken.for_user(usuario)
                    return JsonResponse({
                        "message": "Inicio de sesión exitoso",
                        "access_token": str(refresh.access_token),
                        "refresh_token": str(refresh)
                    })
                return redirect("dashboard")
            else:
                mensaje = {"error": "Contraseña incorrecta."}
        except Usuarios.DoesNotExist:
            mensaje = {"error": "El usuario no existe."}

        return JsonResponse(mensaje, status=400) if is_json else render(request, "usuarios/login.html", {"error": mensaje["error"]})

    if request.method == "GET":
        return render(request, "usuarios/login.html")

    return JsonResponse({"error": "Método no permitido"}, status=405)

def dashboard_view(request):
    return render(request, 'dashboard.html') 
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_api(request):
    print(f"Usuario autenticado: {request.user}")
    
    usuario_id = request.user.id

    try:
        usuario = Usuarios.objects.get(id=usuario_id)
        return Response({
            "message": f"Bienvenido {usuario.nombre}",
            "nombre": usuario.nombre,
            "telefono": usuario.telefono,
            "correo": usuario.correo,
        })
    except Usuarios.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=404)
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    return Response({"message": "Sesión cerrada correctamente."}, status=200)

def inicio(request):
    return render(request,'index.html')


@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def cargar_csv_y_predecir(request):
    archivo = request.FILES.get('archivo_csv')

    if not archivo:
        return JsonResponse({"error": "No se proporcionó ningún archivo."}, status=400)

    try:
        df = pd.read_csv(archivo)
        output_path, df_resultado = predecir_desde_dataframe(df)

        return JsonResponse({
            "mensaje": "Predicción realizada con éxito",
            "archivo_resultado": os.path.basename(output_path),
            "resumen": df_resultado["Prediccion"].value_counts().to_dict()
        })

    except Exception as e:
        return JsonResponse({"error": f"Error al procesar el archivo: {str(e)}"}, status=500)
    
#---------------------------------------------
def datos_predicciones(request):
    try:
        base_path = os.path.dirname(__file__)
        csv_path = os.path.join(base_path, '../ml/predicciones_resultado.csv')

        df = pd.read_csv(csv_path, sep=';')

        if 'Prediccion' not in df.columns:
            return JsonResponse({'error': 'La columna "Target" no existe en el archivo.'}, status=400)

        conteo = df['Prediccion'].value_counts().to_dict()
        return JsonResponse(conteo)

    except FileNotFoundError:
        return JsonResponse({'error': 'Archivo CSV no encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
def dataOriginal(request):
    try:
        base_path = os.path.dirname(__file__)
        csv_path = os.path.join(base_path, '../ml/data.csv')

        df = pd.read_csv(csv_path, sep=';')

        if 'Target' not in df.columns:
            return JsonResponse({'error': 'La columna "Target" no existe en el archivo.'}, status=400)

        conteo = df['Target'].value_counts().to_dict()
        return JsonResponse(conteo)

    except FileNotFoundError:
        return JsonResponse({'error': 'Archivo CSV no encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
#---------------------------------------------
def totaldataOriginal(request):
    try:
        base_path = os.path.dirname(__file__)
        csv_path = os.path.join(base_path, '../ml/data.csv')

        df = pd.read_csv(csv_path, sep=';')

        total = len(df)  # total de filas (registros)
        return JsonResponse({'total': total})

    except FileNotFoundError:
        return JsonResponse({'error': 'Archivo CSV no encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

def totaldataCarga(request):
    try:
        base_path = os.path.dirname(__file__)
        csv_path = os.path.join(base_path, '../ml/predicciones_resultado.csv')

        df = pd.read_csv(csv_path, sep=';')

        total = len(df)  # total de filas (registros)
        return JsonResponse({'total': total})

    except FileNotFoundError:
        return JsonResponse({'error': 'Archivo CSV no encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)    

#---------------------------------------------

def scholarship_holder(request): 
    try:
        base_path = os.path.dirname(__file__)
        csv_path = os.path.join(base_path, '../ml/data.csv')

        df = pd.read_csv(csv_path, sep=';')

        if 'Scholarship holder' not in df.columns:
            return JsonResponse({'error': 'La columna "Scholarship holder" no existe en el archivo.'}, status=400)

        conteo = df['Scholarship holder'].value_counts().to_dict()
        return JsonResponse(conteo, safe=False)

    except FileNotFoundError:
        return JsonResponse({'error': 'Archivo CSV no encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
def scholarship_holderCarga(request): 
    try:
        base_path = os.path.dirname(__file__)
        csv_path = os.path.join(base_path, '../ml/predicciones_resultado.csv')

        df = pd.read_csv(csv_path, sep=';')

        if 'Scholarship holder' not in df.columns:
            return JsonResponse({'error': 'La columna "Scholarship holder" no existe en el archivo.'}, status=400)

        conteo = df['Scholarship holder'].value_counts().to_dict()
        return JsonResponse(conteo, safe=False)

    except FileNotFoundError:
        return JsonResponse({'error': 'Archivo CSV no encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
#-------------------------------------------------------------
def Gender(request):
    try:
        base_path = os.path.dirname(__file__)
        csv_path = os.path.join(base_path, '../ml/data.csv')

        df = pd.read_csv(csv_path, sep=';')

        if 'Gender' not in df.columns:
            return JsonResponse({'error':'La columna "Gender" no existe en el archivo.'},status=400)
        
        conteo = df['Gender'].value_counts().to_dict()
        return JsonResponse(conteo, safe=False)
    except FileNotFoundError:
        return JsonResponse({'error': 'Archivo CSV no encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

def GenderCarga(request):
    try:
        base_path = os.path.dirname(__file__)
        csv_path = os.path.join(base_path, '../ml/predicciones_resultado.csv')

        df = pd.read_csv(csv_path, sep=';')

        if 'Gender' not in df.columns:
            return JsonResponse({'error':'La columna "Gender" no existe en el archivo.'},status=400)
        
        conteo = df['Gender'].value_counts().to_dict()
        return JsonResponse(conteo, safe=False)
    except FileNotFoundError:
        return JsonResponse({'error': 'Archivo CSV no encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
#-------------------------------------------------------------

def Age_at_enrollment(request):
    try:
        base_path = os.path.dirname(__file__)
        csv_path = os.path.join(base_path, '../ml/data.csv')

        df = pd.read_csv(csv_path, sep=';')

        if 'Age at enrollment' not in df.columns:
            return JsonResponse({'error': 'La columna "Age at enrollment" no existe en el archivo.'}, status=400)

        conteo = df['Age at enrollment'].value_counts().to_dict()
        return JsonResponse(conteo)

    except FileNotFoundError:
        return JsonResponse({'error': 'Archivo CSV no encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

def Age_at_enrollmentCarga(request):
    try:
        base_path = os.path.dirname(__file__)
        csv_path = os.path.join(base_path, '../ml/predicciones_resultado.csv')

        df = pd.read_csv(csv_path, sep=';')

        if 'Age at enrollment' not in df.columns:
            return JsonResponse({'error': 'La columna "Age at enrollment" no existe en el archivo.'}, status=400)

        conteo = df['Age at enrollment'].value_counts().to_dict()
        return JsonResponse(conteo)

    except FileNotFoundError:
        return JsonResponse({'error': 'Archivo CSV no encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

#-------------------------------------------------------------
def beca_vs_prediccion(request):
    try:
        base_path = os.path.dirname(__file__)
        csv_path = os.path.join(base_path, '../ml/data.csv')

        df = pd.read_csv(csv_path, sep=';')

        if 'Scholarship holder' not in df.columns or 'Target' not in df.columns:
            return JsonResponse({'error': 'Faltan columnas requeridas en el archivo.'}, status=400)

        df['Scholarship holder'] = df['Scholarship holder'].map({1: 'Con beca', 0: 'Sin beca'})

        conteo = df.groupby(['Scholarship holder', 'Target']).size().unstack(fill_value=0)

        data = {
            'labels': list(conteo.columns),
            'beca': conteo.loc['Con beca'].tolist() if 'Con beca' in conteo.index else [0]*len(conteo.columns),
            'sin_beca': conteo.loc['Sin beca'].tolist() if 'Sin beca' in conteo.index else [0]*len(conteo.columns),
        }

        return JsonResponse(data)

    except FileNotFoundError:
        return JsonResponse({'error': 'Archivo CSV no encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def beca_vs_prediccionCarga(request):
      try:
        base_path = os.path.dirname(__file__)
        csv_path = os.path.join(base_path, '../ml/predicciones_resultado.csv')

        df = pd.read_csv(csv_path, sep=';')

        if 'Scholarship holder' not in df.columns or 'Prediccion' not in df.columns:
            return JsonResponse({'error': 'Faltan columnas requeridas en el archivo.'}, status=400)

        df['Scholarship holder'] = df['Scholarship holder'].map({1: 'Con beca', 0: 'Sin beca'})

        conteo = df.groupby(['Scholarship holder', 'Prediccion']).size().unstack(fill_value=0)

        data = {
            'labels': list(conteo.columns),
            'beca': conteo.loc['Con beca'].tolist() if 'Con beca' in conteo.index else [0]*len(conteo.columns),
            'sin_beca': conteo.loc['Sin beca'].tolist() if 'Sin beca' in conteo.index else [0]*len(conteo.columns),
        }

        return JsonResponse(data)

      except FileNotFoundError:
        return JsonResponse({'error': 'Archivo CSV no encontrado.'}, status=404)
      except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
#-------------------------------------------------------------

def enrolled_vs_approved_sem1(request):
    try:
        base_path = os.path.dirname(__file__)
        csv_path = os.path.join(base_path, '../ml/data.csv')

        df = pd.read_csv(csv_path, sep=';')

        # Validar que existan las columnas necesarias
        if 'Curricular units 1st sem (enrolled)' not in df.columns or 'Curricular units 1st sem (approved)' not in df.columns:
            return JsonResponse({'error': 'Faltan columnas requeridas en el archivo.'}, status=400)

        # Calcular totales
        total_enrolled = df['Curricular units 1st sem (enrolled)'].sum()
        total_approved = df['Curricular units 1st sem (approved)'].sum()

        data = {
            "Materias inscritas": int(total_enrolled),
            "Materias aprobadas": int(total_approved),
        }

        return JsonResponse(data)

    except FileNotFoundError:
        return JsonResponse({'error': 'Archivo CSV no encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

def enrolled_vs_approved_sem1Carga(request):
    try:
        base_path = os.path.dirname(__file__)
        csv_path = os.path.join(base_path, '../ml/predicciones_resultado.csv')

        df = pd.read_csv(csv_path, sep=';')

        # Validar que existan las columnas necesarias
        if 'Curricular units 1st sem (enrolled)' not in df.columns or 'Curricular units 1st sem (approved)' not in df.columns:
            return JsonResponse({'error': 'Faltan columnas requeridas en el archivo.'}, status=400)

        # Calcular totales
        total_enrolled = df['Curricular units 1st sem (enrolled)'].sum()
        total_approved = df['Curricular units 1st sem (approved)'].sum()

        data = {
            "Materias inscritas": int(total_enrolled),
            "Materias aprobadas": int(total_approved),
        }

        return JsonResponse(data)

    except FileNotFoundError:
        return JsonResponse({'error': 'Archivo CSV no encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
#-------------------------------------------------------------

def enrolled_vs_approved_sem2(request):
    try:
        base_path = os.path.dirname(__file__)
        csv_path = os.path.join(base_path, '../ml/data.csv')

        df = pd.read_csv(csv_path, sep=';')

        # Validar que existan las columnas necesarias
        if 'Curricular units 2nd sem (enrolled)' not in df.columns or 'Curricular units 2nd sem (approved)' not in df.columns:
            return JsonResponse({'error': 'Faltan columnas requeridas en el archivo.'}, status=400)

        # Calcular totales
        total_enrolled = df['Curricular units 2nd sem (enrolled)'].sum()
        total_approved = df['Curricular units 2nd sem (approved)'].sum()

        data = {
            "Materias inscritas": int(total_enrolled),
            "Materias aprobadas": int(total_approved),
        }

        return JsonResponse(data)

    except FileNotFoundError:
        return JsonResponse({'error': 'Archivo CSV no encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

def enrolled_vs_approved_sem2Carga(request):
    try:
        base_path = os.path.dirname(__file__)
        csv_path = os.path.join(base_path, '../ml/predicciones_resultado.csv')

        df = pd.read_csv(csv_path, sep=';')

        # Validar que existan las columnas necesarias
        if 'Curricular units 2nd sem (enrolled)' not in df.columns or 'Curricular units 2nd sem (approved)' not in df.columns:
            return JsonResponse({'error': 'Faltan columnas requeridas en el archivo.'}, status=400)

        # Calcular totales
        total_enrolled = df['Curricular units 2nd sem (enrolled)'].sum()
        total_approved = df['Curricular units 2nd sem (approved)'].sum()

        data = {
            "Materias inscritas": int(total_enrolled),
            "Materias aprobadas": int(total_approved),
        }

        return JsonResponse(data)

    except FileNotFoundError:
        return JsonResponse({'error': 'Archivo CSV no encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

#-------------------------------------------------------------

def boxplot_grades_vs_prediction(request):
    try:
        base_path = os.path.dirname(__file__)
        csv_path = os.path.join(base_path, '../ml/data.csv')
        df = pd.read_csv(csv_path, sep=';')
        
        grades_cols = [col for col in df.columns if 'grade' in col and 'sem' in col]
        
        df_avg = df.copy()
        df_avg['promedio_calificacion'] = df[grades_cols].mean(axis=1, skipna=True)
        
        data = []
        for pred in df_avg['Target'].unique():
            subset = df_avg[df_avg['Target'] == pred]
            for _, row in subset.iterrows():
                if not pd.isna(row['promedio_calificacion']):
                    data.append({
                        'prediccion': pred,
                        'calificacion': float(row['promedio_calificacion'])
                    })

        total_estudiantes = len(data)
        
        return JsonResponse({'data': data, 'total_estudiantes': total_estudiantes})

    except FileNotFoundError:
        return JsonResponse({'error': 'Archivo CSV no encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def boxplot_grades_vs_predictionCarga(request):
    try:
        base_path = os.path.dirname(__file__)
        csv_path = os.path.join(base_path, '../ml/predicciones_resultado.csv')
        df = pd.read_csv(csv_path, sep=';')
        
        grades_cols = [col for col in df.columns if 'grade' in col and 'sem' in col]
        
        df_avg = df.copy()
        df_avg['promedio_calificacion'] = df[grades_cols].mean(axis=1, skipna=True)
        
        data = []
        for pred in df_avg['Prediccion'].unique():
            subset = df_avg[df_avg['Prediccion'] == pred]
            for _, row in subset.iterrows():
                if not pd.isna(row['promedio_calificacion']):
                    data.append({
                        'prediccion': pred,
                        'calificacion': float(row['promedio_calificacion'])
                    })

        total_estudiantes = len(data)
        
        return JsonResponse({'data': data, 'total_estudiantes': total_estudiantes})

    except FileNotFoundError:
        return JsonResponse({'error': 'Archivo CSV no encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
