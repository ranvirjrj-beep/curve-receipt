import { test, expect } from '@playwright/test';
import { writeFileSync, mkdirSync } from 'node:fs';

// This is a paced demonstration recording, not an attempt to hide flaky tests.
// Every network read is live; the normal journey tests remain unpaced and unmocked.
test('record a truthful builder-to-live-account demonstration', async ({ page, context }) => {
  test.setTimeout(120_000);
  const start = Date.now();
  const timeline: { seconds: number; caption: string }[] = [];
  const mark = (caption: string) => timeline.push({ seconds: (Date.now() - start) / 1000, caption });
  await page.goto('/');
  mark('CurveReceipt | Compare a launch draft with live Meteora DBC economics');
  await page.waitForTimeout(6000);
  await page.getByRole('button', { name: 'Design a launch' }).click();
  await page.locator('.design-panel').scrollIntoViewIfNeeded();
  mark('Official SDK model: 2 SOL target, zero graduation fee, permanent LP lock');
  await page.waitForTimeout(9000);
  await page.getByRole('button', { name: 'Compare with a live mainnet example' }).click();
  await expect(page.getByRole('heading', { name: 'Launch receipt', exact: true })).toBeVisible();
  await page.locator('.receipt-head').scrollIntoViewIfNeeded();
  mark('Live MAINNET account read | Independent existing config, no wallet required');
  await page.waitForTimeout(9000);
  await page.getByRole('heading', { name: 'Graduation', exact: true }).scrollIntoViewIfNeeded();
  mark('Separate total migration fee from creator and partner recipient amounts');
  await page.waitForTimeout(9000);
  await page.locator('.comparison-title').scrollIntoViewIfNeeded();
  await expect(page.getByRole('heading', { name: /\/24 selected terms match/ })).toBeVisible();
  mark('24 selected terms | An editable local draft is not a signed creator promise');
  await page.waitForTimeout(10000);
  await page.locator('.comparison-row').filter({ hasText: 'Creator graduation fee share' }).scrollIntoViewIfNeeded();
  mark('Recipient shares matter: equal headline fees can pay different people');
  await page.waitForTimeout(9000);
  await page.getByRole('button', { name: 'Share this receipt' }).click();
  await expect(page.getByRole('button', { name: 'Link copied' })).toBeVisible();
  const shared = await page.evaluate(() => navigator.clipboard.readText());
  mark('Share the account URL | The local draft is deliberately absent from the link');
  await page.waitForTimeout(6000);
  const fresh = await context.newPage();
  await fresh.goto(shared);
  await expect(fresh.getByRole('heading', { name: 'Launch receipt', exact: true })).toBeVisible();
  await expect(fresh.locator('.comparison')).toHaveCount(0);
  await fresh.close();
  await page.getByRole('button', { name: 'Clear draft' }).click();
  await expect(page.locator('.comparison')).toHaveCount(0);
  await page.locator('.receipt-head').scrollIntoViewIfNeeded();
  mark('Prototype limits: no user traction; local config/pool proof is separate');
  await page.waitForTimeout(8000);
  mkdirSync('test-results', { recursive: true });
  writeFileSync('test-results/demo-timeline.json', JSON.stringify({
    environment: 'CI production bundle served locally; live mainnet RPC, no mocked account data',
    timeline,
    durationSeconds: (Date.now() - start) / 1000,
  }, null, 2));
});
