import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './playwright/tests',
  outputDir: './playwright/test-results',
  reporter: [['html', { outputFolder: './playwright/test-report' }]],
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // limit the number of workers running. start with 1, and if your tests pass reliably, consider increasing to
  // speed up runs. the new % option may be a good choice, e.g.  workers: '50%'
  workers: 1,

  // Retry on CI only.
  retries: process.env.CI ? 2 : 0,

  use: {
    // set this to a large number, to account for pages occasionally loading more slowly in your pipeline
    // than they do locally
    actionTimeout: 12000,

    baseURL: process.env.SITE_URL || 'http://localhost:8001',

    // Whether to ignore HTTPS errors during navigation.
    ignoreHTTPSErrors: true,

    contextOptions: {
      ignoreHTTPSErrors: true,
    },

    // Collect trace when retrying the failed test.
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1280, height: 720 },
  },

  projects: [
    // Test everything except full sitemap a11y check
    {
      name: 'main',
      testIgnore: /.a11y.spec.js/,
    },
    // Sitemap a11y test only
    {
      name: 'a11y',
      testMatch: /.a11y.spec.js/,
    },
  ],
})
