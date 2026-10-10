import { spawn } from 'child_process';
import http from 'http';

const ROUTES = [
  { path: '/learn/stocks', expected: 'Own a Piece of a Company' },
  { path: '/learn/mutual-funds', expected: 'Invest Through a Basket' },
  { path: '/learn/etfs', expected: 'A Basket You Can Trade' },
  { path: '/learn/bonds', expected: 'Become a Lender' },
  { path: '/learn/reits', expected: 'Real Estate Without the Building' },
  { path: '/learn/invits', expected: 'Infrastructure Behind Everyday Life' },
  { path: '/learn/invalid-asset', expectedStatus: 404 }
];

async function fetchRoute(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, html: data }));
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('Starting Next.js production server for smoke tests...');
  const server = spawn('npm', ['run', 'start'], { stdio: 'pipe' });

  // Wait for server to boot
  await new Promise(r => setTimeout(r, 4000));

  let passed = 0;
  let failed = 0;

  console.log('Running Smoke Tests on Learn Routes...\n');
  
  for (const route of ROUTES) {
    try {
      const { status, html } = await fetchRoute(route.path);
      
      if (route.expectedStatus) {
        if (status === route.expectedStatus) {
          console.log(`✅ [PASS] ${route.path} correctly returned status ${status}`);
          passed++;
        } else {
          console.error(`❌ [FAIL] ${route.path} expected ${route.expectedStatus}, got ${status}`);
          failed++;
        }
      } else {
        if (status === 200 && html.includes(route.expected)) {
          console.log(`✅ [PASS] ${route.path} rendered successfully with expected content.`);
          passed++;
        } else {
          console.error(`❌ [FAIL] ${route.path} failed. Status: ${status}. Found text: ${html.includes(route.expected)}`);
          failed++;
        }
      }
    } catch (e) {
      console.error(`❌ [FAIL] ${route.path} threw an error:`, e.message);
      failed++;
    }
  }

  console.log(`\nSmoke Test Results: ${passed} Passed, ${failed} Failed`);
  
  // Kill server
  server.kill();
  if (failed > 0) process.exit(1);
}

runTests();
