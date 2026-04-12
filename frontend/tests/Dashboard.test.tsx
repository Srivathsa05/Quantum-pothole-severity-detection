import { test, expect } from '@playwright/test';

test('Dashboard shows gamification data', async ({ page }) => {
  // Mock gamification endpoints
  await page.route('**/gamify/*', (route) => {
    const url = route.request().url();
    if (url.includes('/points')) {
      route.fulfill({ json: { points: 1240 } });
    } else if (url.includes('/badges')) {
      route.fulfill({ json: ['first_detection', 'explorer'] });
    } else if (url.includes('/leaderboard')) {
      route.fulfill({ json: [{ city: 'Bangalore', score: 1500 }] });
    } else if (url.includes('/mission/current')) {
      route.fulfill({ json: { description: 'Detect 10 severe potholes', target: 10, found: 7, severity: 'severe' } });
    }
  });

  await page.goto('/dashboard');
  await page.waitForSelector('text=1240');
  expect(await page.textContent()).toContain('1240');
});
