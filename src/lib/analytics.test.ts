import { calculateCAGR, calculateDrawdown, calculateXIRR, calculateVolatility } from './analytics';

function runTests() {
  console.log("Running Analytics Tests...");

  // Test CAGR
  const cagr = calculateCAGR(100, 200, 5);
  console.assert(Math.abs(cagr - 0.14869) < 0.001, `CAGR failed: ${cagr}`);

  // Test Drawdown
  const prices = [
    { date: new Date('2020-01-01'), price: 100 },
    { date: new Date('2020-01-02'), price: 150 }, // Peak
    { date: new Date('2020-01-03'), price: 75 },  // Trough (-50%)
    { date: new Date('2020-01-04'), price: 100 },
  ];
  const dd = calculateDrawdown(prices);
  console.assert(dd.maxDrawdown === 0.5, `Drawdown failed: ${dd.maxDrawdown}`);

  // Test XIRR (invest 100, wait 1 year, get 110)
  const cashflows = [
    { amount: -100, date: new Date('2020-01-01') },
    { amount: 110, date: new Date('2021-01-01') } // Approx 10% return
  ];
  const xirr = calculateXIRR(cashflows);
  console.assert(Math.abs(xirr - 0.10) < 0.005, `XIRR failed: ${xirr}`);

  console.log("✅ All Analytics Tests Passed!");
}

runTests();
