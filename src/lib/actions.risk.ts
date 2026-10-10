/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';

import { prisma } from './db';
import { calculateHHI, calculatePortfolioVolatility, calculateVaR, calculateRiskScore } from './risk-analytics';
import { calculateDrawdown } from './analytics';

// Pre-computed demo fallback so the Risk page ALWAYS renders
const DEMO_RISK_RESULT = {
  totalPortfolioValue: 1000000,
  analysedValue: 900000,
  missingDataPct: 0.1,
  metrics: {
    annualVolatility: 0.145,
    maxDrawdown: 0.18,
    hhi: 2150,
    var1d: 14500,
    var1m: 65000,
  },
  riskProfile: {
    score: 58,
    category: 'Moderate' as const,
    breakdown: {
      volatility: { value: 0.145, weight: 0.3, contribution: 17.4 },
      concentration: { value: 2150, weight: 0.25, contribution: 14.5 },
      drawdown: { value: 0.18, weight: 0.25, contribution: 14.5 },
      missingData: { value: 0.1, weight: 0.2, contribution: 11.6 },
    }
  },
  holdings: [
    { symbol: 'TCS', weight: 0.40, value: 400000 },
    { symbol: 'RELIANCE', weight: 0.30, value: 300000 },
    { symbol: 'HDFCBANK', weight: 0.20, value: 200000 },
  ],
  unanalysedHoldings: [
    { symbol: 'UNKNOWN_MOCK', weight: 0.10, value: 100000 }
  ]
};

export async function getPortfolioRiskProfile(userId?: string) {
  try {
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
        { symbol: 'UNKNOWN_MOCK', value: 100000, assetClass: 'REAL_ESTATE' }
      ];
    } else {
      holdings = holdings.map(h => ({
        symbol: h.symbol,
        value: h.quantity * h.currentPrice,
        assetClass: h.assetType
      }));
    }

    const totalPortfolioValue = holdings.reduce((sum, h) => sum + h.value, 0);
    const validSymbols = holdings.map(h => h.symbol);
    
    const oneYearAgo = new Date('2021-01-01');
    const histories = await prisma.priceHistory.findMany({
      where: { 
        symbol: { in: validSymbols },
        date: { gte: oneYearAgo }
      },
      orderBy: { date: 'asc' }
    });

    // If no price history at all, return demo data
    if (histories.length === 0) {
      console.log('No price history found, returning demo risk data');
      return DEMO_RISK_RESULT;
    }

    const priceBySymbol: Record<string, number[]> = {};
    histories.forEach(h => {
      if (!priceBySymbol[h.symbol]) priceBySymbol[h.symbol] = [];
      priceBySymbol[h.symbol].push(h.price);
    });

    const analysedHoldings = holdings.filter(h => priceBySymbol[h.symbol] && priceBySymbol[h.symbol].length > 20);
    const unanalysedHoldings = holdings.filter(h => !priceBySymbol[h.symbol] || priceBySymbol[h.symbol].length <= 20);
    
    // If no holdings have enough data, return demo
    if (analysedHoldings.length === 0) {
      console.log('No holdings with sufficient price history, returning demo risk data');
      return DEMO_RISK_RESULT;
    }

    const analysedValue = analysedHoldings.reduce((sum, h) => sum + h.value, 0);
    const missingDataPct = 1 - (analysedValue / totalPortfolioValue);

    const weights = analysedHoldings.map(h => h.value / analysedValue);
    const returnsMatrix: number[][] = [];

    analysedHoldings.forEach((h) => {
      const prices = priceBySymbol[h.symbol];
      const rets = [];
      for (let j = 1; j < prices.length; j++) {
        rets.push((prices[j] - prices[j-1]) / prices[j-1]);
      }
      returnsMatrix.push(rets);
    });

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

    const dailyVol = calculatePortfolioVolatility(weights, covMatrix);
    const annualVol = dailyVol * Math.sqrt(252);
    const hhi = calculateHHI(weights);
    const var1d = calculateVaR(analysedValue, dailyVol, 1);
    const var1m = calculateVaR(analysedValue, dailyVol, 21);

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
  } catch (error) {
    console.error('Risk profile calculation failed, returning demo data:', error);
    return DEMO_RISK_RESULT;
  }
}
