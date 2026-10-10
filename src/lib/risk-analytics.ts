/* eslint-disable @typescript-eslint/no-explicit-any */
export type HoldingData = {
  symbol: string;
  value: number;
  weight: number;
  assetClass: string;
};

export const ASSET_DOMAINS = [
  { key: 'stocks', label: 'Stocks (Direct Equities)', vol: 0.225, mdd: 0.240, expReturn: 0.142, leverage: 1.0, color: '#7C3AED' },
  { key: 'mutualFunds', label: 'Mutual Funds', vol: 0.140, mdd: 0.125, expReturn: 0.120, leverage: 1.0, color: '#F97316' },
  { key: 'etfs', label: 'ETFs (Index Baskets)', vol: 0.135, mdd: 0.110, expReturn: 0.115, leverage: 1.0, color: '#2563EB' },
  { key: 'bonds', label: 'Bonds & Fixed Income', vol: 0.045, mdd: 0.032, expReturn: 0.075, leverage: 1.0, color: '#D97706' },
  { key: 'reits', label: 'REITs (Real Estate)', vol: 0.092, mdd: 0.075, expReturn: 0.095, leverage: 1.0, color: '#0D9488' },
  { key: 'invits', label: 'InvITs (Infrastructure)', vol: 0.085, mdd: 0.068, expReturn: 0.092, leverage: 1.0, color: '#8B5CF6' },
  { key: 'fno', label: 'Futures & Options (Derivatives)', vol: 0.450, mdd: 0.550, expReturn: 0.180, leverage: 3.5, color: '#EF4444' },
];

export const CORRELATION_MATRIX_7X7 = [
  // stocks, mf, etf, bonds, reits, invits, fno
  [1.00, 0.88, 0.92, -0.15, 0.25, 0.20, 0.78], // stocks
  [0.88, 1.00, 0.85, -0.10, 0.30, 0.25, 0.65], // mf
  [0.92, 0.85, 1.00, -0.12, 0.28, 0.22, 0.70], // etf
  [-0.15, -0.10, -0.12, 1.00, 0.05, 0.08, -0.20], // bonds
  [0.25, 0.30, 0.28, 0.05, 1.00, 0.65, 0.15], // reits
  [0.20, 0.25, 0.22, 0.08, 0.65, 1.00, 0.10], // invits
  [0.78, 0.65, 0.70, -0.20, 0.15, 0.10, 1.00], // fno
];

// Calculate Herfindahl-Hirschman Index for concentration
export function calculateHHI(weights: number[]): number {
  return weights.reduce((sum, w) => sum + Math.pow(w * 100, 2), 0);
}

// Calculate Portfolio Volatility (Daily or Annual)
export function calculatePortfolioVolatility(weights: number[], covMatrix: number[][]): number {
  if (weights.length === 0 || covMatrix.length === 0) return 0;
  
  let variance = 0;
  for (let i = 0; i < weights.length; i++) {
    for (let j = 0; j < weights.length; j++) {
      variance += weights[i] * weights[j] * covMatrix[i][j];
    }
  }
  return Math.sqrt(Math.max(0, variance));
}

// Parametric Value at Risk (95% confidence level)
export function calculateVaR(portfolioValue: number, dailyVolatility: number, days: number = 1, zScore: number = 1.645): number {
  return portfolioValue * dailyVolatility * Math.sqrt(days) * zScore;
}

// Calculate Risk Score (0-100, where 100 is highest risk)
export function calculateRiskScore(annualVol: number, hhi: number, maxDrawdown: number, missingDataPct: number): {
  score: number,
  category: 'Low' | 'Moderate' | 'High',
  breakdown: any
} {
  const volScore = Math.min(100, (annualVol / 0.40) * 100);
  const concentrationScore = (hhi / 10000) * 100;
  const ddScore = Math.min(100, (maxDrawdown / 0.50) * 100);
  const penalty = missingDataPct * 50; 
  
  let rawScore = (volScore * 0.40) + (concentrationScore * 0.30) + (ddScore * 0.30) + penalty;
  rawScore = Math.min(100, Math.max(0, rawScore));

  let category: 'Low' | 'Moderate' | 'High' = 'Moderate';
  if (rawScore < 40) category = 'Low';
  else if (rawScore > 70) category = 'High';

  return {
    score: Math.round(rawScore),
    category,
    breakdown: {
      volatility: Math.round(volScore * 0.40),
      concentration: Math.round(concentrationScore * 0.30),
      drawdown: Math.round(ddScore * 0.30),
      penalty: Math.round(penalty)
    }
  };
}

// Full 7-Domain Multi-Asset Mathematical Risk Calculation Engine
export function calculateMultiAssetRiskProfile(weightsRecord: Record<string, number>, totalValue: number = 1000000) {
  const rawSum = Object.values(weightsRecord).reduce((a, b) => a + b, 0) || 100;
  const normalizedWeights = ASSET_DOMAINS.map(d => (weightsRecord[d.key] || 0) / rawSum);

  // Construct 7x7 Covariance Matrix from Asset Volatilities & Correlation Matrix
  const n = ASSET_DOMAINS.length;
  const covMatrix: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      covMatrix[i][j] = CORRELATION_MATRIX_7X7[i][j] * ASSET_DOMAINS[i].vol * ASSET_DOMAINS[j].vol;
    }
  }

  // Portfolio Annual Volatility
  const annualVol = calculatePortfolioVolatility(normalizedWeights, covMatrix);
  
  // Weighted Max Drawdown & Expected Return
  const maxDrawdown = normalizedWeights.reduce((sum, w, idx) => sum + w * ASSET_DOMAINS[idx].mdd, 0);
  const expectedReturn = normalizedWeights.reduce((sum, w, idx) => sum + w * ASSET_DOMAINS[idx].expReturn, 0);

  // Herfindahl-Hirschman Index for Asset Class Concentration
  const hhi = calculateHHI(normalizedWeights);

  // Parametric Value at Risk (95% 1-Month = 21 trading days)
  const monthlyVol = annualVol / Math.sqrt(12);
  const var1m = totalValue * 1.645 * monthlyVol;
  const var1d = totalValue * 1.645 * (annualVol / Math.sqrt(252));

  // Risk-Adjusted Sharpe Ratio (Risk-free rate = 6.5%)
  const rf = 0.065;
  const sharpeRatio = annualVol > 0 ? (expectedReturn - rf) / annualVol : 0;

  // Leverage & F&O Risk Penalty
  const fnoWeight = normalizedWeights[6]; // F&O
  const leveragePenalty = fnoWeight * 30;

  // Composite Risk Score
  const volScore = Math.min(100, (annualVol / 0.35) * 100);
  const concScore = (hhi / 10000) * 100;
  const ddScore = Math.min(100, (maxDrawdown / 0.45) * 100);

  let rawScore = (volScore * 0.40) + (concScore * 0.30) + (ddScore * 0.30) + leveragePenalty;
  rawScore = Math.min(100, Math.max(0, rawScore));

  let category: 'Low' | 'Moderate' | 'High' = 'Moderate';
  if (rawScore < 35) category = 'Low';
  else if (rawScore > 65) category = 'High';

  return {
    score: Math.round(rawScore),
    category,
    annualVolatility: annualVol,
    maxDrawdown,
    expectedReturn,
    hhi,
    var1m,
    var1d,
    sharpeRatio,
    normalizedWeights,
    breakdown: {
      volatilityComponent: Math.round(volScore * 0.40),
      concentrationComponent: Math.round(concScore * 0.30),
      drawdownComponent: Math.round(ddScore * 0.30),
      leveragePenalty: Math.round(leveragePenalty)
    }
  };
}
