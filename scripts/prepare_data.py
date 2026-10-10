import pandas as pd
import json
import os
import numpy as np
from datetime import datetime

# Configurations
CONFIG_PATH = 'data/config.json'
RAW_DATA_PATH = 'data/raw/stocks_df.csv'
PROCESSED_DATA_PATH = 'data/processed/stocks_processed.parquet'
REPORT_PATH = 'data/processed/data_quality_report.json'

def main():
    print(f"[{datetime.now()}] Loading configuration...")
    with open(CONFIG_PATH, 'r') as f:
        config = json.load(f)
        
    target_symbols = set(config['symbols'])
    start_date = pd.to_datetime(config['start_date'])
    end_date = pd.to_datetime(config['end_date'])

    print(f"[{datetime.now()}] Loading raw data...")
    # Read the data
    df = pd.read_csv(RAW_DATA_PATH)
    
    # 1. Standardise column names
    print(f"[{datetime.now()}] Standardising columns...")
    col_mapping = {
        'Date': 'date',
        'Stock': 'symbol',
        'Open': 'open',
        'High': 'high',
        'Low': 'low',
        'Close': 'close',
        'Volume': 'volume',
        'Change Pct': 'change_pct'
    }
    df.rename(columns=col_mapping, inplace=True)
    
    # Ensure all required columns exist, fill if missing
    for col in col_mapping.values():
        if col not in df.columns:
            df[col] = np.nan
            
    # 2. Parse dates
    print(f"[{datetime.now()}] Parsing dates...")
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    
    # 3. Filter by date and symbols
    print(f"[{datetime.now()}] Filtering data...")
    initial_rows = len(df)
    df = df[(df['date'] >= start_date) & (df['date'] <= end_date)]
    df = df[df['symbol'].isin(target_symbols)]
    filtered_rows = len(df)
    
    # 4. Sort and remove duplicates
    print(f"[{datetime.now()}] Sorting and removing duplicates...")
    df.sort_values(by=['symbol', 'date'], inplace=True)
    duplicates = df.duplicated(subset=['symbol', 'date'], keep='last').sum()
    df.drop_duplicates(subset=['symbol', 'date'], keep='last', inplace=True)
    
    # 5. Handle missing values transparently (forward-fill short gaps)
    print(f"[{datetime.now()}] Handling missing values...")
    missing_before = df.isnull().sum().to_dict()
    
    # Group by symbol and forward fill with limit=5
    df = df.groupby('symbol').apply(lambda group: group.ffill(limit=5)).reset_index(drop=True)
    missing_after = df.isnull().sum().to_dict()
    
    # Drop rows that STILL have NaN in critical columns (e.g., date, symbol, close)
    df.dropna(subset=['date', 'symbol', 'close'], inplace=True)
    
    # 6. Flag bad ticks and suspicious one-day jumps
    print(f"[{datetime.now()}] Flagging suspicious jumps...")
    # Calculate day-over-day return based on close price
    df['prev_close'] = df.groupby('symbol')['close'].shift(1)
    # Avoid division by zero
    df['daily_return'] = np.where(df['prev_close'] > 0, 
                                  (df['close'] - df['prev_close']) / df['prev_close'], 
                                  np.nan)
    
    # Flag drops of more than 30% (could be splits/bonus) or jumps > 100%
    df['suspicious_jump'] = ((df['daily_return'] < -0.30) | (df['daily_return'] > 1.0))
    suspicious_count = int(df['suspicious_jump'].sum())
    
    df.drop(columns=['prev_close', 'daily_return'], inplace=True)
    
    # 7. Output compressed Parquet
    print(f"[{datetime.now()}] Saving to Parquet...")
    df.to_parquet(PROCESSED_DATA_PATH, index=False, compression='snappy')
    final_size_mb = os.path.getsize(PROCESSED_DATA_PATH) / (1024 * 1024)
    
    # 8. Data-quality report
    report = {
        "report_generated_at": datetime.now().isoformat(),
        "data_processing": {
            "initial_rows_in_raw": initial_rows,
            "rows_after_filtering": filtered_rows,
            "final_rows_saved": len(df),
            "duplicates_removed": int(duplicates),
            "suspicious_jumps_flagged": suspicious_count
        },
        "missing_values": {
            "before_ffill": {k: int(v) for k, v in missing_before.items()},
            "after_ffill": {k: int(v) for k, v in missing_after.items()}
        },
        "metadata": {
            "symbols_included": list(target_symbols),
            "date_range": [config['start_date'], config['end_date']],
            "output_file": PROCESSED_DATA_PATH,
            "output_size_mb": round(final_size_mb, 2),
            "price_adjustment_note": "Prices are UNADJUSTED raw prices. Stock splits/bonus issues are flagged in 'suspicious_jump' but not mathematically adjusted. Dividends are NOT included."
        }
    }
    
    with open(REPORT_PATH, 'w') as f:
        json.dump(report, f, indent=2)
        
    print(f"[{datetime.now()}] Done! Output size: {final_size_mb:.2f} MB")
    print(f"Report saved to {REPORT_PATH}")

if __name__ == '__main__':
    main()
