import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,

  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],

  use: {
    baseURL: process.env.BASE_URL ?? 'https://automationintesting.online',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'ui',
      testMatch: 'tests/ui/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.BASE_URL ?? 'https://automationintesting.online',
      },
    },
    {
      name: 'ui-firefox',
      testMatch: 'tests/ui/**/*.spec.ts',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: process.env.BASE_URL ?? 'https://automationintesting.online',
      },
    },
    {
      name: 'api',
      testMatch: 'tests/api/**/*.spec.ts',
      use: {
        baseURL: process.env.API_BASE_URL ?? 'https://automationintesting.online',
      },
    },
  ],

  outputDir: 'test-results/',
});
