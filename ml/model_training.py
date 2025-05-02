#Model_training.py
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os
import numpy as np
from imblearn.over_sampling import SMOTE

# Ruta del archivo CSV
DATASET_PATH = os.path.join(os.path.dirname(__file__), "data.csv")

# 1. Cargar datos
df = pd.read_csv(DATASET_PATH, sep=";")
print(f"Total de registros en el dataset: {len(df)}")
print(f"Distribución de clases original:")
print(df['Target'].value_counts())
print("\n")

# 2. Columnas seleccionadas para el modelo (uso equivalentes con normalización de espacios)
DESIRED_COLUMNS = [
    'Gender',
    'Age at enrollment',
    'Application mode',
    'Course',
    'Scholarship holder',
    'Admission grade',
    'Curricular units 1st sem (enrolled)',
    'Curricular units 1st sem (approved)',
    'Curricular units 1st sem (grade)',
    'Curricular units 2nd sem (enrolled)',
    'Curricular units 2nd sem (approved)',
    'Curricular units 2nd sem (grade)',
]

# Crear un diccionario para mapear nombres de columnas normalizados a nombres reales
column_map = {col.strip().lower(): col for col in df.columns}

# Usar nombres normalizados para encontrar las columnas reales en el dataset
FEATURE_COLUMNS = []
for desired_col in DESIRED_COLUMNS:
    normalized = desired_col.strip().lower()
    if normalized in column_map:
        FEATURE_COLUMNS.append(column_map[normalized])
    else:
        print(f"⚠️ Columna no encontrada: '{desired_col}'")

print(f"Se usarán las siguientes {len(FEATURE_COLUMNS)} columnas:")
for i, col in enumerate(FEATURE_COLUMNS):
    print(f"{i+1}. {col}")
print("\n")

# 3. Filtrar columnas y objetivo
X = df[FEATURE_COLUMNS].copy()
y = df["Target"].copy()

# 4. Codificar variables categóricas
label_encoders = {}
for column in X.select_dtypes(include=["object"]).columns:
    le = LabelEncoder()
    X[column] = le.fit_transform(X[column].astype(str))
    label_encoders[column] = le

# Codificar la variable objetivo
target_encoder = LabelEncoder()
y = target_encoder.fit_transform(y)

# Mostrar mapeo de clases objetivo
print("Mapeo de codificación para Target:")
for i, clase in enumerate(target_encoder.classes_):
    print(f"  {clase} -> {i}")
print("\n")

# 5. Dividir los datos
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 5.1 Aplicar SMOTE solo al conjunto de entrenamiento
smote = SMOTE(random_state=42)
X_train, y_train = smote.fit_resample(X_train, y_train)

# Mostrar nueva distribución de clases
unique, counts = np.unique(y_train, return_counts=True)
print("Distribución de clases después de aplicar SMOTE:")
for label, count in zip(unique, counts):
    print(f"  {target_encoder.inverse_transform([label])[0]}: {count}")
print("\n")

# 6. Entrenar modelo
clf = RandomForestClassifier(n_estimators=1000, random_state=42)
clf.fit(X_train, y_train)

# 7. Evaluar el modelo
y_pred = clf.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Precisión del modelo en datos de prueba: {accuracy:.4f}")

# Mostrar reporte detallado
print("\nReporte de clasificación:")
print(classification_report(y_test, y_pred, target_names=target_encoder.classes_))

# 8. Mostrar importancia de características
feature_importances = pd.DataFrame(
    clf.feature_importances_, 
    index=FEATURE_COLUMNS, 
    columns=['importance']
).sort_values('importance', ascending=False)

print("\nImportancia de características:")
print(feature_importances)

# 9. Guardar modelo y recursos
base_path = os.path.dirname(__file__)
joblib.dump(clf, os.path.join(base_path, "modelo_random_forest.pkl"))
joblib.dump(label_encoders, os.path.join(base_path, "label_encoders.pkl"))
joblib.dump(target_encoder, os.path.join(base_path, "target_encoder.pkl"))
joblib.dump(FEATURE_COLUMNS, os.path.join(base_path, "used_features.pkl"))

print("\nModelo entrenado y guardado exitosamente.")