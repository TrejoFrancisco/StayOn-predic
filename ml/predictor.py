#predictor.py
import pandas as pd
import joblib
import os
import numpy as np

def predecir_desde_dataframe(df_new):
    base_path = os.path.dirname(__file__)
    clf = joblib.load(os.path.join(base_path, "modelo_random_forest.pkl"))
    label_encoders = joblib.load(os.path.join(base_path, "label_encoders.pkl"))
    target_encoder = joblib.load(os.path.join(base_path, "target_encoder.pkl"))
    used_features = joblib.load(os.path.join(base_path, "used_features.pkl"))

    # Verificar columnas necesarias
    missing_columns = set(used_features) - set(df_new.columns)
    extra_columns = set(df_new.columns) - set(used_features)

    print(f"Columnas esperadas por el modelo: {len(used_features)}")
    print(f"Columnas en el dataset: {len(df_new.columns)}")

    if missing_columns:
        print(f"⚠️ Columnas faltantes: {missing_columns}")
        for col in missing_columns:
            df_new[col] = np.nan

    if extra_columns:
        print(f"ℹ️ Columnas extra (serán ignoradas por el modelo): {extra_columns}")

    # Mantener solo las columnas necesarias y en el mismo orden
    df_prediction = df_new[used_features].copy()

    # Codificar columnas categóricas
    for column, encoder in label_encoders.items():
        if column in df_prediction.columns:
            try:
                df_prediction[column] = encoder.transform(df_prediction[column].astype(str))
            except ValueError as e:
                print(f"⚠️ Error codificando '{column}': {e}")
                df_prediction[column] = df_prediction[column].map(
                    lambda val: encoder.transform([val])[0] if val in encoder.classes_ else -1
                )

    # Reemplazar valores faltantes
    df_prediction.fillna(0, inplace=True)

    # Realizar predicción
    predictions_encoded = clf.predict(df_prediction)
    predictions = target_encoder.inverse_transform(predictions_encoded)
    df_new["Prediccion"] = predictions

    # Guardar resultados en el mismo path
    output_path = os.path.join(base_path, "predicciones_resultado.csv")
    df_new.to_csv(output_path, sep=";", index=False)

    print(f"\n✅ Predicciones guardadas en: {output_path}")
    print("📊 Resumen de predicciones:")
    print(df_new["Prediccion"].value_counts())

    return output_path, df_new
