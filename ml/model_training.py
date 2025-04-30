# ml/model_training.py

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib
import os

# Ruta del archivo CSV
DATASET_PATH = os.path.join(os.path.dirname(__file__), "data.csv")

# Columnas seleccionadas para el modelo (deben existir en data.csv)
FEATURE_COLUMNS = [
    'Gender',
    'Age at enrollment',
    'Scholarship holder',
    'Admission grade',
    'Debtor',
    'Curricular units 1st sem (enrolled)',
    'Curricular units 1st sem (approved)',
    'Curricular units 1st sem (grade)',
    'Curricular units 2nd sem (enrolled)',
    'Curricular units 2nd sem (approved)',
    'Curricular units 2nd sem (grade)',
]

# 1. Cargar datos
df = pd.read_csv(DATASET_PATH, sep=";")

# 2. Filtrar columnas y objetivo
X = df[FEATURE_COLUMNS].copy()
y = df["Target"].copy()

# 3. Codificar variables categóricas
label_encoders = {}
for column in X.select_dtypes(include=["object"]).columns:
    le = LabelEncoder()
    X[column] = le.fit_transform(X[column].astype(str))
    label_encoders[column] = le

# Codificar la variable objetivo
target_encoder = LabelEncoder()
y = target_encoder.fit_transform(y)

# 4. Dividir los datos
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 5. Entrenar modelo
clf = RandomForestClassifier(n_estimators=1000, random_state=42)
clf.fit(X_train, y_train)

# 6. Guardar modelo y recursos
base_path = os.path.dirname(__file__)
joblib.dump(clf, os.path.join(base_path, "modelo_random_forest.pkl"))
joblib.dump(label_encoders, os.path.join(base_path, "label_encoders.pkl"))
joblib.dump(target_encoder, os.path.join(base_path, "target_encoder.pkl"))
joblib.dump(FEATURE_COLUMNS, os.path.join(base_path, "used_features.pkl"))

# 7. Reporte simple
print("Modelo entrenado y guardado exitosamente.")
print(df['Target'].value_counts())
