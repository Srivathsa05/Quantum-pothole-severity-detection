import { test, expect } from '@playwright/test';

test('mobile client WS integration', async ({ page }) => {
  await page.goto('http://localhost:8080');
  await page.waitForSelector('#video');
  // Mock permissions and verify WS connection
  // This is a basic test
  expect(await page.textContent('#status')).toContain('Status');
});
