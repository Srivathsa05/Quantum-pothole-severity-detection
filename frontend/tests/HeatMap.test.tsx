import { test, expect } from '@playwright/test';

test('HeatMap renders GeoJSON', async ({ page }) => {
  // Mock fetch for heatmap
  await page.route('**/heatmap*', (route) => {
    route.fulfill({
      json: {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: { type: 'Polygon', coordinates: [[[0,0],[1,0],[1,1],[0,1],[0,0]]] },
          properties: { count_no: 5, count_minor: 3, count_severe: 1, total: 9, dominant: 'no' }
        }]
      }
    });
  });

  await page.goto('/heatmap');
  await page.waitForSelector('.leaflet-container');
  expect(await page.locator('.leaflet-container')).toBeVisible();
});
