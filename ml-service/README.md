# VaultIQ Stock Prediction & Market Sentiment ML Service

Experimental stock prediction module for **Hack On Track 2026** ("All Your Investments, In One Place").

## Architecture & Tech Stack
- **Framework**: Python 3.9+, FastAPI, Uvicorn
- **Machine Learning**: XGBoost Classifier, pandas, numpy, scikit-learn
- **Dataset**: Historical daily OHLCV stock data (124,000+ daily price records across 50 Indian stocks)

---

## 1. Feature Engineering
Features are engineered strictly chronologically to prevent future information leakage:
- `return_1d`: 1-day lagged log return (`close.pct_change(1)`)
- `return_5d`: 5-day momentum return (`close.pct_change(5)`)
- `ma_10`: Ratio of 10-day simple moving average to close price
- `ma_50`: Ratio of 50-day simple moving average to close price
- `volatility_20`: Rolling 20-day annualized standard deviation (`std * sqrt(252)`)
- `rsi_14`: 14-day Relative Strength Index (RSI)
- `vol_change`: Daily volume percentage change

---

## 2. Model Training & Time-Series Evaluation
- **Target Variable**: Binary classification predicting whether the next trading day's close price will be higher (`1`) or lower (`0`).
- **Validation Split**: Chronological 80/20 train/test split (no random shuffling to prevent temporal data leakage).
- **Baseline Comparison**: Compared against a Naïve Majority-Class Baseline.
- **Evaluation Metrics**:
  - Accuracy & Accuracy Edge over Baseline
  - Precision, Recall, F1 Score
  - ROC-AUC Score & Log Loss
  - Test Set Confusion Matrix

---

## 3. Setup & Run Instructions

### Prerequisites
- Python 3.9+
- Virtual Environment (`data_venv`)

### Installation
```bash
# Navigate to project root
cd /path/to/Hack_On_Tracks

# Activate environment & install dependencies
source data_venv/bin/activate
pip install -r ml-service/requirements.txt
```

### Train ML Models
To retrain XGBoost models on the historical dataset:
```bash
cd ml-service
python train.py
```

### Run FastAPI Service
To launch the backend API:
```bash
cd ml-service
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 4. API Endpoints

- `GET /` — Health check & available models count
- `GET /symbols` — List of trained stock symbols
- `GET /predict/{symbol}` — Return next-day directional prediction signal, probability, feature importances, confidence level, and disclaimer
- `GET /metrics/{symbol}` — Detailed model accuracy vs baseline metrics, confusion matrix, ROC-AUC
- `GET /news` — Financial news feed for stocks with sentiment indicators (Bullish / Bearish / Neutral)

---

## Disclaimer
Experimental statistical prediction model. Past performance is no guarantee of future returns. Designed solely for educational hackathon demonstration.
