/* eslint-disable @typescript-eslint/no-explicit-any */
export type HoldingData = {
  symbol: string;
  value: number;
  weight: number;
  assetClass: string;
};

// Calculate Herfindahl-Hirschman Index for concentration
export function calculateHHI(weights: number[]): number {
  return weights.reduce((sum, w) => sum + Math.pow(w * 100, 2), 0);
}

// Calculate Portfolio Volatility (Daily)
// weights: array of weights (sum = 1)
// covMatrix: NxN covariance matrix of daily returns
export function calculatePortfolioVolatility(weights: number[], covMatrix: number[][]): number {
  if (weights.length === 0 || covMatrix.length === 0) return 0;
  
  let variance = 0;
  for (let i = 0; i < weights.length; i++) {
    for (let j = 0; j < weights.length; j++) {
      variance += weights[i] * weights[j] * covMatrix[i][j];
    }
  }
  return Math.sqrt(Math.max(0, variance)); // Daily Volatility
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
  // 1. Volatility Component (40% weight). Maxes out around 40% annual vol.
  const volScore = Math.min(100, (annualVol / 0.40) * 100);
  
  // 2. Concentration (HHI) Component (30% weight). Maxes out at 10000 (100% one stock).
  const concentrationScore = (hhi / 10000) * 100;
  
  // 3. Drawdown Component (30% weight). Maxes out at 50% drawdown.
  const ddScore = Math.min(100, (maxDrawdown / 0.50) * 100);

  // Missing data penalty (adds flat risk)
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
