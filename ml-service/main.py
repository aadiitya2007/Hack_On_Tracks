from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import os
import random
from typing import Optional

app = FastAPI(title="Unify ML Prediction & News Service")

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

# Load cached metrics
metrics = {}
if os.path.exists(METRICS_FILE):
    try:
        with open(METRICS_FILE, 'r') as f:
            metrics = json.load(f)
    except Exception as e:
        print(f"Error loading metrics file: {e}")

# Pre-canned financial news feed for stocks with sentiment tags
STOCK_NEWS = [
    {
        "id": 1,
        "symbol": "RELIANCE",
        "title": "Reliance Industries expands green energy initiatives with new solar gigafactory investment",
        "source": "FinTech Daily",
        "time": "2 hours ago",
        "sentiment": "BULLISH",
        "impact": "High",
        "summary": "Analyst sentiment turns strongly positive as capital expenditure plans align with national renewable energy targets."
    },
    {
        "id": 2,
        "symbol": "HDFCBANK",
        "title": "HDFC Bank reports 17% YoY credit growth in latest quarterly operational update",
        "source": "Economic Times",
        "time": "4 hours ago",
        "sentiment": "BULLISH",
        "impact": "Medium",
        "summary": "Deposit mobilization rebounds sharply, easing net interest margin compression concerns among institutional investors."
    },
    {
        "id": 3,
        "symbol": "TCS",
        "title": "IT sector faces short-term guidance revisions amid muted US client tech spending",
        "source": "Financial Express",
        "time": "5 hours ago",
        "sentiment": "BEARISH",
        "impact": "Medium",
        "summary": "Tier-1 Indian IT services firms see deal sign-off delays in discretionary digital transformation projects."
    },
    {
        "id": 4,
        "symbol": "TATAMOTORS",
        "title": "Tata Motors JLR EV sales surge 24% sequentially across European markets",
        "source": "AutoFin News",
        "time": "6 hours ago",
        "sentiment": "BULLISH",
        "impact": "High",
        "summary": "Jaguar Land Rover order book remains strong at 148,000 units with improving gross margins."
    },
    {
        "id": 5,
        "symbol": "BAJFINANCE",
        "title": "RBI regulatory update on unsecured consumer lending impacts NBFC margin expectations",
        "source": "Moneycontrol",
        "time": "8 hours ago",
        "sentiment": "BEARISH",
        "impact": "High",
        "summary": "Higher risk weights on credit cards and personal loans expected to moderate short-term loan growth."
    },
    {
        "id": 6,
        "symbol": "INFY",
        "title": "Infosys expands AI enterprise partnership ecosystem with major cloud providers",
        "source": "TechWire India",
        "time": "10 hours ago",
        "sentiment": "BULLISH",
        "impact": "Medium",
        "summary": "Generative AI implementations reach over 50 enterprise client deployments this quarter."
    }
]

@app.get("/")
def health_check():
    return {
        "status": "ok",
        "service": "Unify ML & Sentiment Engine",
        "available_models": len(metrics)
    }

@app.get("/symbols")
def get_symbols():
    return {"symbols": list(metrics.keys())}

@app.get("/metrics/{symbol}")
def get_symbol_metrics(symbol: str):
    symbol_upper = symbol.upper()
    if symbol_upper not in metrics:
        # Fallback default evaluation structure
        return {
            "symbol": symbol_upper,
            "accuracy": 0.542,
            "baseline_accuracy": 0.510,
            "edge": 0.032,
            "precision": 0.551,
            "recall": 0.538,
            "f1": 0.544,
            "roc_auc": 0.565,
            "confusion_matrix": [[45, 38], [32, 53]],
            "top_features": ["return_1d", "rsi_14", "ma_10"],
            "last_date": "2022-12-30",
            "latest_prob_up": 0.56
        }
    return metrics[symbol_upper]

@app.get("/predict/{symbol}")
def predict_next_day(symbol: str):
    symbol_upper = symbol.upper()
    
    if symbol_upper in metrics:
        m = metrics[symbol_upper]
        prob = m['latest_prob_up']
        accuracy = m['accuracy']
        top_feats = m['top_features']
    else:
        # Fallback mock calculation for unknown stocks
        prob = 0.55
        accuracy = 0.52
        top_feats = ["return_1d", "rsi_14", "ma_10"]

    signal = "BULLISH" if prob >= 0.52 else ("BEARISH" if prob <= 0.48 else "NEUTRAL")
    confidence = "High" if abs(prob - 0.5) > 0.1 else ("Moderate" if abs(prob - 0.5) > 0.04 else "Low")

    return {
        "symbol": symbol_upper,
        "as_of_date": metrics.get(symbol_upper, {}).get('last_date', '2022-12-30'),
        "probability_positive": prob,
        "signal": signal,
        "confidence": confidence,
        "accuracy": accuracy,
        "top_features": top_feats,
        "model_version": "v1.0-xgboost",
        "reliability": "Moderate" if accuracy >= 0.54 else "Low",
        "disclaimer": "Experimental statistical prediction based on daily OHLCV technical indicators. Past performance is no guarantee of future returns. Not financial advice."
    }

@app.get("/news")
def get_all_news(symbol: Optional[str] = None):
    if symbol:
        filtered = [n for n in STOCK_NEWS if n["symbol"].upper() == symbol.upper()]
        return {"news": filtered if filtered else STOCK_NEWS[:3]}
    return {"news": STOCK_NEWS}
