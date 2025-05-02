import pandas as pd
import os

# --- 1. Definir ruta del archivo ---
base_path = os.path.dirname(__file__)
csv_path = os.path.normpath(os.path.join(base_path, '..', 'ml', 'data.csv'))

# --- 2. Leer el CSV con separadores y formatos numéricos correctos ---
df = pd.read_csv(
    csv_path,
    sep=';',
    decimal=','       # Interpreta 1,23 como 1.23
)

# --- 3. Definir columnas que deben conservarse (en orden específico) ---
columns_to_keep = [
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
    'Curricular units 2nd sem (grade)'
]

# --- 4. Verificar si faltan columnas ---
missing = [col for col in columns_to_keep if col not in df.columns]
if missing:
    print(f"⚠️ Las siguientes columnas no se encontraron en el archivo y serán omitidas: {missing}")

# --- 5. Filtrar DataFrame con las columnas encontradas ---
columns_in_file = [col for col in columns_to_keep if col in df.columns]
filtered_df = df[columns_in_file]

# --- 6. Guardar el nuevo archivo CSV filtrado ---
output_path = os.path.join(base_path, 'xd.csv')
filtered_df.to_csv(output_path, index=False, sep=';', decimal=',')

print(f"✅ CSV filtrado guardado en: {output_path}")
