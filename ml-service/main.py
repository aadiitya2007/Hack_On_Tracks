from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import os
import xgboost as xgb
import pandas as pd
import numpy as np

app = FastAPI(title="VaultIQ ML Prediction Service")

# Allow CORS for Next.js app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODELS_DIR = 'models'
METRICS_FILE = os.path.join(MODELS_DIR, 'metrics.json')

# Cache
metrics = {}
if os.path.exists(METRICS_FILE):
    with open(METRICS_FILE, 'r') as f:
        metrics = json.load(f)

@app.get("/")
def health_check():
    return {"status": "ok", "service": "VaultIQ ML"}

@app.get("/symbols")
def get_symbols():
    return {"symbols": list(metrics.keys())}

@app.get("/metrics/{symbol}")
def get_symbol_metrics(symbol: str):
    if symbol not in metrics:
        raise HTTPException(status_code=404, detail="Metrics not found for this symbol")
    return metrics[symbol]

@app.get("/predict/{symbol}")
def predict_next_day(symbol: str):
    if symbol not in metrics:
        raise HTTPException(status_code=404, detail="Prediction not available for this symbol")
        
    m = metrics[symbol]
    
    # In a real app, we would dynamically run inference on the latest live data.
    # For this demo, we return the pre-calculated probability of the last known day from the test set.
    return {
        "symbol": symbol,
        "as_of_date": m['last_date'],
        "probability_positive": m['latest_prob_up'],
        "model_version": "v1.0-xgboost",
        "reliability": "Low/Moderate" if m['accuracy'] < 0.55 else "Moderate",
        "disclaimer": "Using sample data. Past performance does not guarantee future results. Accuracy is historically near 50-55%. Do not use for real trading."
    }
