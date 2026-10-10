import pandas as pd
import numpy as np
import os
import json
import xgboost as xgb
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, roc_auc_score

DATA_PATH = '../data/processed/stocks_processed.parquet'
MODELS_DIR = 'models'

def calc_rsi(series, periods=14):
    delta = series.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=periods).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=periods).mean()
    rs = gain / loss
    return 100 - (100 / (1 + rs))

def main():
    print("Loading data...")
    df = pd.read_parquet(DATA_PATH)
    
    symbols = df['symbol'].unique()
    all_metrics = {}
    
    for sym in symbols:
        sdf = df[df['symbol'] == sym].copy()
        sdf.sort_values('date', inplace=True)
        
        if len(sdf) < 500:
            print(f"Skipping {sym}, not enough data ({len(sdf)} rows).")
            continue
            
        # Feature Engineering
        sdf['return_1d'] = sdf['close'].pct_change()
        sdf['return_5d'] = sdf['close'].pct_change(5)
        sdf['ma_10'] = sdf['close'].rolling(10).mean() / sdf['close']
        sdf['ma_50'] = sdf['close'].rolling(50).mean() / sdf['close']
        sdf['volatility_20'] = sdf['return_1d'].rolling(20).std() * np.sqrt(252)
        sdf['rsi_14'] = calc_rsi(sdf['close'], 14)
        sdf['vol_change'] = sdf['volume'].pct_change()
        
        # Target: Next day return is positive
        sdf['target'] = (sdf['close'].shift(-1) > sdf['close']).astype(int)
        
        # Drop NAs created by lags
        sdf.replace([np.inf, -np.inf], np.nan, inplace=True)
        sdf.dropna(inplace=True)
        
        features = ['return_1d', 'return_5d', 'ma_10', 'ma_50', 'volatility_20', 'rsi_14', 'vol_change']
        
        # Chronological Split (Train on older data, test on recent data)
        # 80% train, 20% test
        split_idx = int(len(sdf) * 0.8)
        train = sdf.iloc[:split_idx]
        test = sdf.iloc[split_idx:]
        
        X_train, y_train = train[features], train['target']
        X_test, y_test = test[features], test['target']
        
        # Baseline model (always predicts majority class of train set)
        majority_class = y_train.mode()[0]
        baseline_preds = np.full(len(y_test), majority_class)
        baseline_acc = accuracy_score(y_test, baseline_preds)
        
        # Train XGBoost
        model = xgb.XGBClassifier(
            n_estimators=100,
            max_depth=3,
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            eval_metric='logloss'
        )
        model.fit(X_train, y_train)
        
        # Predictions
        preds = model.predict(X_test)
        probs = model.predict_proba(X_test)[:, 1]
        
        # Metrics
        acc = accuracy_score(y_test, preds)
        prec = precision_score(y_test, preds, zero_division=0)
        rec = recall_score(y_test, preds, zero_division=0)
        f1 = f1_score(y_test, preds, zero_division=0)
        cm = confusion_matrix(y_test, preds).tolist()
        try:
            auc = roc_auc_score(y_test, probs)
        except:
            auc = 0.5
            
        # Feature importances
        importance = model.feature_importances_
        feat_imp = {features[i]: float(importance[i]) for i in range(len(features))}
        top_features = sorted(feat_imp.items(), key=lambda x: x[1], reverse=True)[:3]
        
        all_metrics[sym] = {
            "accuracy": round(acc, 4),
            "baseline_accuracy": round(baseline_acc, 4),
            "edge": round(acc - baseline_acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1": round(f1, 4),
            "roc_auc": round(auc, 4),
            "confusion_matrix": cm,
            "top_features": [f[0] for f in top_features],
            "last_date": str(sdf['date'].iloc[-1]),
            "latest_prob_up": round(float(probs[-1]), 4)
        }
        
        # Save model
        model.save_model(os.path.join(MODELS_DIR, f"{sym}_model.json"))
        
    # Save metrics globally
    with open(os.path.join(MODELS_DIR, 'metrics.json'), 'w') as f:
        json.dump(all_metrics, f, indent=2)
        
    print(f"Trained {len(all_metrics)} models successfully. Saved to {MODELS_DIR}/metrics.json")

if __name__ == '__main__':
    main()
