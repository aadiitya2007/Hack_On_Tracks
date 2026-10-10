/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';

import { prisma } from './db';
import { calculateHHI, calculatePortfolioVolatility, calculateVaR, calculateRiskScore } from './risk-analytics';
import { calculateDrawdown } from './analytics';

export async function getPortfolioRiskProfile(userId?: string) {
  let holdings: any[] = [];
  
  if (userId) {
    holdings = await prisma.holding.findMany({ where: { userId } });
  } else {
    holdings = await prisma.holding.findMany();
  }

  // Fallback to Mock Portfolio if none exist (for MVP Demo)
  if (holdings.length === 0) {
    holdings = [
      { symbol: 'TCS', value: 400000, assetClass: 'EQUITY' },
      { symbol: 'RELIANCE', value: 300000, assetClass: 'EQUITY' },
      { symbol: 'HDFCBANK', value: 200000, assetClass: 'EQUITY' },
      { symbol: 'UNKNOWN_MOCK', value: 100000, assetClass: 'REAL_ESTATE' } // Unmapped
    ];
  } else {
    holdings = holdings.map(h => ({
      symbol: h.symbol,
      value: h.quantity * h.currentPrice,
      assetClass: h.assetType
    }));
  }

  const totalPortfolioValue = holdings.reduce((sum, h) => sum + h.value, 0);
  
  // 1. Identify valid vs unmapped holdings
  const validSymbols = holdings.map(h => h.symbol);
  
  // Get historical data for the last 1 year (252 trading days)
  const oneYearAgo = new Date('2021-01-01'); // Using 2021 since dataset ends 2022
  const histories = await prisma.priceHistory.findMany({
    where: { 
      symbol: { in: validSymbols },
      date: { gte: oneYearAgo }
    },
    orderBy: { date: 'asc' }
  });

  // Group by symbol
  const priceBySymbol: Record<string, number[]> = {};
  histories.forEach(h => {
    if (!priceBySymbol[h.symbol]) priceBySymbol[h.symbol] = [];
    priceBySymbol[h.symbol].push(h.close);
  });

  const analysedHoldings = holdings.filter(h => priceBySymbol[h.symbol] && priceBySymbol[h.symbol].length > 200);
  const unanalysedHoldings = holdings.filter(h => !priceBySymbol[h.symbol] || priceBySymbol[h.symbol].length <= 200);
  
  const analysedValue = analysedHoldings.reduce((sum, h) => sum + h.value, 0);
  const missingDataPct = 1 - (analysedValue / totalPortfolioValue);

  // 2. Weights and Returns Matrix
  const weights = analysedHoldings.map(h => h.value / analysedValue);
  const returnsMatrix: number[][] = []; // [symbolIndex][dayIndex]

  analysedHoldings.forEach((h, i) => {
    const prices = priceBySymbol[h.symbol];
    const rets = [];
    for (let j = 1; j < prices.length; j++) {
      rets.push((prices[j] - prices[j-1]) / prices[j-1]);
    }
    returnsMatrix.push(rets);
  });

  // 3. Covariance Matrix
  const numDays = returnsMatrix[0]?.length || 0;
  const numAssets = analysedHoldings.length;
  const covMatrix: number[][] = Array(numAssets).fill(0).map(() => Array(numAssets).fill(0));

  if (numDays > 0) {
    const means = returnsMatrix.map(rets => rets.reduce((a, b) => a + b, 0) / numDays);
    for (let i = 0; i < numAssets; i++) {
      for (let j = 0; j < numAssets; j++) {
        let cov = 0;
        for (let t = 0; t < numDays; t++) {
          cov += (returnsMatrix[i][t] - means[i]) * (returnsMatrix[j][t] - means[j]);
        }
        covMatrix[i][j] = cov / (numDays - 1);
      }
    }
  }

  // 4. Calculate Risk Metrics
  const dailyVol = calculatePortfolioVolatility(weights, covMatrix);
  const annualVol = dailyVol * Math.sqrt(252);
  const hhi = calculateHHI(weights);
  const var1d = calculateVaR(analysedValue, dailyVol, 1);
  const var1m = calculateVaR(analysedValue, dailyVol, 21); // 21 trading days in a month

  // Synthetic portfolio history for Max Drawdown
  const portfolioPrices = [];
  if (numDays > 0) {
    let currentValue = analysedValue;
    portfolioPrices.push({ date: new Date(), price: currentValue });
    for (let t = 0; t < numDays; t++) {
      let dailyReturn = 0;
      for (let i = 0; i < numAssets; i++) {
        dailyReturn += weights[i] * returnsMatrix[i][t];
      }
      currentValue = currentValue * (1 + dailyReturn);
      portfolioPrices.push({ date: new Date(), price: currentValue });
    }
  }
  const maxDrawdown = calculateDrawdown(portfolioPrices).maxDrawdown;

  // 5. Final Score
  const riskProfile = calculateRiskScore(annualVol, hhi, maxDrawdown, missingDataPct);

  return {
    totalPortfolioValue,
    analysedValue,
    missingDataPct,
    metrics: {
      annualVolatility: annualVol,
      maxDrawdown,
      hhi,
      var1d,
      var1m,
    },
    riskProfile,
    holdings: analysedHoldings.map(h => ({
      symbol: h.symbol,
      weight: h.value / analysedValue,
      value: h.value
    })),
    unanalysedHoldings: unanalysedHoldings.map(h => ({
      symbol: h.symbol,
      weight: h.value / totalPortfolioValue,
      value: h.value
    }))
  };
}
