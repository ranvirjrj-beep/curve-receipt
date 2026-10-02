import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  timeout: 90_000,
  expect: { timeout: 30_000 },
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    browserName: 'chromium',
    baseURL: 'http://127.0.0.1:4173',
    viewport: { width: 1440, height: 1000 },
    video: { mode: 'on', size: { width: 1440, height: 1000 } },
    trace: 'on',
    screenshot: 'only-on-failure',
    permissions: ['clipboard-read', 'clipboard-write'],
    launchOptions: { slowMo: 250 },
  },
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    timeout: 30_000,
    reuseExistingServer: false,
  },
});
