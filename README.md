# 🎮 Game Success Predictor

A full-stack machine learning application that predicts whether a video game will be commercially successful — powered by XGBoost, SHAP explainability, FastAPI, and React.

🔗 **Live Demo:** [game-success-predictor.vercel.app](https://game-success-predictor.vercel.app)  
🔗 **API Docs:** [game-success-predictor.onrender.com/docs](https://game-success-predictor.onrender.com/docs)

---

## 📸 Preview

> Enter a game's details — genre, platform count, release year, expected engagement — and get an instant ML-powered success prediction with SHAP-based factor explanations.

---

## 🧠 How It Works

1. **Data:** 4,700+ games with Metacritic scores sourced from the RAWG dataset (Kaggle)
2. **Label:** Games with a Metacritic score ≥ 75 are classified as "Successful"
3. **Features:** Genre, platform count, genre count, release year, playtime, ratings count, reviews count, owned count, publisher tier
4. **Model:** XGBoost classifier trained with an 80/20 train/test split
5. **Explainability:** SHAP TreeExplainer surfaces the top factors driving each prediction
6. **API:** FastAPI serves predictions and SHAP values as JSON
7. **Frontend:** React displays the probability, verdict, and an interactive SHAP factor bar chart

---

## 📊 Model Performance

| Metric | Score |
|---|---|
| Accuracy | 70% |
| AUC-ROC | 0.76 |
| Precision (Success) | 0.72 |
| Recall (Success) | 0.67 |
| Training samples | ~3,786 |
| Test samples | ~947 |

**Key findings from SHAP analysis:**
- `reviews_count` and `ratings_count` are the strongest predictors — engagement signals matter most
- `release_year` is positively correlated with success — newer games score higher
- Genre has moderate impact — Platformer, Shooter, and Puzzle genres outperform Adventure and Arcade
- `is_major_publisher` has surprisingly low impact — indie games are competitive

---

## 🏗️ Architecture

```
┌─────────────────────┐         ┌──────────────────────┐
│   React Frontend    │  POST   │   FastAPI Backend    │
│  Vite + Tailwind    │────────▶│   Render (Python)    │
│  Vercel             │◀────────│                      │
└─────────────────────┘  JSON   │  ┌────────────────┐  │
                                │  │ XGBoost Model  │  │
                                │  │ SHAP Explainer │  │
                                │  │ joblib artifacts│  │
                                │  └────────────────┘  │
                                └──────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| ML Model | XGBoost, scikit-learn |
| Explainability | SHAP |
| Data Processing | pandas, numpy |
| Backend | FastAPI, uvicorn |
| Model Serialization | joblib |
| Frontend | React, Vite, Tailwind CSS |
| Backend Deployment | Render |
| Frontend Deployment | Vercel |

---

## 📁 Project Structure

```
game-success-predictor/
├── data/
│   ├── raw/                  # RAWG Kaggle dataset (not tracked)
│   └── processed/
├── notebooks/
│   └── 01_eda.ipynb          # EDA, feature engineering, model training
├── ml/
│   ├── model.joblib          # Trained XGBoost model
│   ├── label_encoder.joblib  # Genre label encoder
│   └── feature_columns.joblib
├── backend/
│   ├── main.py               # FastAPI app + prediction endpoint
│   ├── schemas.py            # Pydantic request/response models
│   └── requirements.txt
└── frontend/
    └── src/
        ├── App.jsx
        └── components/
            ├── PredictorForm.jsx
            └── ResultCard.jsx
```

---

## 🚀 Running Locally

### Prerequisites
- Python 3.11
- Node.js 18+

### Backend

```bash
# Create and activate virtual environment
python -m venv venv
source venv/Scripts/activate  # Windows Git Bash

# Install dependencies
pip install -r backend/requirements.txt

# Download dataset
# Get games.csv from https://www.kaggle.com/datasets/jummyegg/rawg-game-dataset
# Place it in data/raw/games.csv

# Run the notebook to train and save the model
# notebooks/01_eda.ipynb

# Start the API
cd backend
uvicorn main:app --reload
# API available at http://localhost:8000
# Docs at http://localhost:8000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# App available at http://localhost:5173
```

---

## 📡 API Reference

### `POST /api/predict`

Predicts game success probability with SHAP factor explanations.

**Request body:**
```json
{
  "primary_genre": "Action",
  "genre_count": 3,
  "platform_count": 4,
  "publisher": "Ubisoft",
  "release_year": 2023,
  "playtime": 10,
  "ratings_count": 500,
  "reviews_count": 50,
  "added_status_owned": 200
}
```

**Response:**
```json
{
  "success_probability": 86.3,
  "prediction": "Likely Successful",
  "confidence": "High",
  "top_factors": [
    { "feature": "ratings_count", "impact": 1.5608 },
    { "feature": "release_year", "impact": 0.4699 },
    { "feature": "added_status_owned", "impact": 0.2682 },
    { "feature": "reviews_count", "impact": -0.3340 },
    { "feature": "genre_encoded", "impact": -0.2070 }
  ]
}
```

---

## 📄 Dataset

**Source:** [RAWG Game Dataset — Kaggle](https://www.kaggle.com/datasets/jummyegg/rawg-game-dataset)

- 474,000+ total games
- 4,733 games with Metacritic scores (used for training)
- Features: name, genre, platform, publisher, release date, playtime, ratings, reviews, ownership counts

---

## 🔮 Future Improvements

- Add cross-validation and hyperparameter tuning for better accuracy
- Include more publisher and developer features
- Add a confidence interval to predictions
- Support batch predictions via CSV upload