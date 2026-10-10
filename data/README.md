# Unify Data Processing

This folder contains the data engineering pipeline for processing raw financial data into optimized formats suitable for the Unify Time Machine simulator.

## Directory Structure
- `/raw/` - Raw, uncompressed data files (e.g., `stocks_df.csv`). *Note: Ignored by git due to file size constraints.*
- `/processed/` - Cleaned, aggregated, and compressed Parquet files optimized for quick ingestion.
- `config.json` - Configuration rules declaring which date ranges and symbols to preserve.

## Data Processing Pipeline (`/scripts/prepare_data.py`)

The pipeline was built to transform a heavy 218 MB raw CSV (4M+ rows, 1700+ symbols) into an optimized <3MB dataset without losing high-quality historical simulation fidelity.

### Pipeline Steps:
1. **Standardization:** Column names are converted to lowercase and standardized (`date`, `symbol`, `open`, `high`, `low`, `close`, `volume`, `change_pct`).
2. **Date Parsing:** Safely casts all strings to Python datetime objects.
3. **Filtering:** Slices the dataset down to the parameters listed in `config.json` (Currently: Top 50 symbols from 2012 to 2022).
4. **Deduplication:** Sorts by symbol and date, dropping any exact duplicate rows.
5. **Handling Missing Values:** Short gaps (limit=5 days) are forward-filled (`ffill`). Any rows that still contain `NaN` in critical columns are safely dropped.
6. **Anomaly Detection:** Flags suspicious one-day jumps (e.g., >100% gain or >30% drop) which typically indicate a stock split, bonus issue, or a bad tick. This adds a `suspicious_jump` boolean column.
7. **Compression:** Outputs the final dataset to `/processed/stocks_processed.parquet` using Snappy compression.
8. **Reporting:** Generates a `/processed/data_quality_report.json` logging the exact row counts, missing values handled, and duplicates removed.

## Data Characteristics & Adjustments
- **Frequency:** Daily closing prices.
- **Adjustments:** Prices are **UNADJUSTED** raw prices. Dividends are NOT included in the closing price.
- **Corporate Actions:** Large percentage drops indicating a potential split/bonus are flagged, but the historical prices themselves have not been mathematically backward-adjusted.
