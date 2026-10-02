import { test, expect } from '@playwright/test';

test('design validation and invalid address errors', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('CONFIG OR POOL ADDRESS').fill('invalid');
  await page.getByRole('button', { name: 'Inspect launch terms' }).click();
  await expect(page.getByRole('alert')).toContainText('Enter a valid Solana');
  await page.getByRole('button', { name: 'Design a launch' }).click();
  await expect(page.getByText('GRADUATION TARGET', { exact: true })).toBeVisible();
  await page.getByRole('spinbutton', { name: /Ending fee/ }).fill('200');
  await expect(page.getByRole('alert')).toContainText('Ending fee cannot exceed opening fee');
  await expect(page.getByRole('button', { name: 'Save this draft for account comparison' })).toBeDisabled();
  await page.getByRole('spinbutton', { name: /Ending fee/ }).fill('100');
  await expect(page.getByRole('button', { name: 'Save this draft for account comparison' })).toBeEnabled();
});

test('live mainnet draft comparison, share URL and mobile layout', async ({ page, context }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('button', { name: 'Design a launch' }).click();
  await page.getByRole('button', { name: 'Compare with a live mainnet example' }).click();
  await expect(page.getByRole('heading', { name: 'Launch receipt', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: /\/24 selected terms match/ })).toBeVisible();
  await expect(page.locator('.comparison-row.mismatch').first()).toBeVisible();
  await expect(page.locator('.comparison-row').filter({ hasText: 'Creator graduation fee share' })).toBeVisible();
  await expect(page.locator('.receipt-head')).toContainText('MAINNET');
  await page.screenshot({ path: 'test-results/mainnet-desktop.png', fullPage: true });
  await page.getByRole('button', { name: 'Share this receipt' }).click();
  await expect(page.getByRole('button', { name: 'Link copied' })).toBeVisible();
  const shared = await page.evaluate(() => navigator.clipboard.readText());
  expect(shared).toBe(page.url());
  const fresh = await context.newPage();
  await fresh.goto(shared);
  await expect(fresh.getByRole('heading', { name: 'Launch receipt', exact: true })).toBeVisible();
  await expect(fresh.locator('.comparison')).toHaveCount(0);
  expect(new URL(shared).searchParams.get('network')).toBe('mainnet');
  expect(new URL(shared).searchParams.get('address')).toBe('69xxfUPhKAUBFHhsjGMKdoCp9iordjvWktvdJRHAbz3y');
  await fresh.close();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('heading', { name: 'Launch receipt', exact: true })).toBeVisible();
  const dimensions = await page.evaluate(() => ({ width: innerWidth, content: document.documentElement.scrollWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.width);
  const rowsFit = await page.locator('.comparison-row').evaluateAll(rows => rows.every(row => row.scrollWidth <= row.clientWidth));
  expect(rowsFit).toBe(true);
  await page.screenshot({ path: 'test-results/mainnet-mobile.png', fullPage: true });
  await page.getByRole('button', { name: 'Clear draft' }).click();
  await expect(page.locator('.comparison')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('an RPC on a different network is rejected before account inspection', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('CONFIG OR POOL ADDRESS').fill('69xxfUPhKAUBFHhsjGMKdoCp9iordjvWktvdJRHAbz3y');
  await page.getByRole('button', { name: 'Use a different HTTPS RPC' }).click();
  await page.getByLabel('Optional RPC URL').fill('https://api.devnet.solana.com');
  await page.getByRole('button', { name: 'Inspect launch terms' }).click();
  await expect(page.getByRole('alert')).toContainText('RPC endpoint is not mainnet');
  await expect(page.getByRole('heading', { name: 'Launch receipt', exact: true })).toHaveCount(0);
});
