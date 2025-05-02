import pandas as pd
import os

# Ruta del archivo CSV
DATASET_PATH = os.path.join(os.path.dirname(__file__), "data.csv")

# Cargar datos
df = pd.read_csv(DATASET_PATH, sep=";")

# Mostrar todas las columnas disponibles
print("Columnas disponibles en el dataset:")
for i, col in enumerate(df.columns):
    print(f"{i+1}. '{col}'")

print("\nPrimeras filas del dataset:")
print(df.head(3))