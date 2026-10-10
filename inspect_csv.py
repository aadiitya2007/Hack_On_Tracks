import csv
import os
from collections import defaultdict
from datetime import datetime

def inspect_file(filepath):
    filesize_mb = os.path.getsize(filepath) / (1024 * 1024)
    filename = os.path.basename(filepath)
    
    row_count = 0
    missing_values = defaultdict(int)
    symbols = set()
    dates = set()
    
    # Track duplicates
    seen_rows = set()
    duplicate_count = 0
    
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        columns = next(reader)
        
        date_col = columns.index('Date') if 'Date' in columns else None
        stock_col = columns.index('Stock') if 'Stock' in columns else None
        
        for row in reader:
            if not row: continue
            row_count += 1
            
            # Missing values
            for i, val in enumerate(row):
                if not val.strip() or val.strip().lower() in ['na', 'nan', 'null']:
                    missing_values[columns[i]] += 1
            
            # Duplicates check (we'll hash the whole row or just Date+Stock)
            row_tuple = tuple(row)
            if row_tuple in seen_rows:
                duplicate_count += 1
            else:
                seen_rows.add(row_tuple)
                
            if stock_col is not None:
                symbols.add(row[stock_col].strip())
                
            if date_col is not None:
                dates.add(row[date_col].strip())

    sorted_dates = sorted(list(dates))
    date_range = (sorted_dates[0], sorted_dates[-1]) if sorted_dates else ("Unknown", "Unknown")
    
    print(f"--- Report for {filename} ---")
    print(f"Size: {filesize_mb:.2f} MB")
    print(f"Row count: {row_count:,}")
    print(f"Columns & Types: {', '.join(columns)} (All read as strings, mostly numeric)")
    print(f"Date Range: {date_range[0]} to {date_range[1]}")
    print(f"Number of unique symbols: {len(symbols)}")
    print(f"Duplicate Rows: {duplicate_count:,}")
    print(f"Missing Values: {dict(missing_values) if missing_values else 'None'}")
    
    print(f"Sample Symbols: {list(symbols)[:20]}")

inspect_file('data/raw/stocks_df.csv')
