import os
import pandas as pd

base_path = os.path.dirname(__file__)
csv_path  = os.path.normpath(os.path.join(base_path, '..', 'ml', 'xd.csv'))

# Leer especificando que los puntos son miles
df = pd.read_csv(
    csv_path,
    sep=';',
    decimal=','       # si hubiera '1,23' lo interpreta como 1.23
)

# Agregar columna vacía
df['Target'] = ''

# Guardar convertido a CSV separado por comas
output_path = os.path.join(base_path, 'data_modificado.csv')
df.to_csv(output_path, index=False, sep=',', encoding='utf-8')

print(f"Archivo convertido y guardado en: {output_path}")
