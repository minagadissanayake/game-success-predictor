from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas import GameInput, PredictionResponse
import joblib
import pandas as pd
import shap
import os

app = FastAPI(title="Game Success Predictor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model artifacts
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ML_DIR = os.path.join(BASE_DIR, '..', 'ml')

model = joblib.load(os.path.join(ML_DIR, 'model.joblib'))
label_encoder = joblib.load(os.path.join(ML_DIR, 'label_encoder.joblib'))
feature_columns = joblib.load(os.path.join(ML_DIR, 'feature_columns.joblib'))
explainer = shap.TreeExplainer(model)

MAJOR_PUBLISHERS = [
    'Electronic Arts', 'Ubisoft', 'Activision', 'Nintendo',
    'Sony', 'Microsoft', 'Sega', 'Bethesda', 'Square Enix',
    'Rockstar Games', '2K Games', 'Capcom', 'Bandai Namco'
]

@app.get("/")
def root():
    return {"status": "Game Success Predictor API is running"}

@app.post("/api/predict", response_model=PredictionResponse)
def predict(game: GameInput):
    # Feature engineering (mirrors notebook logic)
    genre_encoded = label_encoder.transform([game.primary_genre])[0] \
        if game.primary_genre in label_encoder.classes_ else 0

    is_major = int(any(pub in game.publisher for pub in MAJOR_PUBLISHERS)) \
        if game.publisher else 0

    features = {
        'genre_count': game.genre_count,
        'platform_count': game.platform_count,
        'is_major_publisher': is_major,
        'release_year': game.release_year,
        'playtime': game.playtime,
        'ratings_count': game.ratings_count,
        'reviews_count': game.reviews_count,
        'added_status_owned': game.added_status_owned,
        'genre_encoded': genre_encoded
    }

    input_df = pd.DataFrame([features])[feature_columns]
    prob = model.predict_proba(input_df)[0][1]

    # SHAP values for top factors
    shap_vals = explainer.shap_values(input_df)[0]
    shap_pairs = sorted(
        zip(feature_columns, shap_vals),
        key=lambda x: abs(x[1]),
        reverse=True
    )[:5]

    top_factors = [
        {"feature": feat, "impact": round(float(val), 4)}
        for feat, val in shap_pairs
    ]

    return {
        "success_probability": round(prob * 100, 1),
        "prediction": "Likely Successful" if prob >= 0.5 else "At Risk",
        "confidence": "High" if abs(prob - 0.5) > 0.25 else "Medium",
        "top_factors": top_factors
    }