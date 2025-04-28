# ml-api/asthma_predictor.py (UPDATED with Smart Override)

import sys
import json
import pandas as pd
import joblib
from datetime import datetime

FEATURES = [
    'Age', 'BMI', 'Smoking', 'PhysicalActivity', 'DietQuality',
    'SleepQuality', 'PollutionExposure', 'PollenExposure', 'DustExposure',
    'PetAllergy', 'FamilyHistoryAsthma', 'HistoryOfAllergies', 'Eczema',
    'HayFever', 'GastroesophagealReflux', 'Wheezing', 'ShortnessOfBreath',
    'ChestTightness', 'Coughing', 'NighttimeSymptoms', 'ExerciseInduced',
    'LungFunctionFEV1', 'LungFunctionFVC'
]

def load_model_and_scaler():
    model = joblib.load("best_knn_model.pkl")
    scaler = joblib.load("scaler.pkl")
    return model, scaler

def classify_severity(prob):
    if prob >= 0.85:
        return "Very High"
    elif prob >= 0.6:
        return "High"
    elif prob >= 0.4:
        return "Moderate"
    else:
        return "Low"

def get_recommendations(data, severity):
    recs = []
    if severity in ["High", "Very High"]:
        recs.append("Consult a pulmonologist urgently.")
    if data.get("Smoking", 0) == 1:
        recs.append("Quit smoking to improve lung health.")
    if data.get("PhysicalActivity", 3) < 2:
        recs.append("Increase daily physical activity gradually.")
    if data.get("PollutionExposure", 2) > 2:
        recs.append("Avoid outdoor exposure during poor air quality days.")
    if data.get("DietQuality", 3) < 2:
        recs.append("Improve your diet with anti-inflammatory foods.")
    if data.get("SleepQuality", 3) < 2:
        recs.append("Focus on better sleep hygiene routines.")
    if data.get("Wheezing", 0) == 1 or data.get("ShortnessOfBreath", 0) == 1:
        recs.append("Monitor breathing closely; seek care if worsens.")
    return recs

def calculate_fev1_fvc_ratio(fev1, fvc):
    if fvc == 0:
        return 0
    return round(fev1 / fvc, 2)

def main():
    try:
        input_data = json.load(sys.stdin)

        missing = [feat for feat in FEATURES if feat not in input_data]
        if missing:
            raise ValueError(f"Missing input fields: {missing}")

        # Calculate FEV1/FVC Ratio
        fev1_fvc_ratio = calculate_fev1_fvc_ratio(
            input_data["LungFunctionFEV1"],
            input_data["LungFunctionFVC"]
        )
        input_data["FEV1_FVC_Ratio"] = fev1_fvc_ratio

        # Load model and scaler
        model, scaler = load_model_and_scaler()

        df = pd.DataFrame([input_data])[FEATURES]
        scaled = scaler.transform(df)

        pred = model.predict(scaled)[0]
        prob = round(model.predict_proba(scaled)[0][1], 2)
        severity = classify_severity(prob)

        # Smart Override: if critical symptoms detected
        if (fev1_fvc_ratio < 0.5 and input_data.get("Wheezing", 0) == 1 and input_data.get("ShortnessOfBreath", 0) == 1):
            pred = 1
            prob = 0.92
            severity = "Very High"

        recommendations = get_recommendations(input_data, severity)

        result = {
            "diagnosis": int(pred),
            "probability": prob,
            "severity": severity,
            "fev1_fvc_ratio": fev1_fvc_ratio,
            "recommendations": recommendations,
            "timestamp": datetime.now().isoformat(),
            "model": "K-Nearest Neighbors v1.0 (Smart Overridden)"
        }

        print(json.dumps(result))

    except Exception as e:
        error_response = {
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
        print(json.dumps(error_response))
        sys.exit(1)

if __name__ == "__main__":
    main()
