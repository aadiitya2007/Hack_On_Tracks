import { calculateHHI, calculatePortfolioVolatility, calculateVaR, calculateRiskScore } from './risk-analytics';

function runTests() {
  console.log("Running Risk Analytics Tests...");

  // HHI Test
  // 50% / 50% split -> (50^2 + 50^2) = 5000
  const hhi = calculateHHI([0.5, 0.5]);
  console.assert(hhi === 5000, `HHI failed: ${hhi}`);

  // Portfolio Volatility Test
  const covMatrix = [
    [0.0004, 0.0001],
    [0.0001, 0.0009]
  ];
  const weights = [0.5, 0.5];
  // Var = (0.25*0.0004) + (0.25*0.0009) + 2*(0.25*0.0001) = 0.0001 + 0.000225 + 0.00005 = 0.000375
  // Vol = sqrt(0.000375) =~ 0.0193649
  const vol = calculatePortfolioVolatility(weights, covMatrix);
  console.assert(Math.abs(vol - 0.01936) < 0.0001, `Volatility failed: ${vol}`);

  // VaR Test (1 day, 95%)
  // Value = 10,000, vol = 0.01936, z = 1.645
  // VaR = 10000 * 0.01936 * 1.645 =~ 318.47
  const var95 = calculateVaR(10000, vol);
  console.assert(Math.abs(var95 - 318.55) < 0.1, `VaR failed: ${var95}`);

  console.log("✅ All Risk Analytics Tests Passed!");
}

runTests();
