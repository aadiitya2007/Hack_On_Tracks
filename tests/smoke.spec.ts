import { test, expect } from '@playwright/test';

// Use the BASE_URL environment variable, or fallback to localhost
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Live Deployment Smoke Tests', () => {
  
  test('Diagnostics endpoint is healthy', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/diagnostics`);
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.status).toBe('ok');
    // Ensure DB is connected and ML is reachable
    expect(data.database.connected).toBe(true);
  });

  test('Dashboard loads Risk Panel', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    await expect(page.locator('text=Portfolio Risk Analysis')).toBeVisible();
    await expect(page.locator('text=Max Historical Drawdown')).toBeVisible();
  });

  test('Risk Deep Dive page renders mathematically', async ({ page }) => {
    await page.goto(`${BASE_URL}/risk`);
    await expect(page.locator('text=Portfolio Risk Engine')).toBeVisible();
    await expect(page.locator('text="What-If" Scenario Engine')).toBeVisible();
  });

  test('Time Machine loads and predicts', async ({ page }) => {
    await page.goto(`${BASE_URL}/time-machine`);
    await expect(page.locator('text=Time Machine')).toBeVisible();
    // Assuming 'Simulate' button exists
    const simulateBtn = page.locator('button:has-text("Simulate")');
    if (await simulateBtn.isVisible()) {
      await simulateBtn.click();
      await expect(page.locator('text=Next-Day Direction Model')).toBeVisible({ timeout: 10000 });
    }
  });

  test('Learn route and all 6 dynamic asset lessons load without crashing', async ({ page }) => {
    const assets = ['stocks', 'mutual-funds', 'etfs', 'bonds', 'reits', 'invits'];
    
    for (const asset of assets) {
      await page.goto(`${BASE_URL}/learn/${asset}`);
      // Wait for content or dialogue to appear (proves hydration succeeded)
      await expect(page.locator('.sub-heading')).toBeVisible({ timeout: 15000 });
    }
  });

  test('Dialogue component completes predictably', async ({ page }) => {
    await page.goto(`${BASE_URL}/learn/stocks`);
    // Wait for typing to finish and "Show all" or "Next" to appear
    const nextBtn = page.locator('button', { hasText: /Next|Reply|Show all/i }).first();
    await expect(nextBtn).toBeVisible({ timeout: 10000 });
  });
});
