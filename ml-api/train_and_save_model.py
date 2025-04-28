# train_and_save_model.py

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, StratifiedKFold, GridSearchCV, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from imblearn.over_sampling import SMOTE
import joblib

# 1. Load your dataset
data = pd.read_csv('asthma_disease_data.csv')  # Make sure this file is present in ml-api/

# 2. Define the selected features (FINAL features you used after clustering etc.)
selected_features = [
    'Age', 'BMI', 'Smoking', 'PhysicalActivity', 'DietQuality',
    'SleepQuality', 'PollutionExposure', 'PollenExposure', 'DustExposure',
    'PetAllergy', 'FamilyHistoryAsthma', 'HistoryOfAllergies', 'Eczema',
    'HayFever', 'GastroesophagealReflux', 'Wheezing', 'ShortnessOfBreath',
    'ChestTightness', 'Coughing', 'NighttimeSymptoms', 'ExerciseInduced',
    'LungFunctionFEV1', 'LungFunctionFVC'
]

# 3. Prepare data
X = data[selected_features]
y = data['Diagnosis']

# 4. Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, test_size=0.2, random_state=42)

# 5. Handle class imbalance with SMOTE
smote = SMOTE(random_state=42)
X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)

# 6. Scale the features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train_resampled)
X_test_scaled = scaler.transform(X_test)

# 7. Build and tune the KNN model (Hyperparameter Tuning)
param_grid_knn = {
    'n_neighbors': [3, 5, 7, 9, 11],
    'weights': ['uniform', 'distance'],
    'metric': ['euclidean', 'manhattan']
}

grid_search_knn = GridSearchCV(KNeighborsClassifier(), param_grid_knn, cv=5, scoring='f1', n_jobs=-1)
grid_search_knn.fit(X_train_scaled, y_train_resampled)

# 8. Get the best model
best_knn_model = grid_search_knn.best_estimator_

# 9. Evaluate model (optional but good for checking)
from sklearn.metrics import classification_report
y_pred = best_knn_model.predict(X_test_scaled)
print("Classification Report for Tuned K-Nearest Neighbors:")
print(classification_report(y_test, y_pred, zero_division=0))

# 10. Save the best model and the scaler
joblib.dump(best_knn_model, 'best_knn_model.pkl')
joblib.dump(scaler, 'scaler.pkl')

print("\n✅ Successfully saved 'best_knn_model.pkl' and 'scaler.pkl' for prediction use!")
